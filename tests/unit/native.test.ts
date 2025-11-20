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
 * J2ME-For-Web Native Interface Test
 * 本地方法接口测试
 */

import { NativeRegistry } from "../../src/vm-core/native/native-registry";
import { Thread } from "../../src/vm-core/threading/thread";
import { Frame } from "../../src/vm-core/interpreter/frame";
import { InvokeInstructions } from "../../src/vm-core/interpreter/instructions/invoke";
import { MethodInfo } from "../../src/vm-core/classfile/method-info";

/**
 * 测试 Native 方法调用
 */
function testNativeCall(): void {
  console.log("=== Native 方法调用测试 ===\n");

  // 1. 注册一个 Native 方法: java/lang/System.currentTimeMillis()J
  const className = "java/lang/System";
  const methodName = "currentTimeMillis";
  const descriptor = "()J";

  console.log(`1. 注册 Native 方法: ${className}.${methodName}${descriptor}`);
  
  NativeRegistry.register(className, methodName, descriptor, (frame, thread) => {
    const now = BigInt(Date.now());
    console.log(`   [Native] System.currentTimeMillis() called, returning ${now}n`);
    // 将返回值推入调用者栈顶 (这里为了简化,直接推入当前栈帧的操作数栈)
    // 注意: 真实的 invoke 指令处理逻辑中,Native 方法没有自己的栈帧,
    // 而是直接操作调用者的栈帧。
    frame.stack.push(now);
  });

  // 2. 模拟调用
  console.log("2. 模拟调用");
  
  const thread = new Thread();
  
  // 创建一个模拟的 MethodInfo
  const mockMethod = {
    name: methodName,
    descriptor: descriptor,
    isNative: () => true,
    isStatic: () => true,
    getParameterCount: () => 0,
    classInfo: { thisClass: className }
  } as unknown as MethodInfo;

  // 创建一个栈帧作为"调用者"
  const callerFrame = new Frame({
    getSignature: () => "caller()V",
    getCode: () => ({ maxStack: 5, maxLocals: 5, code: new Uint8Array(0) }),
    getParameterCount: () => 0
  } as unknown as MethodInfo);
  
  thread.pushFrame(callerFrame);

  // 使用 InvokeInstructions 的私有方法 invokeMethod (需要通过 any 访问或公开它)
  // 这里我们为了测试方便,直接调用 NativeRegistry 获取 handler 并执行
  // 模拟 InvokeInstructions 的逻辑
  
  const handler = NativeRegistry.get(className, methodName, descriptor);
  if (!handler) {
    throw new Error("Native handler not found");
  }
  
  handler(callerFrame, thread);

  // 3. 验证返回值
  const result = callerFrame.stack.popLong();
  console.log(`3. 返回值: ${result}n`);
  
  if (typeof result !== "bigint") {
    throw new Error("Return value is not bigint");
  }
  
  // 简单的合理性检查
  const now = BigInt(Date.now());
  if (now - result > 1000n) { // 允许 1 秒误差
    throw new Error("Return value seems incorrect");
  }

  console.log("✅ 测试通过\n");
}

/**
 * 主测试函数
 */
export function testNative(): void {
  try {
    testNativeCall();
    console.log("✅ 所有 Native 接口测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testNative();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }
}
