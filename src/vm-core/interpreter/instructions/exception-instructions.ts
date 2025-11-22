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
 * J2ME-For-Web Exception Instructions
 * 异常处理指令
 * ATHROW
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";
import { JavaThrowable } from "../../runtime/throwable";

/**
 * Java 异常
 * 用于在 VM 中传播异常
 */
export class JavaException extends Error {
  /** 异常对象 */
  readonly throwable: JavaThrowable;

  constructor(throwable: JavaThrowable) {
    super(throwable.getMessage() || throwable.toString());
    this.name = "JavaException";
    this.throwable = throwable;
  }
}

export class ExceptionInstructions {
  /**
   * 抛出异常
   * athrow 指令
   */
  @Instruction(Opcode.ATHROW)
  static athrow(frame: Frame, thread: Thread): void {
    // 从栈中弹出异常对象
    const objectref = frame.stack.pop();
    
    if (objectref === null) {
      // 抛出 NullPointerException
      throw new Error("NullPointerException: Cannot throw null");
    }
    
    if (!(objectref instanceof JavaThrowable)) {
      throw new Error("Invalid throwable object");
    }
    
    // 添加当前位置到堆栈跟踪
    objectref.addStackTraceElement({
      className: frame.method.classInfo.thisClass,
      methodName: frame.method.name,
      fileName: frame.method.classInfo.thisClass + ".java",
      lineNumber: frame.pc,
    });
    
    // 抛出 Java 异常
    throw new JavaException(objectref);
  }
}
