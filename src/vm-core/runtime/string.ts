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
 * J2ME-For-Web Java String
 * Java 字符串的运行时表示
 */

import { JavaObject } from "./object";
import { JavaArray } from "./array";

/**
 * Java 字符串
 * 在 Java 中,String 是不可变对象,内部使用 char[] 存储
 */
export class JavaString extends JavaObject {
  /** JavaScript 字符串值 (缓存) */
  private jsString: string;

  /** 字符数组 (Java String 的内部表示) */
  private charArray: JavaArray;

  constructor(classInfo: any, value: string) {
    super(classInfo);
    this.jsString = value;

    // 创建 char 数组
    this.charArray = new JavaArray("C", value.length);
    for (let i = 0; i < value.length; i++) {
      this.charArray.set(i, value.charCodeAt(i));
    }

    // 设置 String 对象的 value 字段 (char[])
    // 注意: 实际的 java.lang.String 有 value, offset, count 字段
    // 这里简化处理
  }

  // ============================================
  // 字符串访问
  // ============================================

  /**
   * 获取 JavaScript 字符串值
   */
  getValue(): string {
    return this.jsString;
  }

  /**
   * 获取字符数组
   */
  getCharArray(): JavaArray {
    return this.charArray;
  }

  /**
   * 获取字符串长度
   */
  length(): number {
    return this.jsString.length;
  }

  /**
   * 获取指定位置的字符
   */
  charAt(index: number): number {
    if (index < 0 || index >= this.jsString.length) {
      throw new Error(`StringIndexOutOfBoundsException: ${index}`);
    }
    return this.jsString.charCodeAt(index);
  }

  // ============================================
  // 字符串操作
  // ============================================

  /**
   * 连接字符串
   */
  concat(other: JavaString): JavaString {
    const newValue = this.jsString + other.jsString;
    return new JavaString(this.classInfo, newValue);
  }

  /**
   * 子字符串
   */
  substring(beginIndex: number, endIndex?: number): JavaString {
    const newValue = this.jsString.substring(beginIndex, endIndex);
    return new JavaString(this.classInfo, newValue);
  }

  /**
   * 转换为小写
   */
  toLowerCase(): JavaString {
    const newValue = this.jsString.toLowerCase();
    return new JavaString(this.classInfo, newValue);
  }

  /**
   * 转换为大写
   */
  toUpperCase(): JavaString {
    const newValue = this.jsString.toUpperCase();
    return new JavaString(this.classInfo, newValue);
  }

  /**
   * 去除首尾空格
   */
  trim(): JavaString {
    const newValue = this.jsString.trim();
    return new JavaString(this.classInfo, newValue);
  }

  // ============================================
  // 字符串比较
  // ============================================

  /**
   * 比较字符串 (equals)
   */
  equals(other: JavaString): boolean {
    return this.jsString === other.jsString;
  }

  /**
   * 比较字符串 (compareTo)
   */
  compareTo(other: JavaString): number {
    if (this.jsString < other.jsString) return -1;
    if (this.jsString > other.jsString) return 1;
    return 0;
  }

  /**
   * 检查是否以指定前缀开始
   */
  startsWith(prefix: string): boolean {
    return this.jsString.startsWith(prefix);
  }

  /**
   * 检查是否以指定后缀结束
   */
  endsWith(suffix: string): boolean {
    return this.jsString.endsWith(suffix);
  }

  /**
   * 查找子字符串
   */
  indexOf(str: string, fromIndex: number = 0): number {
    return this.jsString.indexOf(str, fromIndex);
  }

  // ============================================
  // 调试信息
  // ============================================

  /**
   * 转换为字符串 (返回 Java 字符串的值)
   */
  toString(): string {
    return this.jsString;
  }
}

/**
 * 字符串池 (String Interning)
 * Java 中的字符串常量会被放入字符串池,相同内容的字符串共享同一个对象
 */
export class StringPool {
  private pool: Map<string, JavaString> = new Map();

  /**
   * 获取或创建字符串
   */
  intern(classInfo: any, value: string): JavaString {
    let javaString = this.pool.get(value);
    if (!javaString) {
      javaString = new JavaString(classInfo, value);
      this.pool.set(value, javaString);
    }
    return javaString;
  }

  /**
   * 清空字符串池
   */
  clear(): void {
    this.pool.clear();
  }

  /**
   * 获取字符串池大小
   */
  size(): number {
    return this.pool.size;
  }
}
