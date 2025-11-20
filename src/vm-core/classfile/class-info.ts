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
 * J2ME-For-Web Class Info
 * 类信息解析 - Class 文件的核心数据结构
 */

import { CLASS_FILE_MAGIC, AccessFlags } from "../core/constants";
import { isPublic, isFinal, isAbstract, isInterface } from "../core/utils";
import { ClassFileReader } from "./reader";
import { ConstantPool } from "./constant-pool";
import { FieldInfo, parseFields } from "./field-info";
import { MethodInfo, parseMethods } from "./method-info";
import { Attribute, AttributeParser } from "./attributes";

/**
 * 类信息
 * 表示一个已解析的 Java Class 文件
 */
export class ClassInfo {
  // 基本信息
  readonly minorVersion: number;
  readonly majorVersion: number;
  readonly constantPool: ConstantPool;
  readonly accessFlags: number;
  readonly thisClass: string; // 类名
  readonly superClass: string | null; // 父类名 (null 表示 java.lang.Object)
  readonly interfaces: string[]; // 实现的接口列表

  // 字段和方法
  readonly fields: FieldInfo[];
  readonly methods: MethodInfo[];
  readonly attributes: Attribute[];

  // 静态 ID 计数器
  private static nextId = 0;
  readonly id: number;

  constructor(buffer: Uint8Array) {
    this.id = ClassInfo.nextId++;
    const reader = new ClassFileReader(buffer);

    // 1. 验证魔数
    const magic = reader.readU4();
    if (magic !== CLASS_FILE_MAGIC) {
      throw new Error(
        `Invalid class file magic: 0x${magic.toString(16)} (expected 0x${CLASS_FILE_MAGIC.toString(16)})`
      );
    }

    // 2. 读取版本号
    this.minorVersion = reader.readU2();
    this.majorVersion = reader.readU2();

    // 3. 解析常量池
    this.constantPool = new ConstantPool(reader);

    // 4. 读取访问标志
    this.accessFlags = reader.readU2();

    // 5. 读取类名和父类名
    const thisClassIndex = reader.readU2();
    this.thisClass = this.constantPool.getClassName(thisClassIndex);

    const superClassIndex = reader.readU2();
    this.superClass =
      superClassIndex === 0 ? null : this.constantPool.getClassName(superClassIndex);

    // 6. 读取接口列表
    const interfaceCount = reader.readU2();
    this.interfaces = [];
    for (let i = 0; i < interfaceCount; i++) {
      const interfaceIndex = reader.readU2();
      this.interfaces.push(this.constantPool.getClassName(interfaceIndex));
    }

    // 7. 解析字段
    this.fields = parseFields(reader, this.constantPool);

    // 8. 解析方法
    this.methods = parseMethods(reader, this.constantPool);
    // 设置方法的所属类
    for (const method of this.methods) {
      method.classInfo = this;
    }

    // 9. 解析类属性
    const attrParser = new AttributeParser(reader, this.constantPool);
    this.attributes = attrParser.parseAttributes();
  }

  // ============================================
  // 访问标志检查
  // ============================================

  isPublic(): boolean {
    return isPublic(this.accessFlags);
  }

  isFinal(): boolean {
    return isFinal(this.accessFlags);
  }

  isAbstract(): boolean {
    return isAbstract(this.accessFlags);
  }

  isInterface(): boolean {
    return isInterface(this.accessFlags);
  }

  // ============================================
  // 字段和方法查找
  // ============================================

  /**
   * 根据名称和描述符查找字段
   */
  getField(name: string, descriptor?: string): FieldInfo | undefined {
    return this.fields.find(
      (field) =>
        field.name === name && (descriptor === undefined || field.descriptor === descriptor)
    );
  }

  /**
   * 根据名称和描述符查找方法
   */
  getMethod(name: string, descriptor?: string): MethodInfo | undefined {
    return this.methods.find(
      (method) =>
        method.name === name &&
        (descriptor === undefined || method.descriptor === descriptor)
    );
  }

  /**
   * 获取所有静态字段
   */
  getStaticFields(): FieldInfo[] {
    return this.fields.filter((field) => field.isStatic());
  }

  /**
   * 获取所有实例字段
   */
  getInstanceFields(): FieldInfo[] {
    return this.fields.filter((field) => !field.isStatic());
  }

  /**
   * 获取所有静态方法
   */
  getStaticMethods(): MethodInfo[] {
    return this.methods.filter((method) => method.isStatic());
  }

  /**
   * 获取所有实例方法
   */
  getInstanceMethods(): MethodInfo[] {
    return this.methods.filter((method) => !method.isStatic());
  }

  /**
   * 获取构造方法
   */
  getConstructors(): MethodInfo[] {
    return this.methods.filter((method) => method.isConstructor());
  }

  // ============================================
  // 类型判断
  // ============================================

  /**
   * 获取 Java 版本
   */
  getJavaVersion(): string {
    // Java 版本映射
    const versionMap: Record<number, string> = {
      45: "1.1",
      46: "1.2",
      47: "1.3",
      48: "1.4",
      49: "5.0",
      50: "6",
      51: "7",
      52: "8",
    };
    return versionMap[this.majorVersion] || `Unknown (${this.majorVersion})`;
  }

  /**
   * 获取简单类名 (不含包名)
   */
  getSimpleName(): string {
    const lastSlash = this.thisClass.lastIndexOf("/");
    return lastSlash === -1 ? this.thisClass : this.thisClass.substring(lastSlash + 1);
  }

  /**
   * 获取包名
   */
  getPackageName(): string {
    const lastSlash = this.thisClass.lastIndexOf("/");
    return lastSlash === -1 ? "" : this.thisClass.substring(0, lastSlash).replace(/\//g, ".");
  }

  // ============================================
  // 调试信息
  // ============================================

  /**
   * 转换为字符串 (调试用)
   */
  toString(): string {
    const flags: string[] = [];
    if (this.isPublic()) flags.push("public");
    if (this.isFinal()) flags.push("final");
    if (this.isAbstract()) flags.push("abstract");

    const type = this.isInterface() ? "interface" : "class";
    const extendsClause = this.superClass ? ` extends ${this.superClass}` : "";
    const implementsClause =
      this.interfaces.length > 0 ? ` implements ${this.interfaces.join(", ")}` : "";

    return `${flags.join(" ")} ${type} ${this.thisClass}${extendsClause}${implementsClause}`;
  }

  /**
   * 打印详细信息
   */
  printDetails(): string {
    const lines: string[] = [];
    lines.push(`Class: ${this.thisClass}`);
    lines.push(`  Version: ${this.getJavaVersion()} (${this.majorVersion}.${this.minorVersion})`);
    lines.push(`  Super: ${this.superClass || "none"}`);
    lines.push(`  Interfaces: ${this.interfaces.join(", ") || "none"}`);
    lines.push(`  Fields: ${this.fields.length}`);
    lines.push(`  Methods: ${this.methods.length}`);
    lines.push(`  Constant Pool: ${this.constantPool.getSize()} entries`);
    return lines.join("\n");
  }
}
