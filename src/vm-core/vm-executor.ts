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

/**
 * J2ME-For-Web VM Executor
 * VM 执行器，用于执行 Java 方法
 */

import { ClassLoader } from "./classfile/class-loader";
import { Thread } from "./threading/thread";
import { Interpreter } from "./interpreter/interpreter";
import { Frame } from "./interpreter/frame";
import { JavaObject } from "./runtime/object";
import { MethodInfo } from "./classfile/method-info";
import { JavaValue } from "./core/types";

/**
 * VM 执行器
 * 提供高级 API 来执行 Java 方法
 */
export class VMExecutor {
  private classLoader: ClassLoader;

  constructor(classLoader: ClassLoader) {
    this.classLoader = classLoader;
  }

  /**
   * 创建对象实例
   * @param className 类名（内部格式，如 "java/lang/Object"）
   * @returns 新创建的对象
   */
  createInstance(className: string): JavaObject {
    // 加载类
    const classInfo = this.classLoader.loadClass(className);
    
    // 创建对象
    const instance = new JavaObject(classInfo);
    
    return instance;
  }

  /**
   * 调用构造函数
   * @param instance 对象实例
   * @param descriptor 构造函数描述符（如 "()V"）
   * @param args 构造函数参数
   */
  invokeConstructor(instance: JavaObject, descriptor: string, args: JavaValue[] = []): void {
    // 查找构造函数
    const constructor = instance.classInfo.methods.find(
      m => m.name === "<init>" && m.descriptor === descriptor
    );

    if (!constructor) {
      throw new Error(`Constructor not found: ${instance.classInfo.thisClass}.<init>${descriptor}`);
    }

    // 调用构造函数
    this.invokeMethod(instance, constructor, args);
  }

  /**
   * 调用实例方法
   * @param instance 对象实例（null 表示静态方法）
   * @param method 方法信息
   * @param args 方法参数
   * @returns 方法返回值
   */
  invokeMethod(instance: JavaObject | null, method: MethodInfo, args: JavaValue[] = []): JavaValue {
    // 创建线程
    const thread = new Thread();
    
    // 设置 classLoader（用于 new 指令等）
    (thread as any).classLoader = this.classLoader;

    // 准备局部变量（参数）
    const locals: JavaValue[] = [];
    
    // 如果是实例方法，第一个参数是 this
    if (instance !== null) {
      locals.push(instance);
    }
    
    // 添加其他参数
    locals.push(...args);

    // 创建栈帧
    const frame = new Frame(method);
    
    // 设置局部变量
    for (let i = 0; i < locals.length; i++) {
      frame.setLocal(i, locals[i]);
    }

    // 压入栈帧
    thread.pushFrame(frame);

    // 执行方法
    const executor = Interpreter.execute(thread);
    
    // 同步执行（简化版，实际应该是异步的）
    let result = executor.next();
    while (!result.done) {
      result = executor.next();
    }

    // 获取返回值
    if (thread.hasFrames()) {
      // 如果还有栈帧，说明有返回值在栈顶
      const returnFrame = thread.currentFrame();
      if (returnFrame.stack.size() > 0) {
        return returnFrame.stack.pop();
      }
    }

    return null;
  }

  /**
   * 调用静态方法
   * @param className 类名
   * @param methodName 方法名
   * @param descriptor 方法描述符
   * @param args 方法参数
   * @returns 方法返回值
   */
  invokeStaticMethod(className: string, methodName: string, descriptor: string, args: JavaValue[] = []): JavaValue {
    // 加载类
    const classInfo = this.classLoader.loadClass(className);
    
    // 查找方法
    const method = classInfo.methods.find(
      m => m.name === methodName && m.descriptor === descriptor
    );

    if (!method) {
      throw new Error(`Static method not found: ${className}.${methodName}${descriptor}`);
    }

    // 调用方法
    return this.invokeMethod(null, method, args);
  }

  /**
   * 调用实例方法（通过名称和描述符）
   * @param instance 对象实例
   * @param methodName 方法名
   * @param descriptor 方法描述符
   * @param args 方法参数
   * @returns 方法返回值
   */
  invokeInstanceMethod(instance: JavaObject, methodName: string, descriptor: string, args: JavaValue[] = []): JavaValue {
    // 查找方法
    const method = instance.classInfo.methods.find(
      m => m.name === methodName && m.descriptor === descriptor
    );

    if (!method) {
      throw new Error(`Instance method not found: ${instance.classInfo.thisClass}.${methodName}${descriptor}`);
    }

    // 调用方法
    return this.invokeMethod(instance, method, args);
  }
}
