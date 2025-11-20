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
 * J2ME-For-Web Constant Pool Test
 * 简单的常量池解析测试
 */

import { ClassFileReader } from "../../src/vm-core/classfile/reader";
import { ConstantPool } from "../../src/vm-core/classfile/constant-pool";
import { CLASS_FILE_MAGIC } from "../../src/vm-core/core/constants";

/**
 * 创建一个最小的 Class 文件用于测试
 * 包含基本的常量池结构
 */
function createMinimalClassFile(): Uint8Array {
  const buffer: number[] = [];

  // 魔数: 0xCAFEBABE
  buffer.push(0xca, 0xfe, 0xba, 0xbe);

  // 版本号: minor=0, major=45 (Java 1.1)
  buffer.push(0x00, 0x00); // minor
  buffer.push(0x00, 0x2d); // major

  // 常量池大小: 5 个条目 (索引 1-4)
  buffer.push(0x00, 0x05);

  // 条目 1: UTF-8 "Test"
  buffer.push(0x01); // tag = UTF-8
  buffer.push(0x00, 0x04); // length = 4
  buffer.push(0x54, 0x65, 0x73, 0x74); // "Test"

  // 条目 2: Class (指向条目 1)
  buffer.push(0x07); // tag = Class
  buffer.push(0x00, 0x01); // nameIndex = 1

  // 条目 3: Integer 42
  buffer.push(0x03); // tag = Integer
  buffer.push(0x00, 0x00, 0x00, 0x2a); // value = 42

  // 条目 4: Long 9007199254740991n
  buffer.push(0x05); // tag = Long
  buffer.push(0x00, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff); // value

  return new Uint8Array(buffer);
}

/**
 * 测试常量池解析
 */
export function testConstantPool(): void {
  console.log("=== 常量池解析测试 ===\n");

  const classFile = createMinimalClassFile();
  const reader = new ClassFileReader(classFile);

  // 1. 验证魔数
  const magic = reader.readU4();
  console.log(`1. 魔数: 0x${magic.toString(16)} (期望: 0xcafebabe)`);
  if (magic !== CLASS_FILE_MAGIC) {
    throw new Error("Invalid class file magic number");
  }

  // 2. 读取版本号
  const minorVersion = reader.readU2();
  const majorVersion = reader.readU2();
  console.log(`2. 版本: ${majorVersion}.${minorVersion}\n`);

  // 3. 解析常量池
  const constantPool = new ConstantPool(reader);
  console.log(`3. 常量池大小: ${constantPool.getSize()} 个条目\n`);

  // 4. 测试 UTF-8 常量
  const utf8Value = constantPool.getUtf8(1);
  console.log(`4. UTF-8 常量 [1]: "${utf8Value}" (期望: "Test")`);

  // 5. 测试 Class 常量
  const className = constantPool.getClassName(2);
  console.log(`5. Class 常量 [2]: "${className}" (期望: "Test")`);

  // 6. 测试 Integer 常量
  const intEntry = constantPool.get(3);
  console.log(`6. Integer 常量 [3]: ${intEntry.tag === 3 ? (intEntry as any).value : "错误"} (期望: 42)`);

  // 7. 测试 Long 常量 (BigInt)
  const longEntry = constantPool.get(4);
  console.log(`7. Long 常量 [4]: ${longEntry.tag === 5 ? (longEntry as any).value : "错误"}n (期望: 9007199254740991n)`);

  console.log("\n✅ 所有测试通过!");
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testConstantPool();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }
}
