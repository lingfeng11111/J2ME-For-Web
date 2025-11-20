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
 * J2ME-For-Web Class Info Test
 * 完整的 Class 文件解析测试
 */

import { ClassInfo } from "../../src/vm-core/classfile/class-info";

/**
 * 创建一个包含字段和方法的测试 Class 文件
 */
function createTestClassFile(): Uint8Array {
  const buffer: number[] = [];

  // 魔数
  buffer.push(0xca, 0xfe, 0xba, 0xbe);

  // 版本号: 52.0 (Java 8)
  buffer.push(0x00, 0x00); // minor
  buffer.push(0x00, 0x34); // major = 52

  // 常量池大小: 10 个条目
  buffer.push(0x00, 0x0a);

  // [1] UTF-8 "TestClass"
  buffer.push(0x01, 0x00, 0x09);
  buffer.push(...Array.from("TestClass").map((c) => c.charCodeAt(0)));

  // [2] Class (指向 [1])
  buffer.push(0x07, 0x00, 0x01);

  // [3] UTF-8 "java/lang/Object"
  buffer.push(0x01, 0x00, 0x10);
  buffer.push(...Array.from("java/lang/Object").map((c) => c.charCodeAt(0)));

  // [4] Class (指向 [3])
  buffer.push(0x07, 0x00, 0x03);

  // [5] UTF-8 "value"
  buffer.push(0x01, 0x00, 0x05);
  buffer.push(...Array.from("value").map((c) => c.charCodeAt(0)));

  // [6] UTF-8 "I" (int 描述符)
  buffer.push(0x01, 0x00, 0x01);
  buffer.push(0x49); // 'I'

  // [7] UTF-8 "getValue"
  buffer.push(0x01, 0x00, 0x08);
  buffer.push(...Array.from("getValue").map((c) => c.charCodeAt(0)));

  // [8] UTF-8 "()I" (方法描述符)
  buffer.push(0x01, 0x00, 0x03);
  buffer.push(0x28, 0x29, 0x49); // "()I"

  // [9] UTF-8 "Code"
  buffer.push(0x01, 0x00, 0x04);
  buffer.push(...Array.from("Code").map((c) => c.charCodeAt(0)));

  // 访问标志: public (0x0001)
  buffer.push(0x00, 0x01);

  // this_class: [2]
  buffer.push(0x00, 0x02);

  // super_class: [4]
  buffer.push(0x00, 0x04);

  // 接口数量: 0
  buffer.push(0x00, 0x00);

  // 字段数量: 1
  buffer.push(0x00, 0x01);

  // 字段: private int value
  buffer.push(0x00, 0x02); // access_flags: private
  buffer.push(0x00, 0x05); // name_index: [5] "value"
  buffer.push(0x00, 0x06); // descriptor_index: [6] "I"
  buffer.push(0x00, 0x00); // attributes_count: 0

  // 方法数量: 1
  buffer.push(0x00, 0x01);

  // 方法: public int getValue()
  buffer.push(0x00, 0x01); // access_flags: public
  buffer.push(0x00, 0x07); // name_index: [7] "getValue"
  buffer.push(0x00, 0x08); // descriptor_index: [8] "()I"
  buffer.push(0x00, 0x01); // attributes_count: 1

  // Code 属性
  buffer.push(0x00, 0x09); // attribute_name_index: [9] "Code"
  buffer.push(0x00, 0x00, 0x00, 0x11); // attribute_length: 17

  buffer.push(0x00, 0x02); // max_stack: 2
  buffer.push(0x00, 0x01); // max_locals: 1
  buffer.push(0x00, 0x00, 0x00, 0x05); // code_length: 5

  // 字节码: aload_0, getfield, ireturn
  buffer.push(0x2a); // aload_0
  buffer.push(0xb4, 0x00, 0x05); // getfield (假设索引)
  buffer.push(0xac); // ireturn

  buffer.push(0x00, 0x00); // exception_table_length: 0
  buffer.push(0x00, 0x00); // attributes_count: 0

  // 类属性数量: 0
  buffer.push(0x00, 0x00);

  return new Uint8Array(buffer);
}

/**
 * 测试 ClassInfo 解析
 */
export function testClassInfo(): void {
  console.log("=== ClassInfo 解析测试 ===\n");

  const classFile = createTestClassFile();
  const classInfo = new ClassInfo(classFile);

  // 1. 基本信息
  console.log("1. 基本信息:");
  console.log(`   类名: ${classInfo.thisClass}`);
  console.log(`   父类: ${classInfo.superClass}`);
  console.log(`   版本: ${classInfo.getJavaVersion()}`);
  console.log(`   访问标志: ${classInfo.isPublic() ? "public" : "non-public"}\n`);

  // 2. 字段信息
  console.log("2. 字段信息:");
  console.log(`   字段数量: ${classInfo.fields.length}`);
  if (classInfo.fields.length > 0) {
    const field = classInfo.fields[0];
    console.log(`   字段[0]: ${field.toString()}`);
    console.log(`   是否为基本类型: ${field.isPrimitive()}`);
    console.log(`   大小: ${field.getSize()} 字节\n`);
  }

  // 3. 方法信息
  console.log("3. 方法信息:");
  console.log(`   方法数量: ${classInfo.methods.length}`);
  if (classInfo.methods.length > 0) {
    const method = classInfo.methods[0];
    console.log(`   方法[0]: ${method.name}${method.descriptor}`);
    console.log(`   参数数量: ${method.getParameterCount()}`);
    console.log(`   返回类型: ${method.getReturnType()}`);
    console.log(`   是否有代码: ${method.hasCode()}`);

    const code = method.getCode();
    if (code) {
      console.log(`   最大栈深度: ${code.maxStack}`);
      console.log(`   最大局部变量: ${code.maxLocals}`);
      console.log(`   字节码长度: ${code.code.length} 字节\n`);
    }
  }

  // 4. 详细信息
  console.log("4. 详细信息:");
  console.log(classInfo.printDetails());

  console.log("\n✅ ClassInfo 解析测试通过!");
}

// 如果直接运行此文件,执行测试
if (require.main === module) {
  try {
    testClassInfo();
  } catch (error) {
    console.error("❌ 测试失败:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
