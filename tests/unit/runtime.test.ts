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
 * J2ME-For-Web Runtime Test
 * 运行时对象模型测试
 */

import { ClassInfo } from "../../src/vm-core/classfile/class-info";
import { JavaObject } from "../../src/vm-core/runtime/object";
import { JavaArray } from "../../src/vm-core/runtime/array";
import { JavaString, StringPool } from "../../src/vm-core/runtime/string";

/**
 * 创建测试用的 Class 文件
 */
function createTestClass(): Uint8Array {
  const buffer: number[] = [];

  // 魔数
  buffer.push(0xca, 0xfe, 0xba, 0xbe);
  // 版本号
  buffer.push(0x00, 0x00, 0x00, 0x34);

  // 常量池: 7 个条目
  buffer.push(0x00, 0x07);

  // [1] UTF-8 "Point"
  buffer.push(0x01, 0x00, 0x05);
  buffer.push(...Array.from("Point").map((c) => c.charCodeAt(0)));

  // [2] Class (指向 [1])
  buffer.push(0x07, 0x00, 0x01);

  // [3] UTF-8 "java/lang/Object"
  buffer.push(0x01, 0x00, 0x10);
  buffer.push(...Array.from("java/lang/Object").map((c) => c.charCodeAt(0)));

  // [4] Class (指向 [3])
  buffer.push(0x07, 0x00, 0x03);

  // [5] UTF-8 "x"
  buffer.push(0x01, 0x00, 0x01, 0x78);

  // [6] UTF-8 "I"
  buffer.push(0x01, 0x00, 0x01, 0x49);

  // 访问标志: public
  buffer.push(0x00, 0x01);
  // this_class, super_class
  buffer.push(0x00, 0x02, 0x00, 0x04);
  // 接口数量: 0
  buffer.push(0x00, 0x00);

  // 字段数量: 1 (int x)
  buffer.push(0x00, 0x01);
  buffer.push(0x00, 0x00); // access_flags
  buffer.push(0x00, 0x05); // name: "x"
  buffer.push(0x00, 0x06); // descriptor: "I"
  buffer.push(0x00, 0x00); // attributes: 0

  // 方法数量: 0
  buffer.push(0x00, 0x00);
  // 类属性数量: 0
  buffer.push(0x00, 0x00);

  return new Uint8Array(buffer);
}

/**
 * 测试 JavaObject
 */
function testJavaObject(): void {
  console.log("=== JavaObject 测试 ===\n");

  const classFile = createTestClass();
  const classInfo = new ClassInfo(classFile);

  // 创建对象
  const obj = new JavaObject(classInfo);
  console.log(`1. 创建对象: ${obj.toString()}`);
  console.log(`   类名: ${obj.getClassName()}\n`);

  // 设置字段
  obj.setField("x", "I", 42);
  console.log(`2. 设置字段 x = 42`);

  // 获取字段
  const x = obj.getField("x", "I");
  console.log(`3. 获取字段 x = ${x}\n`);

  // 打印所有字段
  console.log("4. 所有字段:");
  console.log(obj.printFields());
  console.log();
}

/**
 * 测试 JavaArray
 */
function testJavaArray(): void {
  console.log("=== JavaArray 测试 ===\n");

  // 测试 int 数组
  const intArray = JavaArray.createFromDescriptor("I", 5);
  console.log(`1. 创建 int 数组: ${intArray.toString()}`);
  console.log(`   是否为基本类型数组: ${intArray.isPrimitiveArray()}\n`);

  // 填充数组
  for (let i = 0; i < intArray.length; i++) {
    intArray.set(i, i * 10);
  }
  console.log(`2. 填充数组:`);
  console.log(`   ${intArray.printElements()}\n`);

  // 测试 long 数组 (BigInt)
  const longArray = JavaArray.createFromDescriptor("J", 3);
  longArray.set(0, 100n);
  longArray.set(1, 200n);
  longArray.set(2, 9007199254740991n); // 大于 Number.MAX_SAFE_INTEGER
  console.log(`3. long 数组:`);
  console.log(`   ${longArray.printElements()}\n`);

  // 测试数组复制
  const destArray = JavaArray.createFromDescriptor("I", 5);
  intArray.copyTo(destArray, 0, 0, 5);
  console.log(`4. 数组复制:`);
  console.log(`   源: ${intArray.printElements()}`);
  console.log(`   目标: ${destArray.printElements()}\n`);
}

/**
 * 测试 JavaString
 */
function testJavaString(): void {
  console.log("=== JavaString 测试 ===\n");

  // 创建一个简单的 String 类信息 (模拟)
  const stringClassInfo = { thisClass: "java/lang/String" } as any;

  // 创建字符串
  const str1 = new JavaString(stringClassInfo, "Hello");
  const str2 = new JavaString(stringClassInfo, "World");

  console.log(`1. 创建字符串:`);
  console.log(`   str1 = "${str1.getValue()}"`);
  console.log(`   str2 = "${str2.getValue()}"\n`);

  // 字符串连接
  const str3 = str1.concat(str2);
  console.log(`2. 字符串连接:`);
  console.log(`   str1 + str2 = "${str3.getValue()}"\n`);

  // 字符串比较
  console.log(`3. 字符串比较:`);
  console.log(`   str1.equals(str2) = ${str1.equals(str2)}`);
  console.log(`   str1.compareTo(str2) = ${str1.compareTo(str2)}\n`);

  // 字符串池
  const pool = new StringPool();
  const s1 = pool.intern(stringClassInfo, "Test");
  const s2 = pool.intern(stringClassInfo, "Test");
  console.log(`4. 字符串池:`);
  console.log(`   s1 === s2: ${s1 === s2} (应该为 true)`);
  console.log(`   池大小: ${pool.size()}\n`);
}

/**
 * 主测试函数
 */
export function testRuntime(): void {
  console.log("=== 运行时对象模型测试 ===\n");

  try {
    testJavaObject();
    testJavaArray();
    testJavaString();

    console.log("✅ 所有运行时测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testRuntime();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
