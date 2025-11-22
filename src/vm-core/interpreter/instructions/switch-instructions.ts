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
 * J2ME-For-Web Switch Instructions
 * Switch 跳转指令
 * TABLESWITCH, LOOKUPSWITCH
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";

export class SwitchInstructions {
  /**
   * 表格跳转（用于连续的 case 值）
   * tableswitch 指令
   */
  @Instruction(Opcode.TABLESWITCH)
  static tableswitch(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!.code;
    const startPc = frame.pc;
    
    // 计算对齐后的位置（4 字节对齐）
    let pos = startPc + 1;
    const padding = (4 - (pos % 4)) % 4;
    pos += padding;
    
    // 读取 default offset (4 bytes)
    const defaultOffset = SwitchInstructions.readInt32(code, pos);
    pos += 4;
    
    // 读取 low (4 bytes)
    const low = SwitchInstructions.readInt32(code, pos);
    pos += 4;
    
    // 读取 high (4 bytes)
    const high = SwitchInstructions.readInt32(code, pos);
    pos += 4;
    
    // 从栈中弹出索引值
    const index = frame.stack.popInt();
    
    // 计算跳转偏移
    let offset: number;
    if (index < low || index > high) {
      // 超出范围，使用 default
      offset = defaultOffset;
    } else {
      // 在范围内，读取对应的偏移
      const jumpTableIndex = index - low;
      const jumpOffset = SwitchInstructions.readInt32(code, pos + jumpTableIndex * 4);
      offset = jumpOffset;
    }
    
    // 跳转
    frame.pc = startPc + offset;
  }

  /**
   * 查找跳转（用于稀疏的 case 值）
   * lookupswitch 指令
   */
  @Instruction(Opcode.LOOKUPSWITCH)
  static lookupswitch(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!.code;
    const startPc = frame.pc;
    
    // 计算对齐后的位置（4 字节对齐）
    let pos = startPc + 1;
    const padding = (4 - (pos % 4)) % 4;
    pos += padding;
    
    // 读取 default offset (4 bytes)
    const defaultOffset = SwitchInstructions.readInt32(code, pos);
    pos += 4;
    
    // 读取 npairs (4 bytes)
    const npairs = SwitchInstructions.readInt32(code, pos);
    pos += 4;
    
    // 从栈中弹出键值
    const key = frame.stack.popInt();
    
    // 在 match-offset 对中查找
    let offset = defaultOffset;
    for (let i = 0; i < npairs; i++) {
      const match = SwitchInstructions.readInt32(code, pos);
      pos += 4;
      const jumpOffset = SwitchInstructions.readInt32(code, pos);
      pos += 4;
      
      if (key === match) {
        offset = jumpOffset;
        break;
      }
    }
    
    // 跳转
    frame.pc = startPc + offset;
  }

  /**
   * 辅助方法：从字节数组读取 32 位有符号整数（大端序）
   */
  private static readInt32(bytes: Uint8Array, offset: number): number {
    const b1 = bytes[offset];
    const b2 = bytes[offset + 1];
    const b3 = bytes[offset + 2];
    const b4 = bytes[offset + 3];
    
    // 组合为 32 位整数
    const value = (b1 << 24) | (b2 << 16) | (b3 << 8) | b4;
    
    // 转换为有符号整数
    return value | 0;
  }
}
