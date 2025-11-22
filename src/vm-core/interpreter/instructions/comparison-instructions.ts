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
 * J2ME-For-Web Comparison Instructions
 * 比较指令
 * LCMP, FCMPL, FCMPG, DCMPL, DCMPG
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";

export class ComparisonInstructions {
  /**
   * 比较两个 long 值
   * value1 > value2 -> 1
   * value1 == value2 -> 0
   * value1 < value2 -> -1
   */
  @Instruction(Opcode.LCMP)
  static lcmp(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.popLong();
    const value1 = frame.stack.popLong();
    
    if (value1 > value2) {
      frame.stack.push(1);
    } else if (value1 < value2) {
      frame.stack.push(-1);
    } else {
      frame.stack.push(0);
    }
    
    frame.pc++;
  }

  /**
   * 比较两个 float 值（NaN 时返回 -1）
   * value1 > value2 -> 1
   * value1 == value2 -> 0
   * value1 < value2 -> -1
   * value1 或 value2 是 NaN -> -1
   */
  @Instruction(Opcode.FCMPL)
  static fcmpl(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.pop() as number;
    const value1 = frame.stack.pop() as number;
    
    if (isNaN(value1) || isNaN(value2)) {
      frame.stack.push(-1);
    } else if (value1 > value2) {
      frame.stack.push(1);
    } else if (value1 < value2) {
      frame.stack.push(-1);
    } else {
      frame.stack.push(0);
    }
    
    frame.pc++;
  }

  /**
   * 比较两个 float 值（NaN 时返回 1）
   * value1 > value2 -> 1
   * value1 == value2 -> 0
   * value1 < value2 -> -1
   * value1 或 value2 是 NaN -> 1
   */
  @Instruction(Opcode.FCMPG)
  static fcmpg(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.pop() as number;
    const value1 = frame.stack.pop() as number;
    
    if (isNaN(value1) || isNaN(value2)) {
      frame.stack.push(1);
    } else if (value1 > value2) {
      frame.stack.push(1);
    } else if (value1 < value2) {
      frame.stack.push(-1);
    } else {
      frame.stack.push(0);
    }
    
    frame.pc++;
  }

  /**
   * 比较两个 double 值（NaN 时返回 -1）
   * value1 > value2 -> 1
   * value1 == value2 -> 0
   * value1 < value2 -> -1
   * value1 或 value2 是 NaN -> -1
   */
  @Instruction(Opcode.DCMPL)
  static dcmpl(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.pop() as number;
    const value1 = frame.stack.pop() as number;
    
    if (isNaN(value1) || isNaN(value2)) {
      frame.stack.push(-1);
    } else if (value1 > value2) {
      frame.stack.push(1);
    } else if (value1 < value2) {
      frame.stack.push(-1);
    } else {
      frame.stack.push(0);
    }
    
    frame.pc++;
  }

  /**
   * 比较两个 double 值（NaN 时返回 1）
   * value1 > value2 -> 1
   * value1 == value2 -> 0
   * value1 < value2 -> -1
   * value1 或 value2 是 NaN -> 1
   */
  @Instruction(Opcode.DCMPG)
  static dcmpg(frame: Frame, thread: Thread): void {
    const value2 = frame.stack.pop() as number;
    const value1 = frame.stack.pop() as number;
    
    if (isNaN(value1) || isNaN(value2)) {
      frame.stack.push(1);
    } else if (value1 > value2) {
      frame.stack.push(1);
    } else if (value1 < value2) {
      frame.stack.push(-1);
    } else {
      frame.stack.push(0);
    }
    
    frame.pc++;
  }
}
