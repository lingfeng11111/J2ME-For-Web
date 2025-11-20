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
 * J2ME-For-Web Thread
 * 虚拟机线程
 */

import { Frame } from "../interpreter/frame";
import { MethodInfo } from "../classfile/method-info";

/**
 * 虚拟机线程
 * 管理方法的调用栈 (Frames)
 */
export class Thread {
  /** 栈帧堆栈 */
  private frames: Frame[] = [];

  /** 线程 ID */
  readonly id: number;
  private static nextId = 0;

  /** 线程状态 */
  status: ThreadStatus = ThreadStatus.RUNNABLE;

  /** 是否等待 notify */
  waitingForNotify = false;

  constructor() {
    this.id = Thread.nextId++;
  }

  // ============================================
  // 栈帧管理
  // ============================================

  /**
   * 推入新栈帧 (方法调用)
   */
  pushFrame(frame: Frame): void {
    this.frames.push(frame);
  }

  /**
   * 弹出当前栈帧 (方法返回)
   */
  popFrame(): Frame {
    if (this.frames.length === 0) {
      throw new Error("StackUnderflowError: No frames to pop");
    }
    return this.frames.pop()!;
  }

  /**
   * 获取当前栈帧
   */
  currentFrame(): Frame {
    if (this.frames.length === 0) {
      throw new Error("No current frame");
    }
    return this.frames[this.frames.length - 1];
  }

  /**
   * 检查是否有栈帧
   */
  hasFrames(): boolean {
    return this.frames.length > 0;
  }

  /**
   * 获取栈深度
   */
  getStackDepth(): number {
    return this.frames.length;
  }

  // ============================================
  // 调试信息
  // ============================================

  toString(): string {
    return `Thread[${this.id}] ${this.status}`;
  }
}

/**
 * 线程状态枚举
 */
export enum ThreadStatus {
  NEW,
  RUNNABLE,
  BLOCKED,
  WAITING,
  TIMED_WAITING,
  TERMINATED,
}
