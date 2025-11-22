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
 * J2ME-For-Web Synchronization Instructions
 * 同步指令
 * MONITORENTER, MONITOREXIT
 */

import { Opcode } from "../../bytecode/opcodes";
import { Instruction } from "../instruction";
import { Frame } from "../frame";
import { Thread } from "../../threading/thread";
import { JavaObject } from "../../runtime/object";

/**
 * 对象监视器（锁）管理
 * JavaScript 是单线程的，所以这里主要用于调试和保持语义正确性
 */
class MonitorManager {
  private static monitors = new WeakMap<JavaObject, number>();

  /**
   * 进入监视器（获取锁）
   */
  static enter(obj: JavaObject): void {
    const count = MonitorManager.monitors.get(obj) || 0;
    MonitorManager.monitors.set(obj, count + 1);
  }

  /**
   * 退出监视器（释放锁）
   */
  static exit(obj: JavaObject): void {
    const count = MonitorManager.monitors.get(obj) || 0;
    if (count <= 0) {
      throw new Error("IllegalMonitorStateException: monitor not owned");
    }
    MonitorManager.monitors.set(obj, count - 1);
  }

  /**
   * 获取监视器计数（调试用）
   */
  static getCount(obj: JavaObject): number {
    return MonitorManager.monitors.get(obj) || 0;
  }
}

export class SynchronizationInstructions {
  /**
   * 进入同步块（获取对象锁）
   */
  @Instruction(Opcode.MONITORENTER)
  static monitorenter(frame: Frame, thread: Thread): void {
    const objectref = frame.stack.pop();
    
    if (objectref === null) {
      throw new Error("NullPointerException: Cannot enter monitor on null object");
    }
    
    if (!(objectref instanceof JavaObject)) {
      throw new Error("IllegalMonitorStateException: Not a valid object for synchronization");
    }
    
    // 进入监视器
    MonitorManager.enter(objectref);
    
    frame.pc++;
  }

  /**
   * 退出同步块（释放对象锁）
   */
  @Instruction(Opcode.MONITOREXIT)
  static monitorexit(frame: Frame, thread: Thread): void {
    const objectref = frame.stack.pop();
    
    if (objectref === null) {
      throw new Error("NullPointerException: Cannot exit monitor on null object");
    }
    
    if (!(objectref instanceof JavaObject)) {
      throw new Error("IllegalMonitorStateException: Not a valid object for synchronization");
    }
    
    // 退出监视器
    MonitorManager.exit(objectref);
    
    frame.pc++;
  }
}

// 导出 MonitorManager 供测试使用
export { MonitorManager };
