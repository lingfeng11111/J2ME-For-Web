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
 * J2ME-For-Web Constant Pool Types
 * 常量池条目的类型定义
 */

import { ConstantTag } from "../core/constants";

// ============================================
// 常量池条目基类
// ============================================

export interface ConstantPoolEntry {
  tag: ConstantTag;
}

// ============================================
// 各种常量池条目类型
// ============================================

/** UTF-8 字符串常量 */
export interface Utf8Constant extends ConstantPoolEntry {
  tag: ConstantTag.Utf8;
  bytes: Uint8Array; // 原始 UTF-8 字节 (延迟解码)
  value?: string; // 缓存的字符串值
}

/** 整数常量 */
export interface IntegerConstant extends ConstantPoolEntry {
  tag: ConstantTag.Integer;
  value: number;
}

/** 浮点数常量 */
export interface FloatConstant extends ConstantPoolEntry {
  tag: ConstantTag.Float;
  value: number;
}

/** 长整数常量 */
export interface LongConstant extends ConstantPoolEntry {
  tag: ConstantTag.Long;
  value: bigint;
}

/** 双精度浮点数常量 */
export interface DoubleConstant extends ConstantPoolEntry {
  tag: ConstantTag.Double;
  value: number;
}

/** 类引用常量 */
export interface ClassConstant extends ConstantPoolEntry {
  tag: ConstantTag.Class;
  nameIndex: number; // 指向 UTF-8 常量的索引
}

/** 字符串常量 */
export interface StringConstant extends ConstantPoolEntry {
  tag: ConstantTag.String;
  stringIndex: number; // 指向 UTF-8 常量的索引
}

/** 字段引用常量 */
export interface FieldrefConstant extends ConstantPoolEntry {
  tag: ConstantTag.Fieldref;
  classIndex: number; // 指向 Class 常量的索引
  nameAndTypeIndex: number; // 指向 NameAndType 常量的索引
}

/** 方法引用常量 */
export interface MethodrefConstant extends ConstantPoolEntry {
  tag: ConstantTag.Methodref;
  classIndex: number;
  nameAndTypeIndex: number;
}

/** 接口方法引用常量 */
export interface InterfaceMethodrefConstant extends ConstantPoolEntry {
  tag: ConstantTag.InterfaceMethodref;
  classIndex: number;
  nameAndTypeIndex: number;
}

/** 名称和类型常量 */
export interface NameAndTypeConstant extends ConstantPoolEntry {
  tag: ConstantTag.NameAndType;
  nameIndex: number; // 指向 UTF-8 常量的索引 (名称)
  descriptorIndex: number; // 指向 UTF-8 常量的索引 (描述符)
}

// ============================================
// 联合类型
// ============================================

export type ConstantValue =
  | Utf8Constant
  | IntegerConstant
  | FloatConstant
  | LongConstant
  | DoubleConstant
  | ClassConstant
  | StringConstant
  | FieldrefConstant
  | MethodrefConstant
  | InterfaceMethodrefConstant
  | NameAndTypeConstant;

// ============================================
// 辅助类型
// ============================================

/** 已解析的类引用 */
export interface ResolvedClassRef {
  name: string; // 类的内部名称 (如 "java/lang/String")
}

/** 已解析的字段引用 */
export interface ResolvedFieldRef {
  className: string;
  fieldName: string;
  descriptor: string;
}

/** 已解析的方法引用 */
export interface ResolvedMethodRef {
  className: string;
  methodName: string;
  descriptor: string;
}
