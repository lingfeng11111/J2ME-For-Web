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

export class ControlInstructions {
  @Instruction(Opcode.RETURN)
  static return_void(frame: Frame, thread: Thread): void {
    thread.popFrame();
    // 不需要更新 PC,因为栈帧已经弹出了
  }

  @Instruction(Opcode.IRETURN)
  static ireturn(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    thread.popFrame();
    
    if (thread.hasFrames()) {
      const invoker = thread.currentFrame();
      invoker.stack.push(value);
    }
  }

  @Instruction(Opcode.LRETURN)
  static lreturn(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    thread.popFrame();
    
    if (thread.hasFrames()) {
      const invoker = thread.currentFrame();
      invoker.stack.push(value);
    }
  }

  @Instruction(Opcode.FRETURN)
  static freturn(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    thread.popFrame();
    
    if (thread.hasFrames()) {
      const invoker = thread.currentFrame();
      invoker.stack.push(value);
    }
  }

  @Instruction(Opcode.DRETURN)
  static dreturn(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    thread.popFrame();
    
    if (thread.hasFrames()) {
      const invoker = thread.currentFrame();
      invoker.stack.push(value);
    }
  }

  @Instruction(Opcode.ARETURN)
  static areturn(frame: Frame, thread: Thread): void {
    const value = frame.stack.pop();
    thread.popFrame();
    
    if (thread.hasFrames()) {
      const invoker = thread.currentFrame();
      invoker.stack.push(value);
    }
  }
}
