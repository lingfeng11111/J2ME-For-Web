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
 * J2ME-For-Web Stack & Frame Test
 * 栈帧和操作数栈测试
 */

import { OperandStack } from "../../src/vm-core/interpreter/stack";
import { Frame } from "../../src/vm-core/interpreter/frame";
import { MethodInfo } from "../../src/vm-core/classfile/method-info";

/**
 * 测试操作数栈
 */
function testOperandStack(): void {
  console.log("=== 操作数栈测试 ===\n");

  const stack = new OperandStack(10);

  // 1. 基本 Push/Pop
  console.log("1. 基本 Push/Pop");
  stack.push(42);
  stack.push(3.14);
  stack.push(1234567890123456789n);

  console.log(`   栈状态: ${stack.toString()}`);
  console.log(`   栈深度: ${stack.size()}`);

  const longVal = stack.popLong();
  const floatVal = stack.popFloat();
  const intVal = stack.popInt();

  console.log(`   Pop Long: ${longVal}n`);
  console.log(`   Pop Float: ${floatVal}`);
  console.log(`   Pop Int: ${intVal}`);

  if (longVal !== 1234567890123456789n || floatVal !== 3.14 || intVal !== 42) {
    throw new Error("Stack push/pop failed");
  }
  console.log("   ✅ 验证通过\n");

  // 2. 栈溢出/下溢测试
  console.log("2. 边界测试");
  try {
    stack.pop();
    throw new Error("Should throw StackUnderflowError");
  } catch (e: any) {
    console.log(`   ✅ 捕获下溢: ${e.message}`);
  }

  const smallStack = new OperandStack(2);
  smallStack.push(1);
  smallStack.push(2);
  try {
    smallStack.push(3);
    throw new Error("Should throw StackOverflowError");
  } catch (e: any) {
    console.log(`   ✅ 捕获溢出: ${e.message}\n`);
  }
}

/**
 * 测试栈帧
 */
function testFrame(): void {
  console.log("=== 栈帧测试 ===\n");

  // 模拟一个 MethodInfo
  const mockMethod = {
    getSignature: () => "test()V",
    getCode: () => ({
      maxStack: 5,
      maxLocals: 5,
      code: new Uint8Array(0)
    }),
    getParameterCount: () => 0
  } as unknown as MethodInfo;

  const frame = new Frame(mockMethod);

  // 1. 局部变量表测试
  console.log("1. 局部变量表");
  frame.setLocal(0, 100);
  frame.setLocal(1, 200n);
  frame.setLocal(2, null);

  console.log(`   Local[0] (int): ${frame.getInt(0)}`);
  console.log(`   Local[1] (long): ${frame.getLong(1)}n`);
  console.log(`   Local[2] (ref): ${frame.getLocal(2)}`);

  if (frame.getInt(0) !== 100 || frame.getLong(1) !== 200n) {
    throw new Error("Locals set/get failed");
  }
  console.log("   ✅ 验证通过\n");

  // 2. 栈帧操作数栈测试
  console.log("2. 栈帧操作数栈");
  frame.stack.push(999);
  console.log(`   Stack Peek: ${frame.stack.peek()}`);
  
  if (frame.stack.pop() !== 999) {
    throw new Error("Frame stack failed");
  }
  console.log("   ✅ 验证通过\n");
}

/**
 * 主测试函数
 */
export function testStackFrame(): void {
  try {
    testOperandStack();
    testFrame();
    console.log("✅ 所有栈帧测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testStackFrame();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }
}
