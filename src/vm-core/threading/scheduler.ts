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
 * J2ME-For-Web Scheduler
 * 线程调度器
 * 实现协作式线程调度，处理 Generator yield 返回的执行状态
 */

import { Thread, ThreadStatus } from "./thread";
import { Interpreter } from "../interpreter/interpreter";
import { ExecutionStatus } from "../core/constants";

/**
 * 线程调度器
 * 管理所有线程的执行，实现协作式调度
 */
export class Scheduler {
  /** 可运行线程队列 */
  private runnableThreads: Thread[] = [];

  /** 等待线程映射 (线程ID -> 线程) */
  private waitingThreads = new Map<number, Thread>();

  /** 阻塞线程映射 (线程ID -> 线程) */
  private blockedThreads = new Map<number, Thread>();

  /** 线程的 Generator 映射 (线程ID -> Generator) */
  private threadGenerators = new Map<number, Generator<ExecutionStatus, void, void>>();

  /** 单例实例 */
  private static instance: Scheduler;

  private constructor() {}

  /**
   * 获取调度器单例
   */
  static getInstance(): Scheduler {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler();
    }
    return Scheduler.instance;
  }

  /**
   * 添加线程到可运行队列
   */
  addThread(thread: Thread): void {
    if (thread.status === ThreadStatus.RUNNABLE) {
      this.runnableThreads.push(thread);
      // 创建并保存 Generator
      const generator = Interpreter.execute(thread);
      this.threadGenerators.set(thread.id, generator);
    }
  }

  /**
   * 调度执行
   * 执行一个时间片，处理所有可运行线程
   */
  async run(timeSlice: number = 100): Promise<void> {
    const startTime = Date.now();

    while (this.runnableThreads.length > 0 && Date.now() - startTime < timeSlice) {
      const thread = this.runnableThreads.shift()!;
      
      if (thread.status !== ThreadStatus.RUNNABLE) {
        continue;
      }

      const generator = this.threadGenerators.get(thread.id);
      if (!generator) {
        console.error(`No generator found for thread ${thread.id}`);
        continue;
      }

      try {
        // 执行一条指令（Generator 会 yield ExecutionStatus.RUNNING）
        const result = generator.next();

        if (result.done) {
          // Generator 执行完成
          thread.status = ThreadStatus.TERMINATED;
          this.threadGenerators.delete(thread.id);
          continue;
        }

        // 处理 yield 返回的状态
        const status = result.value;

        switch (status) {
          case ExecutionStatus.RUNNING:
            // 继续运行，重新加入队列
            this.runnableThreads.push(thread);
            break;

          case ExecutionStatus.PAUSED:
            // 暂停（时间片耗尽或等待I/O）
            thread.status = ThreadStatus.TIMED_WAITING;
            // 稍后重新加入可运行队列
            setTimeout(() => {
              thread.status = ThreadStatus.RUNNABLE;
              this.runnableThreads.push(thread);
            }, 0);
            break;

          case ExecutionStatus.BLOCKED:
            // 阻塞（等待锁）
            thread.status = ThreadStatus.BLOCKED;
            this.blockedThreads.set(thread.id, thread);
            break;

          case ExecutionStatus.WAITING:
          case ExecutionStatus.TIMED_WAITING:
            // 等待 notify
            thread.status = status === ExecutionStatus.WAITING 
              ? ThreadStatus.WAITING 
              : ThreadStatus.TIMED_WAITING;
            this.waitingThreads.set(thread.id, thread);
            break;

          case ExecutionStatus.TERMINATED:
            // 执行结束
            thread.status = ThreadStatus.TERMINATED;
            this.threadGenerators.delete(thread.id);
            break;
        }
      } catch (e) {
        console.error(`Error in thread ${thread.id}:`, e);
        thread.status = ThreadStatus.TERMINATED;
        this.threadGenerators.delete(thread.id);
      }
    }
  }

  /**
   * 唤醒等待的线程（notify）
   */
  notify(threadId: number): void {
    const thread = this.waitingThreads.get(threadId);
    if (thread) {
      this.waitingThreads.delete(threadId);
      thread.status = ThreadStatus.RUNNABLE;
      this.runnableThreads.push(thread);
    }
  }

  /**
   * 唤醒所有等待的线程（notifyAll）
   */
  notifyAll(): void {
    for (const [threadId, thread] of this.waitingThreads) {
      thread.status = ThreadStatus.RUNNABLE;
      this.runnableThreads.push(thread);
    }
    this.waitingThreads.clear();
  }

  /**
   * 解除线程阻塞（锁释放）
   */
  unblock(threadId: number): void {
    const thread = this.blockedThreads.get(threadId);
    if (thread) {
      this.blockedThreads.delete(threadId);
      thread.status = ThreadStatus.RUNNABLE;
      this.runnableThreads.push(thread);
    }
  }

  /**
   * 获取当前可运行线程数
   */
  getRunnableThreadCount(): number {
    return this.runnableThreads.length;
  }

  /**
   * 获取等待线程数
   */
  getWaitingThreadCount(): number {
    return this.waitingThreads.size;
  }

  /**
   * 获取阻塞线程数
   */
  getBlockedThreadCount(): number {
    return this.blockedThreads.size;
  }

  /**
   * 是否还有活跃线程
   */
  hasAliveThreads(): boolean {
    return this.runnableThreads.length > 0 || 
           this.waitingThreads.size > 0 || 
           this.blockedThreads.size > 0;
  }

  /**
   * 清空所有线程（用于重置）
   */
  clear(): void {
    this.runnableThreads = [];
    this.waitingThreads.clear();
    this.blockedThreads.clear();
    this.threadGenerators.clear();
  }
}