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
 * J2ME-For-Web Core Utilities
 * 通用工具函数
 */

import { AccessFlags } from "./constants";

// ============================================
// 访问标志检查
// ============================================

export function isPublic(flags: number): boolean {
  return (flags & AccessFlags.PUBLIC) !== 0;
}

export function isPrivate(flags: number): boolean {
  return (flags & AccessFlags.PRIVATE) !== 0;
}

export function isProtected(flags: number): boolean {
  return (flags & AccessFlags.PROTECTED) !== 0;
}

export function isStatic(flags: number): boolean {
  return (flags & AccessFlags.STATIC) !== 0;
}

export function isFinal(flags: number): boolean {
  return (flags & AccessFlags.FINAL) !== 0;
}

export function isNative(flags: number): boolean {
  return (flags & AccessFlags.NATIVE) !== 0;
}

export function isAbstract(flags: number): boolean {
  return (flags & AccessFlags.ABSTRACT) !== 0;
}

export function isInterface(flags: number): boolean {
  return (flags & AccessFlags.INTERFACE) !== 0;
}

// ============================================
// 字符串工具
// ============================================

/**
 * 将 Java 内部类名转换为点分隔格式
 * @example "java/lang/String" => "java.lang.String"
 */
export function internalNameToDotted(internalName: string): string {
  return internalName.replace(/\//g, ".");
}

/**
 * 将点分隔类名转换为内部格式
 * @example "java.lang.String" => "java/lang/String"
 */
export function dottedNameToInternal(dottedName: string): string {
  return dottedName.replace(/\./g, "/");
}

/**
 * 解析方法描述符,提取参数类型和返回类型
 * @example "(ILjava/lang/String;)V" => { params: ["I", "Ljava/lang/String;"], returnType: "V" }
 */
export function parseMethodDescriptor(descriptor: string): {
  params: string[];
  returnType: string;
} {
  const params: string[] = [];
  let i = 1; // 跳过开头的 '('

  while (descriptor[i] !== ")") {
    const param = readTypeDescriptor(descriptor, i);
    params.push(param);
    i += param.length;
  }

  const returnType = descriptor.substring(i + 1);
  return { params, returnType };
}

/**
 * 从指定位置读取一个类型描述符
 */
function readTypeDescriptor(descriptor: string, start: number): string {
  const ch = descriptor[start];

  // 基本类型
  if ("BCDFIJSZ".includes(ch)) {
    return ch;
  }

  // 对象类型: Lpackage/ClassName;
  if (ch === "L") {
    const end = descriptor.indexOf(";", start);
    return descriptor.substring(start, end + 1);
  }

  // 数组类型: [type
  if (ch === "[") {
    return "[" + readTypeDescriptor(descriptor, start + 1);
  }

  throw new Error(`Invalid type descriptor at position ${start}: ${descriptor}`);
}

// ============================================
// 数组工具
// ============================================

/**
 * 创建指定大小的密集数组,并用默认值填充
 */
export function makeDenseArray<T>(size: number, defaultValue: T): T[] {
  const arr = new Array<T>(size);
  for (let i = 0; i < size; i++) {
    arr[i] = defaultValue;
  }
  return arr;
}

// ============================================
// 调试工具
// ============================================

/**
 * 将字节数组转换为十六进制字符串
 */
export function bytesToHex(bytes: Uint8Array, maxLength = 16): string {
  const len = Math.min(bytes.length, maxLength);
  const hex = Array.from(bytes.slice(0, len))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
  return bytes.length > maxLength ? `${hex}...` : hex;
}
