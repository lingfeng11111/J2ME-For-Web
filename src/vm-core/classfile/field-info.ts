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
 * J2ME-For-Web Field Info
 * 字段信息解析
 */

import { AccessFlags } from "../core/constants";
import { isStatic, isFinal, isPublic, isPrivate, isProtected } from "../core/utils";
import { ClassFileReader } from "./reader";
import { ConstantPool } from "./constant-pool";
import { Attribute, AttributeParser } from "./attributes";

/**
 * 字段信息
 */
export class FieldInfo {
  readonly accessFlags: number;
  readonly name: string;
  readonly descriptor: string;
  readonly attributes: Attribute[];

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

  // ============================================
  // 类型判断
  // ============================================

  /**
   * 判断是否为基本类型字段
   */
  isPrimitive(): boolean {
    const desc = this.descriptor;
    return (
      desc === "B" || // byte
      desc === "C" || // char
      desc === "D" || // double
      desc === "F" || // float
      desc === "I" || // int
      desc === "J" || // long
      desc === "S" || // short
      desc === "Z" // boolean
    );
  }

  /**
   * 获取字段大小 (字节数)
   */
  getSize(): number {
    switch (this.descriptor) {
      case "B": // byte
      case "Z": // boolean
        return 1;
      case "C": // char
      case "S": // short
        return 2;
      case "I": // int
      case "F": // float
        return 4;
      case "J": // long
      case "D": // double
        return 8;
      default:
        // 引用类型 (对象/数组)
        return 4; // 假设 32 位指针
    }
  }

  /**
   * 获取字段的完整签名
   */
  getSignature(): string {
    return `${this.name}:${this.descriptor}`;
  }

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

    return `${flags.join(" ")} ${this.name}: ${this.descriptor}`;
  }
}

/**
 * 解析字段列表
 */
export function parseFields(
  reader: ClassFileReader,
  constantPool: ConstantPool
): FieldInfo[] {
  const count = reader.readU2();
  const fields: FieldInfo[] = [];

  for (let i = 0; i < count; i++) {
    fields.push(new FieldInfo(reader, constantPool));
  }

  return fields;
}
