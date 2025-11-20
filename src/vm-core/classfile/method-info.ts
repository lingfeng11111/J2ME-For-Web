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
 * J2ME-For-Web Method Info
 * 方法信息解析
 */

import {
  isStatic,
  isFinal,
  isPublic,
  isPrivate,
  isProtected,
  isNative,
  isAbstract,
  parseMethodDescriptor,
} from "../core/utils";
import { ClassFileReader } from "./reader";
import { ConstantPool } from "./constant-pool";
import { Attribute, AttributeParser, CodeAttribute } from "./attributes";

/**
 * 方法信息
 */
export class MethodInfo {
  readonly accessFlags: number;
  readonly name: string;
  readonly descriptor: string;
  readonly attributes: Attribute[];

  // 缓存的解析结果
  private _paramTypes?: string[];
  private _returnType?: string;
  private _code?: CodeAttribute;
  
  // 所属类信息 (由 ClassInfo 解析完成后设置)
  public classInfo!: any; // 使用 any 避免循环依赖导入问题,或者使用接口

  constructor(reader: ClassFileReader, constantPool: ConstantPool) {
    this.accessFlags = reader.readU2();

    const nameIndex = reader.readU2();
    this.name = constantPool.getUtf8(nameIndex);

    const descriptorIndex = reader.readU2();
    this.descriptor = constantPool.getUtf8(descriptorIndex);

    // 解析属性
    const attrParser = new AttributeParser(reader, constantPool);
    this.attributes = attrParser.parseAttributes();
  }

  // ============================================
  // 访问标志检查
  // ============================================

  isStatic(): boolean {
    return isStatic(this.accessFlags);
  }

  isFinal(): boolean {
    return isFinal(this.accessFlags);
  }

  isPublic(): boolean {
    return isPublic(this.accessFlags);
  }

  isPrivate(): boolean {
    return isPrivate(this.accessFlags);
  }

  isProtected(): boolean {
    return isProtected(this.accessFlags);
  }

  isNative(): boolean {
    return isNative(this.accessFlags);
  }

  isAbstract(): boolean {
    return isAbstract(this.accessFlags);
  }

  // ============================================
  // 方法类型判断
  // ============================================

  /**
   * 是否为构造方法
   */
  isConstructor(): boolean {
    return this.name === "<init>";
  }

  /**
   * 是否为静态初始化方法
   */
  isStaticInitializer(): boolean {
    return this.name === "<clinit>";
  }

  // ============================================
  // 方法签名解析
  // ============================================

  /**
   * 获取参数类型列表
   */
  getParameterTypes(): string[] {
    if (!this._paramTypes) {
      const parsed = parseMethodDescriptor(this.descriptor);
      this._paramTypes = parsed.params;
    }
    return this._paramTypes;
  }

  /**
   * 获取返回类型
   */
  getReturnType(): string {
    if (!this._returnType) {
      const parsed = parseMethodDescriptor(this.descriptor);
      this._returnType = parsed.returnType;
    }
    return this._returnType;
  }

  /**
   * 获取参数个数
   */
  getParameterCount(): number {
    return this.getParameterTypes().length;
  }

  /**
   * 获取方法的完整签名
   */
  getSignature(): string {
    return `${this.name}${this.descriptor}`;
  }

  // ============================================
  // Code 属性访问
  // ============================================

  /**
   * 获取 Code 属性
   */
  getCode(): CodeAttribute | undefined {
    if (this._code === undefined) {
      this._code = this.attributes.find(
        (attr) => attr.name === "Code"
      ) as CodeAttribute;
    }
    return this._code;
  }

  /**
   * 是否有字节码
   */
  hasCode(): boolean {
    return this.getCode() !== undefined;
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
    if (this.isPrivate()) flags.push("private");
    if (this.isProtected()) flags.push("protected");
    if (this.isStatic()) flags.push("static");
    if (this.isFinal()) flags.push("final");
    if (this.isNative()) flags.push("native");
    if (this.isAbstract()) flags.push("abstract");

    const params = this.getParameterTypes().join(", ");
    const returnType = this.getReturnType();

    return `${flags.join(" ")} ${returnType} ${this.name}(${params})`;
  }
}

/**
 * 解析方法列表
 */
export function parseMethods(
  reader: ClassFileReader,
  constantPool: ConstantPool
): MethodInfo[] {
  const count = reader.readU2();
  const methods: MethodInfo[] = [];

  for (let i = 0; i < count; i++) {
    methods.push(new MethodInfo(reader, constantPool));
  }

  return methods;
}
