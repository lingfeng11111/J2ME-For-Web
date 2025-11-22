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

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";
import { ClassLoader } from "../../classfile/class-loader";
import { JavaObject } from "../../runtime/object";

export class ConstantInstructions {
  @Instruction(Opcode.NOP)
  static nop(frame: Frame, thread: Thread): void {
    frame.pc++;
  }

  @Instruction(Opcode.NEW)
  static new(frame: Frame, thread: Thread): void {
    const code = frame.method.getCode()!;
    const index = (code.code[frame.pc + 1] << 8) | code.code[frame.pc + 2];
    
    // 从常量池解析类引用
    const className = frame.method.classInfo.constantPool.getClassName(index);
    
    // 从 thread 获取 classLoader
    const classLoader = (thread as any).classLoader;
    if (!classLoader) {
      throw new Error("ClassLoader not available in thread");
    }
    
    // 加载类
    const classInfo = classLoader.loadClass(className);
    
    // 创建对象实例
    const object = new JavaObject(classInfo);
    
    // 将对象引用压入栈
    frame.stack.push(object);
    
    // 更新 PC
    frame.pc += 3;
  }

  @Instruction(Opcode.ICONST_M1)
  static iconst_m1(frame: Frame, thread: Thread): void {
    frame.stack.push(-1);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_0)
  static iconst_0(frame: Frame, thread: Thread): void {
    frame.stack.push(0);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_1)
  static iconst_1(frame: Frame, thread: Thread): void {
    frame.stack.push(1);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_2)
  static iconst_2(frame: Frame, thread: Thread): void {
    frame.stack.push(2);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_3)
  static iconst_3(frame: Frame, thread: Thread): void {
    frame.stack.push(3);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_4)
  static iconst_4(frame: Frame, thread: Thread): void {
    frame.stack.push(4);
    frame.pc++;
  }

  @Instruction(Opcode.ICONST_5)
  static iconst_5(frame: Frame, thread: Thread): void {
    frame.stack.push(5);
    frame.pc++;
  }

  @Instruction(Opcode.BIPUSH)
  static bipush(frame: Frame, thread: Thread): void {
    const byte = frame.method.getCode()!.code[frame.pc + 1];
    // 符号扩展
    const value = (byte << 24) >> 24;
    frame.stack.push(value);
    frame.pc += 2;
  }
}
