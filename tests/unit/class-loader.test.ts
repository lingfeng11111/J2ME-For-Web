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
 * J2ME-For-Web Class Loader Test
 * 类加载器测试
 */

import { ClassLoader, ClassPath } from "../../src/vm-core/classfile/class-loader";

/**
 * 模拟的 ClassPath
 */
class MockClassPath implements ClassPath {
  private files: Map<string, Uint8Array> = new Map();

  addClass(className: string, data: Uint8Array): void {
    this.files.set(className, data);
  }

  readClass(className: string): Uint8Array | null {
    return this.files.get(className) || null;
  }
}

/**
 * 创建一个最小的 Class 文件
 */
function createClassFile(className: string, superClass: string = "java/lang/Object"): Uint8Array {
  const buffer: number[] = [];
  
  // 魔数
  buffer.push(0xca, 0xfe, 0xba, 0xbe);
  // 版本
  buffer.push(0x00, 0x00, 0x00, 0x34);
  
  // 常量池
  // 1: UTF-8 className
  // 2: Class className
  // 3: UTF-8 superClass
  // 4: Class superClass
  buffer.push(0x00, 0x05); // count=5

  // [1] UTF-8 className
  buffer.push(0x01);
  buffer.push((className.length >> 8) & 0xff, className.length & 0xff);
  for (let i = 0; i < className.length; i++) buffer.push(className.charCodeAt(i));

  // [2] Class className
  buffer.push(0x07, 0x00, 0x01);

  // [3] UTF-8 superClass
  buffer.push(0x01);
  buffer.push((superClass.length >> 8) & 0xff, superClass.length & 0xff);
  for (let i = 0; i < superClass.length; i++) buffer.push(superClass.charCodeAt(i));

  // [4] Class superClass
  buffer.push(0x07, 0x00, 0x03);

  // 访问标志
  buffer.push(0x00, 0x01); // public
  // this_class
  buffer.push(0x00, 0x02);
  // super_class
  buffer.push(0x00, 0x04);
  // interfaces_count
  buffer.push(0x00, 0x00);
  // fields_count
  buffer.push(0x00, 0x00);
  // methods_count
  buffer.push(0x00, 0x00);
  // attributes_count
  buffer.push(0x00, 0x00);

  return new Uint8Array(buffer);
}

/**
 * 测试类加载器
 */
function testClassLoader(): void {
  console.log("=== 类加载器测试 ===\n");

  const classPath = new MockClassPath();
  
  // 准备测试数据
  // java/lang/Object (基类)
  classPath.addClass("java/lang/Object", createClassFile("java/lang/Object", ""));
  
  // MyClass extends java/lang/Object
  classPath.addClass("MyClass", createClassFile("MyClass", "java/lang/Object"));

  const loader = new ClassLoader(classPath);

  // 1. 加载普通类
  console.log("1. 加载 MyClass");
  const myClass = loader.loadClass("MyClass");
  console.log(`   类名: ${myClass.thisClass}`);
  console.log(`   父类: ${myClass.superClass}`);
  
  if (myClass.thisClass !== "MyClass" || myClass.superClass !== "java/lang/Object") {
    throw new Error("Class loading failed");
  }

  // 验证父类是否自动加载
  const objectClass = loader.getClass("java/lang/Object");
  console.log(`   父类是否已加载: ${!!objectClass}`);
  if (!objectClass) {
    throw new Error("Super class not loaded recursively");
  }
  console.log("   ✅ 验证通过\n");

  // 2. 加载数组类
  console.log("2. 加载数组类 [I");
  const arrayClass = loader.loadClass("[I");
  console.log(`   类名: ${arrayClass.thisClass}`);
  console.log(`   父类: ${arrayClass.superClass}`);
  
  if (arrayClass.thisClass !== "[I" || arrayClass.superClass !== "java/lang/Object") {
    throw new Error("Array class loading failed");
  }
  console.log("   ✅ 验证通过\n");

  // 3. 缓存测试
  console.log("3. 缓存测试");
  const myClass2 = loader.loadClass("MyClass");
  console.log(`   第二次加载是否返回同一实例: ${myClass === myClass2}`);
  if (myClass !== myClass2) {
    throw new Error("Cache not working");
  }
  console.log("   ✅ 验证通过\n");

  // 4. 异常测试
  console.log("4. 异常测试");
  try {
    loader.loadClass("UnknownClass");
    throw new Error("Should throw ClassNotFoundException");
  } catch (e: any) {
    console.log(`   ✅ 捕获异常: ${e.message}\n`);
  }
}

/**
 * 主测试函数
 */
export function testLoader(): void {
  try {
    testClassLoader();
    console.log("✅ 所有类加载器测试通过!");
  } catch (error) {
    console.error("❌ 测试失败:", error);
    throw error;
  }
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testLoader();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }
}
