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

import { registerSystemNatives, registerObjectNatives } from "./java.lang";
import { registerClassNatives } from "./java.lang/Class";
import { registerMIDletNatives } from "./javax.microedition/midlet/MIDlet";

/**
 * 初始化 Java 标准库
 * 注册所有核心类的 Native 方法
 */
export function initStdlib(): void {
  registerObjectNatives();
  registerClassNatives();
  registerSystemNatives();
  registerMIDletNatives();
  // 后续添加: String, Thread 等
}
