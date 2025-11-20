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

import { NativeRegistry } from "../../../vm-core/native/native-registry";
import { JavaObject } from "../../../vm-core/runtime/object";
import { Scheduler } from "../../../vm-core/threading/scheduler";
import { ExecutionStatus } from "../../../vm-core/core/constants";

export function registerObjectNatives(): void {
  const className = "java/lang/Object";

  // public native int hashCode();
  NativeRegistry.register(className, "hashCode", "()I", (frame, thread) => {
    const thisObj = frame.locals[0] as JavaObject; // this 在局部变量表 0
    // 简单的 hashCode 实现
    // 实际应该存储在对象头或 WeakMap 中
    frame.stack.push(12345);
  });

  // public final native Class getClass();
  NativeRegistry.register(className, "getClass", "()Ljava/lang/Class;", (frame, thread) => {
    const thisObj = frame.locals[0] as JavaObject;
    // TODO: 返回 Class 对象 (需要实现 java.lang.Class)
    // 目前暂时返回 null 或抛出异常
    // frame.stack.push(thisObj.classInfo.getClassObject());
    frame.stack.push(null);
  });

  // protected native Object clone() throws CloneNotSupportedException;
  NativeRegistry.register(className, "clone", "()Ljava/lang/Object;", (frame, thread) => {
    const thisObj = frame.locals[0] as JavaObject;
    // TODO: 检查是否实现了 Cloneable
    // TODO: 实现浅拷贝
    frame.stack.push(null);
  });
  
  // public final native void notify();
  NativeRegistry.register(className, "notify", "()V", (frame, thread) => {
    // 唤醒一个等待在当前对象上的线程
    Scheduler.getInstance().notify(thread.id);
  });

  // public final native void notifyAll();
  NativeRegistry.register(className, "notifyAll", "()V", (frame, thread) => {
    // 唤醒所有等待在当前对象上的线程
    Scheduler.getInstance().notifyAll();
  });
  
  // public final native void wait(long timeout) throws InterruptedException;
  NativeRegistry.register(className, "wait", "(J)V", (frame, thread) => {
    const timeout = frame.stack.popLong();
    
    // 标记线程正在等待 notify
    thread.waitingForNotify = true;
    
    // 返回执行状态，让解释器 yield
    if (timeout === 0n) {
      // 无限等待
      return ExecutionStatus.WAITING;
    } else {
      // 定时等待
      return ExecutionStatus.TIMED_WAITING;
    }
  });
}
