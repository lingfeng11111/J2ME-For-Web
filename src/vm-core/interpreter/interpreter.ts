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
 * J2ME-For-Web Interpreter
 * 字节码解释器
 */

import { Thread, ThreadStatus } from "../threading/thread";
import { InstructionRegistry } from "./instruction";
import { Opcode } from "../bytecode/opcodes";
import { getOpcodeMnemonic } from "../bytecode/descriptors";
import { ExecutionStatus } from "../core/constants";

/**
 * 解释器
 * 负责执行线程中的字节码
 */
export class Interpreter {
  /**
   * 执行线程 (Generator)
   * 使用 Generator 可以暂停和恢复执行,避免阻塞主线程
   * 返回 ExecutionStatus 让调度器知道当前执行状态
   */
  static *execute(thread: Thread): Generator<ExecutionStatus, void, void> {
    while (thread.status === ThreadStatus.RUNNABLE && thread.hasFrames()) {
      const frame = thread.currentFrame();
      const pc = frame.pc;
      
      // 获取当前指令
      const code = frame.method.getCode();
      if (!code) {
        throw new Error(`Method has no code: ${frame.method.getSignature()}`);
      }
      
      if (pc >= code.code.length) {
        // 方法结束 (理论上应该由 RETURN 指令处理)
        thread.popFrame();
        continue;
      }

      const opcode = code.code[pc];
      
      // 查找指令处理函数
      const handler = InstructionRegistry.get(opcode);
      if (!handler) {
        throw new Error(
          `Unknown opcode: 0x${opcode.toString(16)} (${getOpcodeMnemonic(opcode)}) at pc=${pc}`
        );
      }

      // 预设下一条指令的 PC (假设是单字节指令,多字节指令会在 handler 中修正)
      // 注意: 实际的 PC 更新通常由指令 handler 自己处理,或者由统一逻辑处理
      // 这里我们让 handler 负责读取操作数并更新 frame.pc 到下一条指令
      // 但为了方便,我们可以在这里记录当前 PC,供调试使用
      
      // 执行指令
      try {
        handler(frame, thread);
      } catch (e) {
        console.error(`Error executing opcode ${getOpcodeMnemonic(opcode)} at pc=${pc}`);
        throw e;
      }

      // 检查是否需要暂停 (例如时间片耗尽)
      // 每执行一条指令就 yield 一次,让调度器有机会调度其他线程
      yield ExecutionStatus.RUNNING;
    }
    
    // 执行结束
    yield ExecutionStatus.TERMINATED;
  }

  /**
   * 单步执行 (用于调试)
   */
  static step(thread: Thread): void {
    if (thread.status === ThreadStatus.RUNNABLE && thread.hasFrames()) {
      const frame = thread.currentFrame();
      const pc = frame.pc;
      const code = frame.method.getCode()!;
      const opcode = code.code[pc];
      const handler = InstructionRegistry.get(opcode);
      
      if (handler) {
        handler(frame, thread);
      } else {
        throw new Error(`Unknown opcode: ${opcode}`);
      }
    }
  }
}
