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
 * J2ME-For-Web Field Access Instructions
 * 字段访问指令
 * GETSTATIC, PUTSTATIC, GETFIELD, PUTFIELD
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";
import { JavaObject } from "../../runtime/object";

export class FieldInstructions {
  /**
   * 静态字段缓存 (类名 -> 字段键 -> 值)
   * 用于存储系统类和用户类的静态字段值
   */
  private static staticFieldCache = new Map<string, Map<string, any>>();

  /**
   * 获取静态字段的值
   */
  @Instruction(Opcode.GETSTATIC)
  static getstatic(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池解析字段引用
    const fieldRef = frame.method.classInfo.constantPool.getFieldRef(index);
    
    // 获取或创建类的静态字段存储
    const classStaticFields = FieldInstructions.getClassStaticFields(fieldRef.className);
    const fieldKey = `${fieldRef.fieldName}:${fieldRef.descriptor}`;
    
    // 获取字段值（如果不存在，返回默认值）
    let value = classStaticFields.get(fieldKey);
    if (value === undefined) {
      value = FieldInstructions.getDefaultValue(fieldRef.descriptor);
      classStaticFields.set(fieldKey, value);
    }
    
    // 将值压入栈
    frame.stack.push(value);
    
    frame.pc += 3;
  }

  /**
   * 设置静态字段的值
   */
  @Instruction(Opcode.PUTSTATIC)
  static putstatic(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池解析字段引用
    const fieldRef = frame.method.classInfo.constantPool.getFieldRef(index);
    
    // 从栈中弹出值
    const value = frame.stack.pop();
    
    // 获取或创建类的静态字段存储
    const classStaticFields = FieldInstructions.getClassStaticFields(fieldRef.className);
    const fieldKey = `${fieldRef.fieldName}:${fieldRef.descriptor}`;
    
    // 存储字段值
    classStaticFields.set(fieldKey, value);
    
    frame.pc += 3;
  }

  /**
   * 获取对象实例字段的值
   */
  @Instruction(Opcode.GETFIELD)
  static getfield(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池解析字段引用
    const fieldRef = frame.method.classInfo.constantPool.getFieldRef(index);
    
    // 从栈中弹出对象引用
    const object = frame.stack.pop();
    
    if (object === null) {
      throw new Error(`NullPointerException: Cannot access field ${fieldRef.fieldName} on null object`);
    }
    
    if (!(object instanceof JavaObject)) {
      throw new Error(`Invalid object type for getfield: ${typeof object}`);
    }
    
    // 获取字段值
    const value = object.getField(fieldRef.fieldName, fieldRef.descriptor);
    
    // 将值压入栈
    frame.stack.push(value);
    
    frame.pc += 3;
  }

  /**
   * 设置对象实例字段的值
   */
  @Instruction(Opcode.PUTFIELD)
  static putfield(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池解析字段引用
    const fieldRef = frame.method.classInfo.constantPool.getFieldRef(index);
    
    // 从栈中弹出值和对象引用（值先弹出）
    const value = frame.stack.pop();
    const object = frame.stack.pop();
    
    if (object === null) {
      throw new Error(`NullPointerException: Cannot access field ${fieldRef.fieldName} on null object`);
    }
    
    if (!(object instanceof JavaObject)) {
      throw new Error(`Invalid object type for putfield: ${typeof object}`);
    }
    
    // 设置字段值
    object.setField(fieldRef.fieldName, fieldRef.descriptor, value);
    
    frame.pc += 3;
  }

  /**
   * 获取类的静态字段存储 Map
   */
  private static getClassStaticFields(className: string): Map<string, any> {
    if (!FieldInstructions.staticFieldCache.has(className)) {
      FieldInstructions.staticFieldCache.set(className, new Map());
    }
    return FieldInstructions.staticFieldCache.get(className)!;
  }

  /**
   * 获取字段类型的默认值
   */
  private static getDefaultValue(descriptor: string): any {
    switch (descriptor) {
      case 'Z': // boolean
      case 'B': // byte
      case 'C': // char
      case 'S': // short
      case 'I': // int
        return 0;
      case 'J': // long
        return 0n;
      case 'F': // float
      case 'D': // double
        return 0.0;
      default:
        // 引用类型
        return null;
    }
  }
}
