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
 * J2ME-For-Web Stdlib Test
 * 标准库测试
 */

import { initStdlib } from "../../src/game-modules/stdlib";
import { NativeRegistry } from "../../src/vm-core/native/native-registry";
import { Thread } from "../../src/vm-core/threading/thread";
import { Frame } from "../../src/vm-core/interpreter/frame";
import { JavaArray } from "../../src/vm-core/runtime/array";
import { MethodInfo } from "../../src/vm-core/classfile/method-info";

// 初始化标准库
initStdlib();

/**
 * 测试 System.arraycopy
 */
function testArrayCopy(): void {
  console.log("=== System.arraycopy 测试 ===\n");

  const thread = new Thread();
  const frame = new Frame({
    getCode: () => ({ maxStack: 10, maxLocals: 10, code: new Uint8Array(0) }),
    getParameterCount: () => 0
  } as unknown as MethodInfo);
  thread.pushFrame(frame);

  // 准备源数组 [1, 2, 3, 4, 5]
  const src = new JavaArray("I", 5);
  for (let i = 0; i < 5; i++) src.set(i, i + 1);

  // 准备目标数组 [0, 0, 0, 0, 0]
  const dest = new JavaArray("I", 5);

  // 模拟参数入栈: src, srcPos, dest, destPos, length
  // arraycopy(src, 1, dest, 2, 3) -> dest 应该是 [0, 0, 2, 3, 4]
  frame.stack.push(src); // src
  frame.stack.push(1);   // srcPos
  frame.stack.push(dest); // dest
  frame.stack.push(2);   // destPos
  frame.stack.push(3);   // length

  console.log("1. 执行 arraycopy(src, 1, dest, 2, 3)");
  console.log(`   源数组: ${src.printElements()}`);
  console.log(`   目标数组(前): ${dest.printElements()}`);

  const handler = NativeRegistry.get("java/lang/System", "arraycopy", "(Ljava/lang/Object;ILjava/lang/Object;II)V");
  if (!handler) throw new Error("System.arraycopy not found");

  handler(frame, thread);

  console.log(`   目标数组(后): ${dest.printElements()}`);

  // 验证结果
  if (dest.get(0) !== 0 || dest.get(1) !== 0 || dest.get(2) !== 2 || dest.get(3) !== 3 || dest.get(4) !== 4) {
    throw new Error("Array copy failed");
  }
  console.log("   ✅ 验证通过\n");
}

/**
 * 主测试函数
 */
export function testStdlib(): void {
  try {
    testArrayCopy();
    console.log("✅ 所有标准库测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testStdlib();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }
}
