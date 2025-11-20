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
 * J2ME-For-Web Instruction Interface
 * 指令接口定义
 */

import { Frame } from "./frame";
import { Thread } from "../threading/thread";

/**
 * 指令处理函数类型
 * @param frame 当前栈帧
 * @param thread 当前线程
 * @returns void
 */
export type InstructionHandler = (frame: Frame, thread: Thread) => void;

/**
 * 指令注册表
 * 存储所有 256 个操作码的处理函数
 */
export class InstructionRegistry {
  private static handlers: InstructionHandler[] = new Array(256).fill(null);

  /**
   * 注册指令处理函数
   */
  static register(opcode: number, handler: InstructionHandler): void {
    this.handlers[opcode] = handler;
  }

  /**
   * 获取指令处理函数
   */
  static get(opcode: number): InstructionHandler {
    return this.handlers[opcode];
  }
}

/**
 * 装饰器: 注册指令
 * @param opcode 操作码
 */
export function Instruction(opcode: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    InstructionRegistry.register(opcode, descriptor.value);
  };
}
