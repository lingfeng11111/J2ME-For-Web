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
 * 异常处理器
 * 对应 Code 属性中的异常表条目
 */
export interface ExceptionHandler {
  /** 起始 PC */
  startPc: number;
  /** 结束 PC */
  endPc: number;
  /** 处理器 PC */
  handlerPc: number;
  /** 捕获的异常类型（0 表示 finally，捕获所有异常）*/
  catchType: number | string;
}

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

      // 执行指令
      try {
        handler(frame, thread);
      } catch (e) {
        // 异常处理
        const handled = Interpreter.handleException(thread, e);
        if (!handled) {
          // 未捕获的异常，传播到外层
          console.error(`Uncaught exception in ${frame.method.getSignature()} at pc=${pc}`);
          throw e;
        }
        // 异常已处理，继续执行
      }

      // 检查是否需要暂停 (例如时间片耗尽)
      // 每执行一条指令就 yield 一次,让调度器有机会调度其他线程
      yield ExecutionStatus.RUNNING;
    }
    
    // 执行结束
    yield ExecutionStatus.TERMINATED;
  }

  /**
   * 处理异常
   * @param thread 当前线程
   * @param error 异常对象
   * @returns 是否成功处理异常
   */
  private static handleException(thread: Thread, error: any): boolean {
    // 导入 JavaException 类型
    const JavaException = require('./instructions/exception-instructions').JavaException;
    
    // 只处理 Java 异常
    if (!(error instanceof JavaException)) {
      return false;
    }

    const throwable = error.throwable;
    
    // 从当前栈帧开始查找异常处理器
    while (thread.hasFrames()) {
      const frame = thread.currentFrame();
      const code = frame.method.getCode();
      
      if (!code || !code.exceptionTable) {
        // 没有异常表，弹出栈帧继续查找
        thread.popFrame();
        continue;
      }

      // 在异常表中查找匹配的处理器
      const handler = Interpreter.findExceptionHandler(
        code.exceptionTable,
        frame.pc,
        throwable.classInfo.thisClass
      );

      if (handler) {
        // 找到处理器
        // 清空操作数栈
        while (frame.stack.size() > 0) {
          frame.stack.pop();
        }
        
        // 将异常对象压入栈
        frame.stack.push(throwable);
        
        // 跳转到处理器
        frame.pc = handler.handlerPc;
        
        return true;
      }

      // 当前栈帧没有处理器，弹出并继续查找
      thread.popFrame();
    }

    // 没有找到处理器
    return false;
  }

  /**
   * 在异常表中查找匹配的处理器
   * @param exceptionTable 异常表
   * @param pc 当前 PC
   * @param exceptionClass 异常类名
   * @returns 匹配的处理器，如果没有则返回 null
   */
  private static findExceptionHandler(
    exceptionTable: ExceptionHandler[],
    pc: number,
    exceptionClass: string
  ): ExceptionHandler | null {
    for (const handler of exceptionTable) {
      // 检查 PC 是否在处理器范围内
      if (pc >= handler.startPc && pc < handler.endPc) {
        // catchType 为 0 表示 finally 块，捕获所有异常
        if (handler.catchType === 0) {
          return handler;
        }

        // 检查异常类型是否匹配
        // TODO: 实现完整的类型检查（包括继承）
        if (handler.catchType === exceptionClass) {
          return handler;
        }

        // 简化处理：如果 catchType 是 Throwable，捕获所有异常
        if (handler.catchType === 'java/lang/Throwable') {
          return handler;
        }
      }
    }

    return null;
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
