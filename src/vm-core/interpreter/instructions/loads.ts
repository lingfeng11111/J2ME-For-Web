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

export class LoadInstructions {
  // ============================================
  // ILOAD (Int Load)
  // ============================================

  @Instruction(Opcode.ILOAD)
  static iload(frame: Frame, thread: Thread): void {
    const index = frame.method.getCode()!.code[frame.pc + 1];
    frame.stack.push(frame.getInt(index));
    frame.pc += 2;
  }

  @Instruction(Opcode.ILOAD_0)
  static iload_0(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getInt(0));
    frame.pc++;
  }

  @Instruction(Opcode.ILOAD_1)
  static iload_1(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getInt(1));
    frame.pc++;
  }

  @Instruction(Opcode.ILOAD_2)
  static iload_2(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getInt(2));
    frame.pc++;
  }

  @Instruction(Opcode.ILOAD_3)
  static iload_3(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getInt(3));
    frame.pc++;
  }

  // ============================================
  // LLOAD (Long Load)
  // ============================================

  @Instruction(Opcode.LLOAD)
  static lload(frame: Frame, thread: Thread): void {
    const index = frame.method.getCode()!.code[frame.pc + 1];
    frame.stack.push(frame.getLong(index));
    frame.pc += 2;
  }

  @Instruction(Opcode.LLOAD_0)
  static lload_0(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLong(0));
    frame.pc++;
  }

  @Instruction(Opcode.LLOAD_1)
  static lload_1(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLong(1));
    frame.pc++;
  }

  @Instruction(Opcode.LLOAD_2)
  static lload_2(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLong(2));
    frame.pc++;
  }

  @Instruction(Opcode.LLOAD_3)
  static lload_3(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLong(3));
    frame.pc++;
  }

  // ============================================
  // ALOAD (Reference Load)
  // ============================================

  @Instruction(Opcode.ALOAD)
  static aload(frame: Frame, thread: Thread): void {
    const index = frame.method.getCode()!.code[frame.pc + 1];
    frame.stack.push(frame.getLocal(index));
    frame.pc += 2;
  }

  @Instruction(Opcode.ALOAD_0)
  static aload_0(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLocal(0));
    frame.pc++;
  }

  @Instruction(Opcode.ALOAD_1)
  static aload_1(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLocal(1));
    frame.pc++;
  }

  @Instruction(Opcode.ALOAD_2)
  static aload_2(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLocal(2));
    frame.pc++;
  }

  @Instruction(Opcode.ALOAD_3)
  static aload_3(frame: Frame, thread: Thread): void {
    frame.stack.push(frame.getLocal(3));
    frame.pc++;
  }
}
