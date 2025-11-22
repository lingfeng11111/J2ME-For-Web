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
 * J2ME-For-Web Type Check Instructions
 * 类型检查指令
 * INSTANCEOF, CHECKCAST
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";
import { JavaObject } from "../../runtime/object";
import { JavaArray } from "../../runtime/array";

export class TypeInstructions {
  /**
   * 检查对象是否是指定类的实例
   * instanceof 指令
   */
  @Instruction(Opcode.INSTANCEOF)
  static instanceof_check(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池获取类名
    const className = frame.method.classInfo.constantPool.getClassName(index);
    
    // 从栈中弹出对象引用
    const objectref = frame.stack.pop();
    
    // null 总是返回 false
    if (objectref === null) {
      frame.stack.push(0);
      frame.pc += 3;
      return;
    }
    
    // 检查是否是指定类的实例
    const isInstance = TypeInstructions.isInstanceOf(objectref, className);
    frame.stack.push(isInstance ? 1 : 0);
    
    frame.pc += 3;
  }

  /**
   * 检查对象类型并转换
   * checkcast 指令
   */
  @Instruction(Opcode.CHECKCAST)
  static checkcast(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池获取类名
    const className = frame.method.classInfo.constantPool.getClassName(index);
    
    // 查看栈顶对象引用（不弹出）
    const objectref = frame.stack.peek();
    
    // null 总是通过检查
    if (objectref === null) {
      frame.pc += 3;
      return;
    }
    
    // 检查是否是指定类的实例
    const isInstance = TypeInstructions.isInstanceOf(objectref, className);
    
    if (!isInstance) {
      throw new Error(`ClassCastException: Cannot cast to ${className}`);
    }
    
    frame.pc += 3;
  }

  /**
   * 辅助方法：检查对象是否是指定类的实例
   */
  private static isInstanceOf(obj: any, targetClassName: string): boolean {
    // 处理数组
    if (obj instanceof JavaArray) {
      // 数组类型检查
      const arrayClassName = obj.classInfo.thisClass;
      return TypeInstructions.isClassCompatible(arrayClassName, targetClassName);
    }
    
    // 处理普通对象
    if (obj instanceof JavaObject) {
      const objClassName = obj.classInfo.thisClass;
      return TypeInstructions.isClassCompatible(objClassName, targetClassName);
    }
    
    // 其他类型（基本类型包装等）
    return false;
  }

  /**
   * 辅助方法：检查类是否兼容（包括继承和接口实现）
   */
  private static isClassCompatible(sourceClass: string, targetClass: string): boolean {
    // 完全相同
    if (sourceClass === targetClass) {
      return true;
    }
    
    // 数组类型特殊处理
    if (sourceClass.startsWith('[') && targetClass.startsWith('[')) {
      // 数组维度必须相同
      const sourceDim = sourceClass.lastIndexOf('[') + 1;
      const targetDim = targetClass.lastIndexOf('[') + 1;
      if (sourceDim !== targetDim) {
        return false;
      }
      
      // 检查元素类型
      const sourceElement = sourceClass.substring(sourceDim);
      const targetElement = targetClass.substring(targetDim);
      
      // 基本类型数组必须完全匹配
      if (sourceElement.length === 1 && targetElement.length === 1) {
        return sourceElement === targetElement;
      }
      
      // 对象数组可以协变
      if (sourceElement.startsWith('L') && targetElement.startsWith('L')) {
        const sourceType = sourceElement.substring(1, sourceElement.length - 1);
        const targetType = targetElement.substring(1, targetElement.length - 1);
        return TypeInstructions.isClassCompatible(sourceType, targetType);
      }
      
      return false;
    }
    
    // 所有对象都是 java/lang/Object 的实例
    if (targetClass === 'java/lang/Object') {
      return true;
    }
    
    // TODO: 实现完整的类层次结构检查
    // 这需要访问 ClassLoader 来获取父类和接口信息
    // 目前简化处理，只检查直接匹配和 Object
    
    return false;
  }
}
