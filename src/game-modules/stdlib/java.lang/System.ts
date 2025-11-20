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
import { Frame } from "../../../vm-core/interpreter/frame";
import { Thread } from "../../../vm-core/threading/thread";
import { JavaArray } from "../../../vm-core/runtime/array";

export function registerSystemNatives(): void {
  const className = "java/lang/System";

  // public static native long currentTimeMillis();
  NativeRegistry.register(className, "currentTimeMillis", "()J", (frame, thread) => {
    const now = BigInt(Date.now());
    frame.stack.push(now);
  });

  // public static native void arraycopy(Object src, int srcPos, Object dest, int destPos, int length);
  NativeRegistry.register(className, "arraycopy", "(Ljava/lang/Object;ILjava/lang/Object;II)V", (frame, thread) => {
    const length = frame.stack.popInt();
    const destPos = frame.stack.popInt();
    const dest = frame.stack.popRef() as JavaArray;
    const srcPos = frame.stack.popInt();
    const src = frame.stack.popRef() as JavaArray;

    // 空指针检查
    if (!src || !dest) {
      throw new Error("NullPointerException");
    }

    // 类型检查 (简化版,应该检查是否为数组)
    if (!(src instanceof JavaArray) || !(dest instanceof JavaArray)) {
      throw new Error("ArrayStoreException: src or dest is not an array");
    }

    // 边界检查
    if (
      srcPos < 0 ||
      destPos < 0 ||
      length < 0 ||
      srcPos + length > src.length ||
      destPos + length > dest.length
    ) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }

    // 执行复制
    // JavaArray 已经实现了高效的 copyTo
    src.copyTo(dest, srcPos, destPos, length);
  });

  // public static native int identityHashCode(Object x);
  NativeRegistry.register(className, "identityHashCode", "(Ljava/lang/Object;)I", (frame, thread) => {
    const obj = frame.stack.popRef();
    if (!obj) {
      frame.stack.push(0);
    } else {
      // TODO: 实现真正的 identityHashCode
      // 目前暂时返回一个随机数或对象的 ID
      frame.stack.push(12345); 
    }
  });
}
