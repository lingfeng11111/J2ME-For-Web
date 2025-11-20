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
 * J2ME-For-Web Stack Frame
 * 栈帧
 */

import { MethodInfo } from "../classfile/method-info";
import { JavaValue } from "../core/types";
import { OperandStack } from "./stack";
import { JavaObject } from "../runtime/object";

/**
 * 栈帧
 * 每次方法调用都会创建一个新的栈帧
 */
export class Frame {
  /** 当前执行的方法 */
  readonly method: MethodInfo;

  /** 局部变量表 */
  readonly locals: JavaValue[];

  /** 操作数栈 */
  readonly stack: OperandStack;

  /** 程序计数器 (PC) */
  pc: number = 0;

  /** 下一条指令的 PC (用于分支跳转计算) */
  nextPc: number = 0;

  /** 前一个栈帧 (调用者) */
  readonly prev: Frame | null;

  constructor(method: MethodInfo, prev: Frame | null = null) {
    this.method = method;
    this.prev = prev;

    const code = method.getCode();
    if (code) {
      // 有字节码的方法
      this.locals = new Array(code.maxLocals).fill(null);
      this.stack = new OperandStack(code.maxStack);
    } else {
      // Native 方法或抽象方法
      this.locals = new Array(method.getParameterCount() + 1).fill(null); // +1 for 'this'
      this.stack = new OperandStack(0);
    }
  }

  // ============================================
  // 局部变量访问
  // ============================================

  setLocal(index: number, value: JavaValue): void {
    // 注意: 在 JS 实现中,Long/Double 也只占 1 个槽位
    // 标准 JVM 中需要占 2 个,这里为了性能做简化
    // 如果需要严格符合规范,需要在这里处理索引映射
    this.locals[index] = value;
  }

  getLocal(index: number): JavaValue {
    return this.locals[index];
  }

  getInt(index: number): number {
    return this.locals[index] as number;
  }

  getLong(index: number): bigint {
    return this.locals[index] as bigint;
  }

  getFloat(index: number): number {
    return this.locals[index] as number;
  }

  getDouble(index: number): number {
    return this.locals[index] as number;
  }

  getObject(index: number): JavaObject | null {
    return this.locals[index] as JavaObject | null;
  }

  // ============================================
  // 调试信息
  // ============================================

  toString(): string {
    return `Frame[${this.method.getSignature()}] pc=${this.pc}`;
  }
}
