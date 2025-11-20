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
 * J2ME-For-Web Interpreter Test
 * 解释器集成测试
 */

import { Thread } from "../../src/vm-core/threading/thread";
import { Frame } from "../../src/vm-core/interpreter/frame";
import { Interpreter } from "../../src/vm-core/interpreter/interpreter";
import { MethodInfo } from "../../src/vm-core/classfile/method-info";
import { Opcode } from "../../src/vm-core/bytecode/opcodes";
import { initInstructions } from "../../src/vm-core/interpreter/instructions";

// 初始化指令集
initInstructions();

/**
 * 创建一个模拟方法
 */
function createMockMethod(code: number[]): MethodInfo {
  return {
    getSignature: () => "test()I",
    getCode: () => ({
      maxStack: 10,
      maxLocals: 10,
      code: new Uint8Array(code),
      exceptionTable: [],
      attributes: []
    }),
    getParameterCount: () => 0
  } as unknown as MethodInfo;
}

/**
 * 测试简单的算术运算
 * 1 + 2 = 3
 */
function testSimpleMath(): void {
  console.log("=== 简单算术测试 (1 + 2) ===\n");

  // 字节码:
  // iconst_1
  // iconst_2
  // iadd
  // ireturn
  const code = [
    Opcode.ICONST_1,
    Opcode.ICONST_2,
    Opcode.IADD,
    Opcode.IRETURN
  ];

  const method = createMockMethod(code);
  const thread = new Thread();
  
  // 创建一个"调用者"栈帧来接收返回值
  const callerMethod = createMockMethod([]);
  const callerFrame = new Frame(callerMethod);
  thread.pushFrame(callerFrame);

  // 创建被调用方法栈帧
  const frame = new Frame(method, callerFrame);
  thread.pushFrame(frame);

  console.log("1. 开始执行...");
  
  // 执行解释器
  const iterator = Interpreter.execute(thread);
  let result = iterator.next();
  while (!result.done) {
    result = iterator.next();
  }

  console.log("2. 执行完成");

  // 检查返回值 (应该在调用者栈顶)
  const returnValue = callerFrame.stack.popInt();
  console.log(`3. 返回值: ${returnValue}`);

  if (returnValue !== 3) {
    throw new Error(`Expected 3, got ${returnValue}`);
  }
  console.log("✅ 测试通过\n");
}

/**
 * 主测试函数
 */
export function testInterpreter(): void {
  try {
    testSimpleMath();
    console.log("✅ 所有解释器测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testInterpreter();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }
}
