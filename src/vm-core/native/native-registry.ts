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
 * J2ME-For-Web Native Interface
 * 本地方法注册表
 */

import { Frame } from "../interpreter/frame";
import { Thread } from "../threading/thread";
import { ExecutionStatus } from "../core/constants";

/**
 * 本地方法处理函数
 * 返回 ExecutionStatus 表示需要 yield 的状态，返回 void 表示正常执行
 */
export type NativeMethodHandler = (frame: Frame, thread: Thread) => ExecutionStatus | void;

/**
 * 本地方法注册表
 * 管理所有 Native 方法的实现
 */
export class NativeRegistry {
  /**
   * 注册表
   * Key: "className.methodNamedescriptor" (例如 "java/lang/System.arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V")
   */
  private static registry: Map<string, NativeMethodHandler> = new Map();

  /**
   * 注册本地方法
   * @param className 类名
   * @param methodName 方法名
   * @param descriptor 方法描述符
   * @param handler 处理函数
   */
  static register(
    className: string,
    methodName: string,
    descriptor: string,
    handler: NativeMethodHandler
  ): void {
    const key = this.getKey(className, methodName, descriptor);
    this.registry.set(key, handler);
  }

  /**
   * 查找本地方法
   */
  static get(
    className: string,
    methodName: string,
    descriptor: string
  ): NativeMethodHandler | undefined {
    const key = this.getKey(className, methodName, descriptor);
    return this.registry.get(key);
  }

  private static getKey(className: string, methodName: string, descriptor: string): string {
    return `${className}.${methodName}${descriptor}`;
  }
}
