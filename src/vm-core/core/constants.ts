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
 * J2ME-For-Web Core Constants
 * 定义 Class 文件格式相关的常量
 */

// ============================================
// Class 文件魔数
// ============================================

/** Class 文件魔数: 0xCAFEBABE */
export const CLASS_FILE_MAGIC = 0xcafebabe;

// ============================================
// 常量池标签 (Constant Pool Tags)
// ============================================

export enum ConstantTag {
  Utf8 = 1,
  Integer = 3,
  Float = 4,
  Long = 5,
  Double = 6,
  Class = 7,
  String = 8,
  Fieldref = 9,
  Methodref = 10,
  InterfaceMethodref = 11,
  NameAndType = 12,
}

/** 常量池条目的固定大小 (字节数,不包括 tag) */
export const CONSTANT_TAG_SIZE: Record<number, number> = {
  [ConstantTag.Integer]: 4,
  [ConstantTag.Float]: 4,
  [ConstantTag.Long]: 8,
  [ConstantTag.Double]: 8,
  [ConstantTag.Class]: 2,
  [ConstantTag.String]: 2,
  [ConstantTag.Fieldref]: 4,
  [ConstantTag.Methodref]: 4,
  [ConstantTag.InterfaceMethodref]: 4,
  [ConstantTag.NameAndType]: 4,
  // Utf8 是可变长度,需要特殊处理
};

// ============================================
// 访问标志 (Access Flags)
// ============================================

export enum AccessFlags {
  PUBLIC = 0x0001,
  PRIVATE = 0x0002,
  PROTECTED = 0x0004,
  STATIC = 0x0008,
  FINAL = 0x0010,
  SYNCHRONIZED = 0x0020,
  VOLATILE = 0x0040,
  TRANSIENT = 0x0080,
  NATIVE = 0x0100,
  INTERFACE = 0x0200,
  ABSTRACT = 0x0400,
  STRICT = 0x0800,
}

// ============================================
// 基本类型描述符
// ============================================

export enum PrimitiveType {
  BYTE = "B",
  CHAR = "C",
  DOUBLE = "D",
  FLOAT = "F",
  INT = "I",
  LONG = "J",
  SHORT = "S",
  BOOLEAN = "Z",
  VOID = "V",
}

/** 基本类型的字节大小 */
export const PRIMITIVE_SIZE: Record<string, number> = {
  B: 1, // byte
  C: 2, // char
  D: 8, // double
  F: 4, // float
  I: 4, // int
  J: 8, // long
  S: 2, // short
  Z: 1, // boolean
};

// ============================================
// 执行状态 (用于 Generator yield)
// ============================================

/**
 * 执行状态枚举
 * 用于 Interpreter.execute() 的 Generator yield 返回值
 * 替代旧的 UnwindException 异常方式
 */
export enum ExecutionStatus {
  RUNNING = 0,      // 继续执行
  PAUSED = 1,       // 等待 I/O 或时间片耗尽
  BLOCKED = 2,      // 等待锁
  WAITING = 3,      // 等待 notify
  TIMED_WAITING = 4, // 等待 notify 或超时
  TERMINATED = 5,   // 执行结束
}
