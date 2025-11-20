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
 * J2ME-For-Web Array Instructions
 * 数组操作指令
 * NEWARRAY, ANEWARRAY, ARRAYLENGTH, AALOAD, AASTORE, etc.
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";

export class ArrayInstructions {
  @Instruction(Opcode.NEWARRAY)
  static newarray(frame: Frame, thread: Thread): void {
    const atype = frame.method.getCode()!.code[frame.pc + 1];
    const count = frame.stack.popInt();
    
    if (count < 0) {
      throw new Error("NegativeArraySizeException");
    }
    
    // 创建基本类型数组
    let array: any[];
    switch (atype) {
      case 4: // T_BOOLEAN
      case 5: // T_CHAR
      case 8: // T_BYTE
      case 9: // T_SHORT
      case 10: // T_INT
        array = new Array(count).fill(0);
        break;
      case 6: // T_FLOAT
        array = new Array(count).fill(0.0);
        break;
      case 7: // T_DOUBLE
        array = new Array(count).fill(0.0);
        break;
      case 11: // T_LONG
        array = new Array(count).fill(0n);
        break;
      default:
        throw new Error(`Invalid array type: ${atype}`);
    }
    
    frame.stack.push(array);
    frame.pc += 2;
  }

  @Instruction(Opcode.ANEWARRAY)
  static anewarray(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const indexbyte1 = code.code[frame.pc + 1];
    const indexbyte2 = code.code[frame.pc + 2];
    const index = (indexbyte1 << 8) | indexbyte2;
    const count = frame.stack.popInt();
    
    if (count < 0) {
      throw new Error("NegativeArraySizeException");
    }
    
    // 创建对象数组
    const array = new Array(count).fill(null);
    frame.stack.push(array);
    
    frame.pc += 3;
  }

  @Instruction(Opcode.ARRAYLENGTH)
  static arraylength(frame: Frame, thread: Thread): void {
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    frame.stack.push(arrayref.length);
    frame.pc++;
  }

  @Instruction(Opcode.AALOAD)
  static aaload(frame: Frame, thread: Thread): void {
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    frame.stack.push(arrayref[index]);
    frame.pc++;
  }

  @Instruction(Opcode.AASTORE)
  static aastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    arrayref[index] = value;
    frame.pc++;
  }

  @Instruction(Opcode.BALOAD)
  static baload(frame: Frame, thread: Thread): void {
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    // byte数组，需要符号扩展到int
    const value = arrayref[index] & 0xFF;
    frame.stack.push((value << 24) >> 24);
    frame.pc++;
  }

  @Instruction(Opcode.BASTORE)
  static bastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    // 存储为byte（取低8位）
    arrayref[index] = value & 0xFF;
    frame.pc++;
  }

  @Instruction(Opcode.CALOAD)
  static caload(frame: Frame, thread: Thread): void {
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    // char数组，零扩展到int
    frame.stack.push(arrayref[index] & 0xFFFF);
    frame.pc++;
  }

  @Instruction(Opcode.CASTORE)
  static castore(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    // 存储为char（取低16位）
    arrayref[index] = value & 0xFFFF;
    frame.pc++;
  }

  @Instruction(Opcode.SALOAD)
  static saload(frame: Frame, thread: Thread): void {
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    // short数组，符号扩展到int
    const value = arrayref[index] & 0xFFFF;
    frame.stack.push((value << 16) >> 16);
    frame.pc++;
  }

  @Instruction(Opcode.SASTORE)
  static sastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    // 存储为short（取低16位）
    arrayref[index] = value & 0xFFFF;
    frame.pc++;
  }

  @Instruction(Opcode.IALOAD)
  static iaload(frame: Frame, thread: Thread): void {
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    frame.stack.push(arrayref[index]);
    frame.pc++;
  }

  @Instruction(Opcode.IASTORE)
  static iastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    const index = frame.stack.popInt();
    const arrayref = frame.stack.pop();
    
    if (arrayref === null) {
      throw new Error("NullPointerException");
    }
    
    if (!Array.isArray(arrayref)) {
      throw new Error("Invalid array reference");
    }
    
    if (index < 0 || index >= arrayref.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    
    arrayref[index] = value;
    frame.pc++;
  }
}