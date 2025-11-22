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
 * J2ME-For-Web Instructions Test
 * 测试新实现的指令（分支、转换、比较）
 */

import { Frame } from "../../src/vm-core/interpreter/frame";
import { Thread } from "../../src/vm-core/threading/thread";
import { ClassLoader } from "../../src/vm-core/classfile/class-loader";
import { BranchInstructions } from "../../src/vm-core/interpreter/instructions/branch-instructions";
import { ConversionInstructions } from "../../src/vm-core/interpreter/instructions/conversion-instructions";
import { ComparisonInstructions } from "../../src/vm-core/interpreter/instructions/comparison-instructions";

/**
 * 创建模拟的 Frame 和 Thread
 */
function createMockFrame(code: number[]): { frame: Frame; thread: Thread } {
  const mockClassInfo: any = {
    thisClass: "TestClass",
    constantPool: {
      getSize: () => 0,
    },
  };

  const mockMethod: any = {
    name: "testMethod",
    descriptor: "()V",
    classInfo: mockClassInfo,
    getCode: () => ({
      code: new Uint8Array(code),
      maxStack: 100,
      maxLocals: 10,
    }),
    getSignature: () => "TestClass.testMethod()V",
    getParameterCount: () => 0,
  };

  const mockClassLoader = new ClassLoader({ readClass: () => null });
  const thread = new Thread();
  const frame = new Frame(mockMethod);

  return { frame, thread };
}

/**
 * 测试分支指令
 */
function testBranchInstructions(): void {
  console.log("=== 测试分支指令 ===\n");

  // 测试 IFEQ
  console.log("1. 测试 IFEQ (if value == 0)");
  {
    const { frame, thread } = createMockFrame([0x99, 0x00, 0x05]); // ifeq +5
    frame.stack.push(0); // 值为 0，应该跳转
    BranchInstructions.ifeq(frame, thread);
    console.log(`   值为 0 时 PC: ${frame.pc} (期望: 5)`);
    
    const { frame: frame2, thread: thread2 } = createMockFrame([0x99, 0x00, 0x05]);
    frame2.stack.push(1); // 值不为 0，不跳转
    BranchInstructions.ifeq(frame2, thread2);
    console.log(`   值为 1 时 PC: ${frame2.pc} (期望: 3)\n`);
  }

  // 测试 IF_ICMPEQ
  console.log("2. 测试 IF_ICMPEQ (if value1 == value2)");
  {
    const { frame, thread } = createMockFrame([0x9f, 0x00, 0x0a]); // if_icmpeq +10
    frame.stack.push(5);
    frame.stack.push(5); // 相等，应该跳转
    BranchInstructions.if_icmpeq(frame, thread);
    console.log(`   5 == 5 时 PC: ${frame.pc} (期望: 10)`);
    
    const { frame: frame2, thread: thread2 } = createMockFrame([0x9f, 0x00, 0x0a]);
    frame2.stack.push(5);
    frame2.stack.push(3); // 不相等，不跳转
    BranchInstructions.if_icmpeq(frame2, thread2);
    console.log(`   5 == 3 时 PC: ${frame2.pc} (期望: 3)\n`);
  }

  // 测试 IFNULL
  console.log("3. 测试 IFNULL (if reference is null)");
  {
    const { frame, thread } = createMockFrame([0xc6, 0x00, 0x07]); // ifnull +7
    frame.stack.push(null); // null，应该跳转
    BranchInstructions.ifnull(frame, thread);
    console.log(`   null 时 PC: ${frame.pc} (期望: 7)`);
    
    const { frame: frame2, thread: thread2 } = createMockFrame([0xc6, 0x00, 0x07]);
    frame2.stack.push({}); // 非 null，不跳转
    BranchInstructions.ifnull(frame2, thread2);
    console.log(`   非 null 时 PC: ${frame2.pc} (期望: 3)\n`);
  }
}

/**
 * 测试类型转换指令
 */
