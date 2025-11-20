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

export class MathInstructions {
  @Instruction(Opcode.IADD)
  static iadd(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popInt();
    const v1 = frame.stack.popInt();
    // JS 位运算会自动转换为 32 位整数
    frame.stack.push((v1 + v2) | 0);
    frame.pc++;
  }

  @Instruction(Opcode.ISUB)
  static isub(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popInt();
    const v1 = frame.stack.popInt();
    frame.stack.push((v1 - v2) | 0);
    frame.pc++;
  }

  @Instruction(Opcode.IMUL)
  static imul(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popInt();
    const v1 = frame.stack.popInt();
    frame.stack.push(Math.imul(v1, v2));
    frame.pc++;
  }

  @Instruction(Opcode.LADD)
  static ladd(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    frame.stack.pushLong(v1 + v2);
    frame.pc++;
  }

  @Instruction(Opcode.LSUB)
  static lsub(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    frame.stack.pushLong(v1 - v2);
    frame.pc++;
  }

  @Instruction(Opcode.LMUL)
  static lmul(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    frame.stack.pushLong(v1 * v2);
    frame.pc++;
  }

  @Instruction(Opcode.LDIV)
  static ldiv(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    if (v2 === 0n) {
      throw new Error("ArithmeticException: / by zero");
    }
    frame.stack.pushLong(v1 / v2);
    frame.pc++;
  }

  @Instruction(Opcode.LREM)
  static lrem(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    if (v2 === 0n) {
      throw new Error("ArithmeticException: / by zero");
    }
    frame.stack.pushLong(v1 % v2);
    frame.pc++;
  }

  @Instruction(Opcode.LNEG)
  static lneg(frame: Frame, thread: Thread): void {
    const value = frame.stack.popLong();
    frame.stack.pushLong(-value);
    frame.pc++;
  }

  @Instruction(Opcode.LSHL)
  static lshl(frame: Frame, thread: Thread): void {
    const shift = frame.stack.popInt() & 0x3f; // 只使用低6位
    const value = frame.stack.popLong();
    frame.stack.pushLong(value << BigInt(shift));
    frame.pc++;
  }

  @Instruction(Opcode.LSHR)
  static lshr(frame: Frame, thread: Thread): void {
    const shift = frame.stack.popInt() & 0x3f;
    const value = frame.stack.popLong();
    frame.stack.pushLong(value >> BigInt(shift));
    frame.pc++;
  }

  @Instruction(Opcode.LUSHR)
  static lushr(frame: Frame, thread: Thread): void {
    const shift = frame.stack.popInt() & 0x3f;
    const value = frame.stack.popLong();
    // BigInt 没有无符号右移，用掩码实现
    const mask = shift === 0 ? value : value >> BigInt(shift);
    frame.stack.pushLong(mask);
    frame.pc++;
  }

  @Instruction(Opcode.LAND)
  static land(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    frame.stack.pushLong(v1 & v2);
    frame.pc++;
  }

  @Instruction(Opcode.LOR)
  static lor(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    frame.stack.pushLong(v1 | v2);
    frame.pc++;
  }

  @Instruction(Opcode.LXOR)
  static lxor(frame: Frame, thread: Thread): void {
    const v2 = frame.stack.popLong();
    const v1 = frame.stack.popLong();
    frame.stack.pushLong(v1 ^ v2);
    frame.pc++;
  }
}
