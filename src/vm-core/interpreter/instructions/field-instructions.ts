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

export class FieldInstructions {
  @Instruction(Opcode.GETSTATIC)
  static getstatic(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池获取字段引用
    const fieldRef = frame.method.classInfo.constantPool.getEntry(index);
    if (!fieldRef || fieldRef.tag !== 9) { // CONSTANT_Fieldref = 9
      throw new Error(`Invalid field reference at index ${index}`);
    }
    
    // TODO: 解析字段所在的类和字段描述
    // 暂时用占位符实现
    frame.stack.push(null); // 静态字段值
    
    frame.pc += 3;
  }

  @Instruction(Opcode.PUTSTATIC)
  static putstatic(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从常量池获取字段引用
    const fieldRef = frame.method.classInfo.constantPool.getEntry(index);
    if (!fieldRef || fieldRef.tag !== 9) {
      throw new Error(`Invalid field reference at index ${index}`);
    }
    
    // 弹出值并存入静态字段
    const value = frame.stack.pop();
    // TODO: 实际存储到类的静态字段表
    
    frame.pc += 3;
  }

  @Instruction(Opcode.GETFIELD)
  static getfield(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从操作数栈获取对象引用
    const objectRef = frame.stack.pop();
    if (objectRef === null) {
      throw new Error("NullPointerException");
    }
    
    // 从常量池获取字段引用
    const fieldRef = frame.method.classInfo.constantPool.getEntry(index);
    if (!fieldRef || fieldRef.tag !== 9) {
      throw new Error(`Invalid field reference at index ${index}`);
    }
    
    // TODO: 从对象实例中获取字段值
    // 暂时用占位符实现
    frame.stack.push(null); // 字段值
    
    frame.pc += 3;
  }

  @Instruction(Opcode.PUTFIELD)
  static putfield(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    
    // 从操作数栈获取值和对象引用
    const value = frame.stack.pop();
    const objectRef = frame.stack.pop();
    
    if (objectRef === null) {
      throw new Error("NullPointerException");
    }
    
    // 从常量池获取字段引用
    const fieldRef = frame.method.classInfo.constantPool.getEntry(index);
    if (!fieldRef || fieldRef.tag !== 9) {
      throw new Error(`Invalid field reference at index ${index}`);
    }
    
    // TODO: 将值存入对象实例的字段
    
    frame.pc += 3;
  }
}