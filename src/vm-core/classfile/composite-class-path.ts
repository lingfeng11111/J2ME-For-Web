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
 * J2ME-For-Web Composite Class Path
 * 组合类路径，支持多个 ClassPath 的组合查找
 */

import { ClassPath } from "./class-loader";

/**
 * 组合类路径
 * 按顺序在多个 ClassPath 中查找类文件
 */
export class CompositeClassPath implements ClassPath {
  /** 类路径列表，按查找顺序排列 */
  private classPaths: ClassPath[] = [];

  /**
   * 创建组合类路径
   * @param classPaths 初始的类路径列表（按查找优先级排序）
   */
  constructor(...classPaths: ClassPath[]) {
    this.classPaths = [...classPaths];
  }

  /**
   * 添加类路径到列表末尾
   * @param classPath 要添加的类路径
   */
  addClassPath(classPath: ClassPath): void {
    this.classPaths.push(classPath);
  }

  /**
   * 在指定位置插入类路径
   * @param index 插入位置
   * @param classPath 要插入的类路径
   */
  insertClassPath(index: number, classPath: ClassPath): void {
    if (index < 0 || index > this.classPaths.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    this.classPaths.splice(index, 0, classPath);
  }

  /**
   * 移除类路径
   * @param classPath 要移除的类路径
   * @returns 是否成功移除
   */
  removeClassPath(classPath: ClassPath): boolean {
    const index = this.classPaths.indexOf(classPath);
    if (index >= 0) {
      this.classPaths.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 获取类路径数量
   */
  getClassPathCount(): number {
    return this.classPaths.length;
  }

  /**
   * 读取类文件字节
   * 按顺序在多个 ClassPath 中查找，返回第一个找到的结果
   * @param className 类的内部名称（如 java/lang/String）
   * @returns Class 文件的字节数组，如果未找到则返回 null
   */
  readClass(className: string): Uint8Array | null {
    for (const classPath of this.classPaths) {
      const data = classPath.readClass(className);
      if (data !== null) {
        return data;
      }
    }
    return null;
  }

  /**
   * 清空所有类路径
   */
  clear(): void {
    this.classPaths = [];
  }
}