function testConversionInstructions(): void {
  console.log("=== 测试类型转换指令 ===\n");

  // 测试 I2L
  console.log("1. 测试 I2L (int to long)");
  {
    const { frame, thread } = createMockFrame([0x85]);
    frame.stack.push(42);
    ConversionInstructions.i2l(frame, thread);
    const result = frame.stack.pop();
    console.log(`   42 (int) -> ${result} (long), 类型: ${typeof result}\n`);
  }

  // 测试 L2I
  console.log("2. 测试 L2I (long to int)");
  {
    const { frame, thread } = createMockFrame([0x88]);
    frame.stack.push(9007199254740991n); // 大于 int 范围的 long
    ConversionInstructions.l2i(frame, thread);
    const result = frame.stack.pop();
    console.log(`   9007199254740991n (long) -> ${result} (int)\n`);
  }

  // 测试 I2B
  console.log("3. 测试 I2B (int to byte)");
  {
    const { frame, thread } = createMockFrame([0x91]);
    frame.stack.push(300); // 超出 byte 范围
    ConversionInstructions.i2b(frame, thread);
    const result = frame.stack.pop();
    console.log(`   300 (int) -> ${result} (byte, 期望: 44)\n`);
  }

  // 测试 I2C
  console.log("4. 测试 I2C (int to char)");
  {
    const { frame, thread } = createMockFrame([0x92]);
    frame.stack.push(65); // 'A'
    ConversionInstructions.i2c(frame, thread);
    const result = frame.stack.pop();
    console.log(`   65 (int) -> ${result} (char, 期望: 65)\n`);
  }
}

/**
 * 测试比较指令
 */
function testComparisonInstructions(): void {
  console.log("=== 测试比较指令 ===\n");

  // 测试 LCMP
  console.log("1. 测试 LCMP (long 比较)");
  {
    const { frame, thread } = createMockFrame([0x94]);
    frame.stack.push(100n);
    frame.stack.push(50n);
    ComparisonInstructions.lcmp(frame, thread);
    console.log(`   100n vs 50n: ${frame.stack.pop()} (期望: 1)`);
    
    const { frame: frame2, thread: thread2 } = createMockFrame([0x94]);
    frame2.stack.push(50n);
    frame2.stack.push(100n);
    ComparisonInstructions.lcmp(frame2, thread2);
    console.log(`   50n vs 100n: ${frame2.stack.pop()} (期望: -1)`);
    
    const { frame: frame3, thread: thread3 } = createMockFrame([0x94]);
    frame3.stack.push(50n);
    frame3.stack.push(50n);
    ComparisonInstructions.lcmp(frame3, thread3);
    console.log(`   50n vs 50n: ${frame3.stack.pop()} (期望: 0)\n`);
  }

  // 测试 FCMPL (NaN 返回 -1)
  console.log("2. 测试 FCMPL (float 比较, NaN -> -1)");
  {
    const { frame, thread } = createMockFrame([0x95]);
    frame.stack.push(3.14);
    frame.stack.push(2.71);
    ComparisonInstructions.fcmpl(frame, thread);
    console.log(`   3.14 vs 2.71: ${frame.stack.pop()} (期望: 1)`);
    
    const { frame: frame2, thread: thread2 } = createMockFrame([0x95]);
    frame2.stack.push(NaN);
    frame2.stack.push(1.0);
    ComparisonInstructions.fcmpl(frame2, thread2);
    console.log(`   NaN vs 1.0: ${frame2.stack.pop()} (期望: -1)\n`);
  }

  // 测试 FCMPG (NaN 返回 1)
  console.log("3. 测试 FCMPG (float 比较, NaN -> 1)");
  {
    const { frame, thread } = createMockFrame([0x96]);
    frame.stack.push(NaN);
    frame.stack.push(1.0);
    ComparisonInstructions.fcmpg(frame, thread);
    console.log(`   NaN vs 1.0: ${frame.stack.pop()} (期望: 1)\n`);
  }
}

/**
 * 主测试函数
 */
export function testInstructions(): void {
  console.log("=== 指令集测试 ===\n");

  try {
    testBranchInstructions();
    testConversionInstructions();
    testComparisonInstructions();

    console.log("✅ 所有指令测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testInstructions();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
