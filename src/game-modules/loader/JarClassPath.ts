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

import { ClassPath } from "../../vm-core/classfile/class-loader";
import { JarLoader } from "./JarLoader";

/**
 * 基于 JarLoader 的类路径实现
 * 允许 ClassLoader 从 JAR 文件中读取 .class 文件
 */
export class JarClassPath implements ClassPath {
  private loader: JarLoader;

  constructor(loader: JarLoader) {
    this.loader = loader;
  }

  /**
   * 读取 Class 文件字节
   * @param className 类的内部名称 (如 java/lang/String)
   */
  readClass(className: string): Uint8Array | null {
    // 类名格式: java/lang/String
    // JarLoader 需要: java/lang/String.class
    
    // 确保没有 .class 后缀 (虽然传入的 className 通常没有)
    let path = className;
    if (path.endsWith('.class')) {
        path = path.substring(0, path.length - 6);
    }
    
    path = path + '.class';
    
    // JarLoader.getFile 会自动处理路径规范化
    return this.loader.getFile(path);
  }
}
