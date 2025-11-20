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
 * J2ME-For-Web Bytecode Descriptors
 * 字节码指令的元数据描述
 */

import { Opcode } from "./opcodes";

// ============================================
// 指令标志
// ============================================

export enum OpcodeFlags {
  NONE = 0,
  STOP = 1 << 0, // 终止执行 (return, athrow)
  FALL_THROUGH = 1 << 1, // 可以穿透到下一条指令
  BRANCH = 1 << 2, // 分支跳转
  CONDITIONAL = 1 << 3, // 条件分支
  UNCONDITIONAL = 1 << 4, // 无条件跳转
  INVOKE = 1 << 5, // 方法调用
  TRAP = 1 << 6, // 可能抛出异常
  COMMUTATIVE = 1 << 7, // 交换律 (a+b = b+a)
  ASSOCIATIVE = 1 << 8, // 结合律 ((a+b)+c = a+(b+c))
}

// ============================================
// 指令格式
// ============================================

export enum OpcodeFormat {
  /** 无操作数 */
  NONE,
  /** 1 字节无符号整数 */
  U1,
  /** 2 字节无符号整数 */
  U2,
  /** 1 字节有符号整数 */
  I1,
  /** 2 字节有符号整数 */
  I2,
  /** 局部变量索引 (1 字节) */
  LOCAL,
  /** 常量池索引 (1 字节) */
  CONST1,
  /** 常量池索引 (2 字节) */
  CONST2,
  /** tableswitch 可变长度 */
  TABLESWITCH,
  /** lookupswitch 可变长度 */
  LOOKUPSWITCH,
  /** wide 指令 */
  WIDE,
}

// ============================================
// 指令描述符
// ============================================

export interface OpcodeDescriptor {
  /** 操作码 */
  opcode: Opcode;
  /** 助记符 */
  mnemonic: string;
  /** 指令格式 */
  format: OpcodeFormat;
  /** 指令标志 */
  flags: OpcodeFlags;
  /** 栈效果 (正数=压栈,负数=弹栈) */
  stackEffect: number;
}

// ============================================
// 指令描述符表 (部分示例)
// ============================================

export const OPCODE_DESCRIPTORS: Map<Opcode, OpcodeDescriptor> = new Map([
  // NOP
  [
    Opcode.NOP,
    {
      opcode: Opcode.NOP,
      mnemonic: "nop",
      format: OpcodeFormat.NONE,
      flags: OpcodeFlags.FALL_THROUGH,
      stackEffect: 0,
    },
  ],

  // 常量加载
  [
    Opcode.ICONST_0,
    {
      opcode: Opcode.ICONST_0,
      mnemonic: "iconst_0",
      format: OpcodeFormat.NONE,
      flags: OpcodeFlags.FALL_THROUGH,
      stackEffect: 1,
    },
  ],

  // 算术指令 - LADD (关键:使用 BigInt)
  [
    Opcode.LADD,
    {
      opcode: Opcode.LADD,
      mnemonic: "ladd",
      format: OpcodeFormat.NONE,
      flags:
        OpcodeFlags.FALL_THROUGH |
        OpcodeFlags.COMMUTATIVE |
        OpcodeFlags.ASSOCIATIVE,
      stackEffect: -2, // 弹出 2 个 long,压入 1 个 long
    },
  ],

  // 方法调用
  [
    Opcode.INVOKEVIRTUAL,
    {
      opcode: Opcode.INVOKEVIRTUAL,
      mnemonic: "invokevirtual",
      format: OpcodeFormat.CONST2,
      flags: OpcodeFlags.INVOKE | OpcodeFlags.TRAP,
      stackEffect: -1, // 取决于方法签名,这里是占位符
    },
  ],

  // 对象创建
  [
    Opcode.NEW,
    {
      opcode: Opcode.NEW,
      mnemonic: "new",
      format: OpcodeFormat.CONST2,
      flags: OpcodeFlags.FALL_THROUGH | OpcodeFlags.TRAP,
      stackEffect: 1,
    },
  ],

  // 返回指令
  [
    Opcode.RETURN,
    {
      opcode: Opcode.RETURN,
      mnemonic: "return",
      format: OpcodeFormat.NONE,
      flags: OpcodeFlags.STOP,
      stackEffect: 0,
    },
  ],
]);

/**
 * 获取指令的助记符
 */
export function getOpcodeMnemonic(opcode: Opcode): string {
  const descriptor = OPCODE_DESCRIPTORS.get(opcode);
  return descriptor?.mnemonic ?? `unknown_${opcode.toString(16)}`;
}

/**
 * 获取指令的长度 (字节数)
 */
export function getOpcodeLength(opcode: Opcode): number {
  const descriptor = OPCODE_DESCRIPTORS.get(opcode);
  if (!descriptor) return 1;

  switch (descriptor.format) {
    case OpcodeFormat.NONE:
      return 1;
    case OpcodeFormat.U1:
    case OpcodeFormat.I1:
    case OpcodeFormat.LOCAL:
    case OpcodeFormat.CONST1:
      return 2;
    case OpcodeFormat.U2:
    case OpcodeFormat.I2:
    case OpcodeFormat.CONST2:
      return 3;
    case OpcodeFormat.TABLESWITCH:
    case OpcodeFormat.LOOKUPSWITCH:
    case OpcodeFormat.WIDE:
      return -1; // 可变长度
    default:
      return 1;
  }
}
