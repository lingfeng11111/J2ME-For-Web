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
import { JavaArray, ArrayType, getArrayTypeFromDescriptor } from "../../runtime/array";
import { ClassLoader } from "../../classfile/class-loader";

export class ArrayInstructions {
  @Instruction(Opcode.NEWARRAY)
  static newarray(frame: Frame, thread: Thread): void {
    const atype = frame.method.getCode()!.code[frame.pc + 1];
    const count = frame.stack.popInt();
    
    if (count < 0) {
      throw new Error("NegativeArraySizeException");
    }
    
    // 将 atype 转换为 ArrayType
    let componentType: ArrayType;
    switch (atype) {
      case 4: // T_BOOLEAN
        componentType = ArrayType.BOOLEAN;
        break;
      case 5: // T_CHAR
        componentType = ArrayType.CHAR;
        break;
      case 6: // T_FLOAT
        componentType = ArrayType.FLOAT;
        break;
      case 7: // T_DOUBLE
        componentType = ArrayType.DOUBLE;
        break;
      case 8: // T_BYTE
        componentType = ArrayType.BYTE;
        break;
      case 9: // T_SHORT
        componentType = ArrayType.SHORT;
        break;
      case 10: // T_INT
        componentType = ArrayType.INT;
        break;
      case 11: // T_LONG
        componentType = ArrayType.LONG;
        break;
      default:
        throw new Error(`Invalid array type: ${atype}`);
    }
    
    // 加载数组类
    const classLoader = frame.method.classInfo.classLoader || new ClassLoader({ readClass: () => null });
    const arrayClass = classLoader.loadClass(this.getArrayClassName(componentType));
    
    // 创建数组对象
    const array = new JavaArray(arrayClass, componentType, count);
    
    // 将数组引用压入栈
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
    
    // 从常量池获取组件类型
    const componentClassName = frame.method.classInfo.constantPool.getClassName(index);
    
    // 加载数组类（例如 [Ljava/lang/Object;）
    const classLoader = frame.method.classInfo.classLoader || new ClassLoader({ readClass: () => null });
    const arrayClassName = this.getObjectArrayClassName(componentClassName);
    const arrayClass = classLoader.loadClass(arrayClassName);
    
    // 创建数组对象
    const array = new JavaArray(arrayClass, ArrayType.OBJECT, count);
    
    // 将数组引用压入栈
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

  @Instruction(Opcode.LALOAD)
  static laload(frame: Frame, thread: Thread): void {
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

  @Instruction(Opcode.LASTORE)
  static lastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop(); // long value
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

  @Instruction(Opcode.FALOAD)
  static faload(frame: Frame, thread: Thread): void {
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

  @Instruction(Opcode.FASTORE)
  static fastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop(); // float value
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

  @Instruction(Opcode.DALOAD)
  static daload(frame: Frame, thread: Thread): void {
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

  @Instruction(Opcode.DASTORE)
  static dastore(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop(); // double value
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

  /**
   * 获取基本类型数组的类名
   */
  private static getArrayClassName(componentType: ArrayType): string {
    switch (componentType) {
      case ArrayType.BOOLEAN: return '[Z';
      case ArrayType.BYTE: return '[B';
      case ArrayType.CHAR: return '[C';
      case ArrayType.SHORT: return '[S';
      case ArrayType.INT: return '[I';
      case ArrayType.LONG: return '[J';
      case ArrayType.FLOAT: return '[F';
      case ArrayType.DOUBLE: return '[D';
      default: throw new Error(`Invalid component type: ${componentType}`);
    }
  }

  /**
   * 获取对象数组的类名
   */
  private static getObjectArrayClassName(componentClassName: string): string {
    return `[L${componentClassName};`;
  }
}