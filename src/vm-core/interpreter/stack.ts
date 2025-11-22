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
 * J2ME-For-Web Operand Stack
 * 操作数栈
 */

import { JavaValue } from "../core/types";

/**
 * 操作数栈
 * 用于存储计算过程中的临时数据
 * 
 * 设计决策:
 * 在 JS 引擎中,Long/Double 占用 1 个槽位 (不同于标准 JVM 的 2 个)
 * 这样可以简化 push/pop 操作并提高性能
 * 但在实现 DUP2 等指令时需要根据类型判断
 */
export class OperandStack {
  private stack: JavaValue[];
  private sp: number; // 栈指针 (指向下一个空闲位置)

  constructor(maxStack: number) {
    this.stack = new Array(maxStack);
    this.sp = 0;
  }

  /**
   * 压入一个值
   */
  push(value: JavaValue): void {
    if (this.sp >= this.stack.length) {
      throw new Error("StackOverflowError");
    }
    this.stack[this.sp++] = value;
  }

  /**
   * 弹出栈顶值
   */
  pop(): JavaValue {
    if (this.sp <= 0) {
      throw new Error("StackUnderflowError");
    }
    const value = this.stack[--this.sp];
    this.stack[this.sp] = null; // 帮助 GC
    return value;
  }

  /**
   * 弹出 Int
   */
  popInt(): number {
    return this.pop() as number;
  }

  /**
   * 弹出 Float
   */
  popFloat(): number {
    return this.pop() as number;
  }

  /**
   * 弹出 Long
   */
  popLong(): bigint {
    return this.pop() as bigint;
  }

  /**
   * 弹出 Double
   */
  popDouble(): number {
    return this.pop() as number;
  }

  /**
   * 弹出引用
   */
  popRef(): JavaValue {
    return this.pop();
  }

  /**
   * 压入 Long
   */
  pushLong(value: bigint): void {
    this.push(value);
  }

  /**
   * 压入 Double
   */
  pushDouble(value: number): void {
    this.push(value);
  }

  /**
   * 查看栈顶值
   * @param offset 距离栈顶的偏移量（可选，默认为 0）
   */
  peek(offset: number = 0): JavaValue {
    if (this.sp - offset - 1 < 0) {
      throw new Error("StackUnderflowError");
    }
    return this.stack[this.sp - offset - 1];
  }

  /**
   * 获取栈深度
   */
  size(): number {
    return this.sp;
  }

  /**
   * 清空栈
   */
  clear(): void {
    this.sp = 0;
    // 可选: 清除引用以帮助 GC
    for (let i = 0; i < this.stack.length; i++) {
      this.stack[i] = null;
    }
  }

  /**
   * 转换为字符串 (调试用)
   */
  toString(): string {
    return `Stack[${this.sp}]: ${this.stack.slice(0, this.sp).map(v => 
      typeof v === 'bigint' ? `${v}n` : String(v)
    ).join(", ")}`;
  }
}
