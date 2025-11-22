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
 * J2ME-For-Web Stack Manipulation Instructions
 * 栈操作指令
 * POP, POP2, DUP, DUP_X1, DUP_X2, DUP2, DUP2_X1, DUP2_X2, SWAP
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";

export class StackInstructions {
  /**
   * 弹出栈顶值
   */
  @Instruction(Opcode.POP)
  static pop(frame: Frame, thread: Thread): void {
    frame.stack.pop();
    frame.pc++;
  }

  /**
   * 弹出栈顶两个值（或一个 long/double）
   */
  @Instruction(Opcode.POP2)
  static pop2(frame: Frame, thread: Thread): void {
    frame.stack.pop();
    frame.stack.pop();
    frame.pc++;
  }

  /**
   * 复制栈顶值
   * ... value -> ... value, value
   */
  @Instruction(Opcode.DUP)
  static dup(frame: Frame, thread: Thread): void {
    const value = frame.stack.peek();
    frame.stack.push(value);
    frame.pc++;
  }

  /**
   * 复制栈顶值并插入到第二个值下面
   * ... value2, value1 -> ... value1, value2, value1
   */
  @Instruction(Opcode.DUP_X1)
  static dup_x1(frame: Frame, thread: Thread): void {
    const value1 = frame.stack.pop();
    const value2 = frame.stack.pop();
    frame.stack.push(value1);
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.pc++;
  }

  /**
   * 复制栈顶值并插入到第三个值下面
   * ... value3, value2, value1 -> ... value1, value3, value2, value1
   */
  @Instruction(Opcode.DUP_X2)
  static dup_x2(frame: Frame, thread: Thread): void {
    const value1 = frame.stack.pop();
    const value2 = frame.stack.pop();
    const value3 = frame.stack.pop();
    frame.stack.push(value1);
    frame.stack.push(value3);
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.pc++;
  }

  /**
   * 复制栈顶两个值
   * ... value2, value1 -> ... value2, value1, value2, value1
   */
  @Instruction(Opcode.DUP2)
  static dup2(frame: Frame, thread: Thread): void {
    const value1 = frame.stack.pop();
    const value2 = frame.stack.pop();
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.pc++;
  }

  /**
   * 复制栈顶两个值并插入到第三个值下面
   * ... value3, value2, value1 -> ... value2, value1, value3, value2, value1
   */
  @Instruction(Opcode.DUP2_X1)
  static dup2_x1(frame: Frame, thread: Thread): void {
    const value1 = frame.stack.pop();
    const value2 = frame.stack.pop();
    const value3 = frame.stack.pop();
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.stack.push(value3);
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.pc++;
  }

  /**
   * 复制栈顶两个值并插入到第四个值下面
   * ... value4, value3, value2, value1 -> ... value2, value1, value4, value3, value2, value1
   */
  @Instruction(Opcode.DUP2_X2)
  static dup2_x2(frame: Frame, thread: Thread): void {
    const value1 = frame.stack.pop();
    const value2 = frame.stack.pop();
    const value3 = frame.stack.pop();
    const value4 = frame.stack.pop();
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.stack.push(value4);
    frame.stack.push(value3);
    frame.stack.push(value2);
    frame.stack.push(value1);
    frame.pc++;
  }

  /**
   * 交换栈顶两个值
   * ... value2, value1 -> ... value1, value2
   */
  @Instruction(Opcode.SWAP)
  static swap(frame: Frame, thread: Thread): void {
    const value1 = frame.stack.pop();
    const value2 = frame.stack.pop();
    frame.stack.push(value1);
    frame.stack.push(value2);
    frame.pc++;
  }
}
