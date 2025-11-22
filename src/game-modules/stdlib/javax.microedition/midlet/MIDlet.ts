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

import { NativeRegistry } from "../../../../vm-core/native/native-registry";
import { JavaObject } from "../../../../vm-core/runtime/object";
import { Context } from "../../../context/Context";

/**
 * 注册 javax.microedition.midlet.MIDlet 的 Native 方法
 */
export function registerMIDletNatives(): void {
  const className = "javax/microedition/midlet/MIDlet";

  // public final void notifyDestroyed();
  NativeRegistry.register(className, "notifyDestroyed", "()V", (frame, thread) => {
    console.log("MIDlet: notifyDestroyed() called");
    // TODO: 通知 AMS 停止应用，停止 VM 循环
  });

  // public final void notifyPaused();
  NativeRegistry.register(className, "notifyPaused", "()V", (frame, thread) => {
    console.log("MIDlet: notifyPaused() called");
  });

  // public final void resumeRequest();
  NativeRegistry.register(className, "resumeRequest", "()V", (frame, thread) => {
    console.log("MIDlet: resumeRequest() called");
  });

  // public final String getAppProperty(String key);
  NativeRegistry.register(className, "getAppProperty", "(Ljava/lang/String;)Ljava/lang/String;", (frame, thread) => {
    const keyObj = frame.getLocal(1);
    // TODO: 获取 key 字符串
    // const key = StringUtils.getString(keyObj);
    
    // 暂时返回 null
    frame.stack.push(null);
  });
}
