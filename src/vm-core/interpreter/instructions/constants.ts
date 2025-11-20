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

export class ConstantInstructions {
  @Instruction(Opcode.NOP)
  static nop(frame: Frame, thread: Thread): void {
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_M1)
  static iconst_m1(frame: Frame, thread: Thread): void {
    frame.stack.push(-1);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_0)
  static iconst_0(frame: Frame, thread: Thread): void {
    frame.stack.push(0);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_1)
  static iconst_1(frame: Frame, thread: Thread): void {
    frame.stack.push(1);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_2)
  static iconst_2(frame: Frame, thread: Thread): void {
    frame.stack.push(2);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_3)
  static iconst_3(frame: Frame, thread: Thread): void {
    frame.stack.push(3);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_4)
  static iconst_4(frame: Frame, thread: Thread): void {
    frame.stack.push(4);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_5)
  static iconst_5(frame: Frame, thread: Thread): void {
    frame.stack.push(5);
    frame.pc++;
  }

  @Instruction(Opcode.BIPUSH)
  static bipush(frame: Frame, thread: Thread): void {
    const byte = frame.method.getCode()!.code[frame.pc + 1];
    // 符号扩展
    const value = (byte << 24) >> 24;
    frame.stack.push(value);
    frame.pc += 2;
  }
}
