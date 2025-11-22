/*
 * Copyright (C) 2025 Lingfeng <3374080053@qq.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";
import { MethodInfo } from "../../classfile/method-info";
import { NativeRegistry } from "../../native/native-registry";
import { ClassLoader } from "../../classfile/class-loader";
import { JavaObject } from "../../runtime/object";
import { ClassInfo } from "../../classfile/class-info";

export class InvokeInstructions {
  /**
   * 通用方法调用逻辑
   */
  private static invokeMethod(frame: Frame, thread: Thread, method: MethodInfo): void {
    // 1. 检查是否是 Native 方法
    if (method.isNative()) {
      const handler = NativeRegistry.get(
        method.classInfo.thisClass,
        method.name,
        method.descriptor
      );
      
      if (!handler) {
        throw new Error(
          `UnsatisfiedLinkError: ${method.classInfo.thisClass}.${method.name}${method.descriptor}`
        );
      }

      // Native 方法不需要创建新栈帧(或者创建一个特殊的 Native 栈帧)
      // 这里我们简单地直接调用 handler,传入当前栈帧(作为调用者上下文)
      // 注意: 真实的 Native 方法可能需要访问参数,参数在当前栈帧的操作数栈顶
      handler(frame, thread);
    } else {
      // 2. 创建新栈帧
      const newFrame = new Frame(method, frame);
      
      // 3. 传递参数
      // 参数在调用者栈顶,需要弹出并存入新栈帧的局部变量表
      const argCount = method.getParameterCount();
      // 如果不是静态方法,还有 'this' 参数
      const slotCount = argCount + (method.isStatic() ? 0 : 1);
      
      // 注意: 参数传递顺序
      for (let i = slotCount - 1; i >= 0; i--) {
        const val = frame.stack.pop();
        newFrame.setLocal(i, val);
      }

      // 4. 推入新栈帧
      thread.pushFrame(newFrame);
    }
  }

  /**
   * invokespecial 指令
   * 调用实例方法，专门用于私有方法、构造方法和父类方法
   */
  @Instruction(Opcode.INVOKESPECIAL)
  static invokespecial(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const index = (code.code[frame.pc + 1] << 8) | code.code[frame.pc + 2];
    
    // 从常量池解析方法引用
    const methodRef = frame.method.classInfo.constantPool.getMethodRef(index);
    
    // 加载类
    const classLoader = frame.method.classInfo.classLoader || 
                       (frame.method.classInfo as any).classLoader || 
                       new ClassLoader({ readClass: () => null });
    const classInfo = classLoader.loadClass(methodRef.className);
    
    // 查找方法
    const method = classInfo.getMethod(methodRef.methodName, methodRef.descriptor);
    if (!method) {
      throw new Error(`NoSuchMethodError: ${methodRef.className}.${methodRef.methodName}${methodRef.descriptor}`);
    }
    
    // 调用方法
    this.invokeMethod(frame, thread, method);
    
    // 更新 PC
    frame.pc += 3;
  }

  /**
   * invokevirtual 指令
   * 调用实例方法，支持多态（虚方法调用）
   */
  @Instruction(Opcode.INVOKEVIRTUAL)
  static invokevirtual(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const index = (code.code[frame.pc + 1] << 8) | code.code[frame.pc + 2];
    
    // 从常量池解析方法引用
    const methodRef = frame.method.classInfo.constantPool.getMethodRef(index);
    
    // 获取 this 对象（在栈顶）
    const argCount = MethodInfo.prototype.getParameterCount.call({ descriptor: methodRef.descriptor });
    const thisObj = frame.stack.peek() as JavaObject | null;
    
    if (!thisObj) {
      throw new Error("NullPointerException: Cannot invoke method on null object");
    }
    
    // 根据实际对象类型查找方法（支持多态）
    const classLoader = frame.method.classInfo.classLoader || 
                       (frame.method.classInfo as any).classLoader || 
                       new ClassLoader({ readClass: () => null });
    
    // 从实际对象的类开始查找方法
    let targetClass = thisObj.classInfo;
    let method: any = null;
    
    while (targetClass && !method) {
      method = targetClass.getMethod(methodRef.methodName, methodRef.descriptor);
      if (!method && targetClass.superClass) {
        targetClass = classLoader.loadClass(targetClass.superClass);
      } else {
        break;
      }
    }
    
    if (!method) {
      throw new Error(`NoSuchMethodError: ${methodRef.className}.${methodRef.methodName}${methodRef.descriptor}`);
    }
    
    // 调用方法
    this.invokeMethod(frame, thread, method);
    
    // 更新 PC
    frame.pc += 3;
  }

  /**
   * invokestatic 指令
   * 调用静态方法
   */
  @Instruction(Opcode.INVOKESTATIC)
  static invokestatic(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const index = (code.code[frame.pc + 1] << 8) | code.code[frame.pc + 2];
    
    // 从常量池解析方法引用
    const methodRef = frame.method.classInfo.constantPool.getMethodRef(index);
    
    // 加载类
    const classLoader = frame.method.classInfo.classLoader || 
                       (frame.method.classInfo as any).classLoader || 
                       new ClassLoader({ readClass: () => null });
    const classInfo = classLoader.loadClass(methodRef.className);
    
    // 查找静态方法
    const method = classInfo.getMethod(methodRef.methodName, methodRef.descriptor);
    if (!method) {
      throw new Error(`NoSuchMethodError: ${methodRef.className}.${methodRef.methodName}${methodRef.descriptor}`);
    }
    
    if (!method.isStatic()) {
      throw new Error(`IncompatibleClassChangeError: Expected static method`);
    }
    
    // 调用方法
    this.invokeMethod(frame, thread, method);
    
    // 更新 PC
    frame.pc += 3;
  }
}
