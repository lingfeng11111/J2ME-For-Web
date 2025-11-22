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
 * J2ME-For-Web Type Conversion Instructions
 * 类型转换指令
 * I2L, I2F, I2D, L2I, L2F, L2D, F2I, F2L, F2D, D2I, D2L, D2F, I2B, I2C, I2S
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";

export class ConversionInstructions {
  /**
   * int to long
   */
  @Instruction(Opcode.I2L)
  static i2l(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    frame.stack.pushLong(BigInt(value));
    frame.pc++;
  }

  /**
   * int to float
   */
  @Instruction(Opcode.I2F)
  static i2f(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    frame.stack.push(value); // JavaScript number 可以表示 int 和 float
    frame.pc++;
  }

  /**
   * int to double
   */
  @Instruction(Opcode.I2D)
  static i2d(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    frame.stack.push(value); // JavaScript number 可以表示 int 和 double
    frame.pc++;
  }

  /**
   * long to int
   */
  @Instruction(Opcode.L2I)
  static l2i(frame: Frame, thread: Thread): void {
    const value = frame.stack.popLong();
    // 转换为 32 位整数
    frame.stack.push(Number(BigInt.asIntN(32, value)));
    frame.pc++;
  }

  /**
   * long to float
   */
  @Instruction(Opcode.L2F)
  static l2f(frame: Frame, thread: Thread): void {
    const value = frame.stack.popLong();
    frame.stack.push(Number(value));
    frame.pc++;
  }

  /**
   * long to double
   */
  @Instruction(Opcode.L2D)
  static l2d(frame: Frame, thread: Thread): void {
    const value = frame.stack.popLong();
    frame.stack.push(Number(value));
    frame.pc++;
  }

  /**
   * float to int
   */
  @Instruction(Opcode.F2I)
  static f2i(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop() as number;
    // Java 的 float to int 是截断（向零取整）
    const intValue = value >= 0 ? Math.floor(value) : Math.ceil(value);
    frame.stack.push(intValue | 0); // 转换为 32 位整数
    frame.pc++;
  }

  /**
   * float to long
   */
  @Instruction(Opcode.F2L)
  static f2l(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop() as number;
    const intValue = value >= 0 ? Math.floor(value) : Math.ceil(value);
    frame.stack.pushLong(BigInt(intValue));
    frame.pc++;
  }

  /**
   * float to double
   */
  @Instruction(Opcode.F2D)
  static f2d(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    frame.stack.push(value); // JavaScript number 已经是 double 精度
    frame.pc++;
  }

  /**
   * double to int
   */
  @Instruction(Opcode.D2I)
  static d2i(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop() as number;
    const intValue = value >= 0 ? Math.floor(value) : Math.ceil(value);
    frame.stack.push(intValue | 0);
    frame.pc++;
  }

  /**
   * double to long
   */
  @Instruction(Opcode.D2L)
  static d2l(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop() as number;
    const intValue = value >= 0 ? Math.floor(value) : Math.ceil(value);
    frame.stack.pushLong(BigInt(intValue));
    frame.pc++;
  }

  /**
   * double to float
   */
  @Instruction(Opcode.D2F)
  static d2f(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    // JavaScript number 已经是 double，转换为 float 需要精度损失
    // 这里简化处理，保持原值
    frame.stack.push(value);
    frame.pc++;
  }

  /**
   * int to byte
   */
  @Instruction(Opcode.I2B)
  static i2b(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    // 转换为 8 位有符号整数
    const byteValue = (value << 24) >> 24;
    frame.stack.push(byteValue);
    frame.pc++;
  }

  /**
   * int to char
   */
  @Instruction(Opcode.I2C)
  static i2c(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    // 转换为 16 位无符号整数
    const charValue = value & 0xFFFF;
    frame.stack.push(charValue);
    frame.pc++;
  }

  /**
   * int to short
   */
  @Instruction(Opcode.I2S)
  static i2s(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    // 转换为 16 位有符号整数
    const shortValue = (value << 16) >> 16;
    frame.stack.push(shortValue);
    frame.pc++;
  }
}
