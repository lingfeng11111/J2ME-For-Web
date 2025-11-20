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

export class StoreInstructions {
  // ============================================
  // ISTORE (Int Store)
  // ============================================

  @Instruction(Opcode.ISTORE)
  static istore(frame: Frame, thread: Thread): void {
    const index = frame.method.getCode()!.code[frame.pc + 1];
    frame.setLocal(index, frame.stack.popInt());
    frame.pc += 2;
  }

  @Instruction(Opcode.ISTORE_0)
  static istore_0(frame: Frame, thread: Thread): void {
    frame.setLocal(0, frame.stack.popInt());
    frame.pc++;
  }

  @Instruction(Opcode.ISTORE_1)
  static istore_1(frame: Frame, thread: Thread): void {
    frame.setLocal(1, frame.stack.popInt());
    frame.pc++;
  }

  @Instruction(Opcode.ISTORE_2)
  static istore_2(frame: Frame, thread: Thread): void {
    frame.setLocal(2, frame.stack.popInt());
    frame.pc++;
  }

  @Instruction(Opcode.ISTORE_3)
  static istore_3(frame: Frame, thread: Thread): void {
    frame.setLocal(3, frame.stack.popInt());
    frame.pc++;
  }

  // ============================================
  // LSTORE (Long Store)
  // ============================================

  @Instruction(Opcode.LSTORE)
  static lstore(frame: Frame, thread: Thread): void {
    const index = frame.method.getCode()!.code[frame.pc + 1];
    frame.setLocal(index, frame.stack.popLong());
    frame.pc += 2;
  }

  @Instruction(Opcode.LSTORE_0)
  static lstore_0(frame: Frame, thread: Thread): void {
    frame.setLocal(0, frame.stack.popLong());
    frame.pc++;
  }

  @Instruction(Opcode.LSTORE_1)
  static lstore_1(frame: Frame, thread: Thread): void {
    frame.setLocal(1, frame.stack.popLong());
    frame.pc++;
  }

  @Instruction(Opcode.LSTORE_2)
  static lstore_2(frame: Frame, thread: Thread): void {
    frame.setLocal(2, frame.stack.popLong());
    frame.pc++;
  }

  @Instruction(Opcode.LSTORE_3)
  static lstore_3(frame: Frame, thread: Thread): void {
    frame.setLocal(3, frame.stack.popLong());
    frame.pc++;
  }

  // ============================================
  // ASTORE (Reference Store)
  // ============================================

  @Instruction(Opcode.ASTORE)
  static astore(frame: Frame, thread: Thread): void {
    const index = frame.method.getCode()!.code[frame.pc + 1];
    frame.setLocal(index, frame.stack.popRef());
    frame.pc += 2;
  }

  @Instruction(Opcode.ASTORE_0)
  static astore_0(frame: Frame, thread: Thread): void {
    frame.setLocal(0, frame.stack.popRef());
    frame.pc++;
  }

  @Instruction(Opcode.ASTORE_1)
  static astore_1(frame: Frame, thread: Thread): void {
    frame.setLocal(1, frame.stack.popRef());
    frame.pc++;
  }

  @Instruction(Opcode.ASTORE_2)
  static astore_2(frame: Frame, thread: Thread): void {
    frame.setLocal(2, frame.stack.popRef());
    frame.pc++;
  }

  @Instruction(Opcode.ASTORE_3)
  static astore_3(frame: Frame, thread: Thread): void {
    frame.setLocal(3, frame.stack.popRef());
    frame.pc++;
  }
}
