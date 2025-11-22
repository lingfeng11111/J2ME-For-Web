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
 * J2ME-For-Web Branch Instructions
 * 分支和跳转指令
 * IFEQ, IFNE, IFLT, IFGE, IFGT, IFLE, IF_ICMPEQ, IF_ICMPNE, etc.
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";

export class BranchInstructions {
  /**
   * 无条件跳转
   */
  @Instruction(Opcode.GOTO)
  static goto(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const branchbyte1 = code.code[frame.pc + 1];
    const branchbyte2 = code.code[frame.pc + 2];
    const offset = (branchbyte1 << 8) | branchbyte2;
    // 将无符号转换为有符号
    const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
    frame.pc += signedOffset;
  }

  /**
   * if value == 0, branch
   */
  @Instruction(Opcode.IFEQ)
  static ifeq(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    if (value === 0) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value != 0, branch
   */
  @Instruction(Opcode.IFNE)
  static ifne(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    if (value !== 0) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value < 0, branch
   */
  @Instruction(Opcode.IFLT)
  static iflt(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    if (value < 0) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value >= 0, branch
   */
  @Instruction(Opcode.IFGE)
  static ifge(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    if (value >= 0) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value > 0, branch
   */
  @Instruction(Opcode.IFGT)
  static ifgt(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    if (value > 0) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value <= 0, branch
   */
  @Instruction(Opcode.IFLE)
  static ifle(frame: Frame, thread: Thread): void {
    const value = frame.stack.popInt();
    if (value <= 0) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value1 == value2, branch
   */
  @Instruction(Opcode.IF_ICMPEQ)
  static if_icmpeq(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popInt();
    const value1 = frame.stack.popInt();
    if (value1 === value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value1 != value2, branch
   */
  @Instruction(Opcode.IF_ICMPNE)
  static if_icmpne(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popInt();
    const value1 = frame.stack.popInt();
    if (value1 !== value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value1 < value2, branch
   */
  @Instruction(Opcode.IF_ICMPLT)
  static if_icmplt(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popInt();
    const value1 = frame.stack.popInt();
    if (value1 < value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value1 >= value2, branch
   */
  @Instruction(Opcode.IF_ICMPGE)
  static if_icmpge(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popInt();
    const value1 = frame.stack.popInt();
    if (value1 >= value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value1 > value2, branch
   */
  @Instruction(Opcode.IF_ICMPGT)
  static if_icmpgt(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popInt();
    const value1 = frame.stack.popInt();
    if (value1 > value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if value1 <= value2, branch
   */
  @Instruction(Opcode.IF_ICMPLE)
  static if_icmple(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popInt();
    const value1 = frame.stack.popInt();
    if (value1 <= value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if reference1 == reference2, branch
   */
  @Instruction(Opcode.IF_ACMPEQ)
  static if_acmpeq(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.pop();
    const value1 = frame.stack.pop();
    if (value1 === value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if reference1 != reference2, branch
   */
  @Instruction(Opcode.IF_ACMPNE)
  static if_acmpne(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.pop();
    const value1 = frame.stack.pop();
    if (value1 !== value2) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if reference is null, branch
   */
  @Instruction(Opcode.IFNULL)
  static ifnull(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    if (value === null) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }

  /**
   * if reference is not null, branch
   */
  @Instruction(Opcode.IFNONNULL)
  static ifnonnull(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    if (value !== null) {
      const code = frame.method.getCode()!;
      const branchbyte1 = code.code[frame.pc + 1];
      const branchbyte2 = code.code[frame.pc + 2];
      const offset = (branchbyte1 << 8) | branchbyte2;
      const signedOffset = offset > 0x7fff ? offset - 0x10000 : offset;
      frame.pc += signedOffset;
    } else {
      frame.pc += 3;
    }
  }
}
