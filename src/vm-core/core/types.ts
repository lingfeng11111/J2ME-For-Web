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
 * J2ME-For-Web Core Types
 * 定义 Java 基本类型和引用类型的 TypeScript 映射
 */

// ============================================
// Java 基本类型 (Primitive Types)
// ============================================

/** Java byte: -128 ~ 127 */
export type JavaByte = number;

/** Java short: -32768 ~ 32767 */
export type JavaShort = number;

/** Java int: -2^31 ~ 2^31-1 */
export type JavaInt = number;

/** Java long: -2^63 ~ 2^63-1 (使用原生 BigInt) */
export type JavaLong = bigint;

/** Java float: 32-bit IEEE 754 */
export type JavaFloat = number;

/** Java double: 64-bit IEEE 754 */
export type JavaDouble = number;

/** Java char: 0 ~ 65535 (Unicode) */
export type JavaChar = number;

/** Java boolean: true/false */
export type JavaBoolean = boolean;

// ============================================
// Java 引用类型 (Reference Types)
// ============================================

/** Java 对象引用 */
export type JavaReference = object | null;

// 移除 JavaObject 和 JavaArray 接口定义,直接使用 runtime 中的类
// 这样可以避免类型冲突和循环依赖

// ============================================
// 类型化数组联合类型
// ============================================

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

// ============================================
// Java 值类型 (所有可能的栈值)
// ============================================

export type JavaValue =
  | JavaByte
  | JavaShort
  | JavaInt
  | JavaLong
  | JavaFloat
  | JavaDouble
  | JavaChar
  | JavaBoolean
  | JavaReference;
