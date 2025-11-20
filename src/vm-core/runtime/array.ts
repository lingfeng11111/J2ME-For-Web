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
 * J2ME-For-Web Java Array
 * Java 数组的运行时表示
 */

import { JavaValue, TypedArray } from "../core/types";
import { JavaObject } from "./object";

/**
 * Java 数组
 * 根据元素类型选择最优的存储方式
 */
export class JavaArray {
  /** 数组元素类型描述符 */
  readonly componentType: string;

  /** 数组长度 */
  readonly length: number;

  /** 数组数据 (基本类型使用 TypedArray,引用类型使用普通数组) */
  private data: any[] | TypedArray;

  /** 数组 ID (调试用) */
  readonly id: number;

  /** 静态 ID 计数器 */
  private static nextId = 0;

  constructor(componentType: string, length: number) {
    this.componentType = componentType;
    this.length = length;
    this.id = JavaArray.nextId++;

    // 根据元素类型创建合适的存储
    this.data = this.createStorage(componentType, length);
  }

  // ============================================
  // 存储创建
  // ============================================

  /**
   * 根据元素类型创建存储
   */
  private createStorage(componentType: string, length: number): any[] | TypedArray {
    switch (componentType) {
      case "Z": // boolean (使用 Uint8Array)
      case "B": // byte
        return new Int8Array(length);

      case "C": // char (无符号 16 位)
        return new Uint16Array(length);

      case "S": // short
        return new Int16Array(length);

      case "I": // int
        return new Int32Array(length);

      case "J": // long (注意: 不能使用 BigInt64Array,Node.js 12 不支持)
        // 使用普通数组存储 bigint
        return new Array(length).fill(0n);

      case "F": // float
        return new Float32Array(length);

      case "D": // double
        return new Float64Array(length);

      default:
        // 引用类型 (对象/数组)
        return new Array(length).fill(null);
    }
  }

  // ============================================
  // 数组访问
  // ============================================

  /**
   * 获取数组元素
   */
  get(index: number): JavaValue {
    if (index < 0 || index >= this.length) {
      throw new Error(`ArrayIndexOutOfBoundsException: ${index}`);
    }
    return this.data[index];
  }

  /**
   * 设置数组元素
   */
  set(index: number, value: JavaValue): void {
    if (index < 0 || index >= this.length) {
      throw new Error(`ArrayIndexOutOfBoundsException: ${index}`);
    }
    this.data[index] = value;
  }

  // ============================================
  // 类型判断
  // ============================================

  /**
   * 是否为基本类型数组
   */
  isPrimitiveArray(): boolean {
    return "BCDFIJSZ".includes(this.componentType);
  }

  /**
   * 是否为对象数组
   */
  isObjectArray(): boolean {
    return this.componentType.startsWith("L");
  }

  /**
   * 是否为多维数组
   */
  isMultiDimensionalArray(): boolean {
    return this.componentType.startsWith("[");
  }

  /**
   * 获取数组的类名
   */
  getClassName(): string {
    return `[${this.componentType}`;
  }

  // ============================================
  // 批量操作
  // ============================================

  /**
   * 复制数组内容到另一个数组
   */
  copyTo(dest: JavaArray, srcPos: number, destPos: number, length: number): void {
    if (srcPos < 0 || destPos < 0 || length < 0) {
      throw new Error("Invalid array copy parameters");
    }

    if (srcPos + length > this.length || destPos + length > dest.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }

    // 使用原生数组复制 (高性能)
    if (this.data instanceof Array && dest.data instanceof Array) {
      for (let i = 0; i < length; i++) {
        dest.data[destPos + i] = this.data[srcPos + i];
      }
    } else if (
      ArrayBuffer.isView(this.data) &&
      ArrayBuffer.isView(dest.data) &&
      this.data.constructor === dest.data.constructor
    ) {
      // TypedArray 之间的复制
      (dest.data as any).set(
        (this.data as any).subarray(srcPos, srcPos + length),
        destPos
      );
    } else {
      // 类型不匹配,逐个复制
      for (let i = 0; i < length; i++) {
        dest.set(destPos + i, this.get(srcPos + i));
      }
    }
  }

  /**
   * 填充数组
   */
  fill(value: JavaValue, start: number = 0, end: number = this.length): void {
    if (this.data instanceof Array) {
      this.data.fill(value, start, end);
    } else {
      (this.data as TypedArray).fill(value as number, start, end);
    }
  }

  // ============================================
  // 调试信息
  // ============================================

  /**
   * 转换为字符串 (调试用)
   */
  toString(): string {
    return `${this.getClassName()}@${this.id}[${this.length}]`;
  }

  /**
   * 打印数组内容 (仅前几个元素)
   */
  printElements(maxElements: number = 10): string {
    const elements: string[] = [];
    const count = Math.min(this.length, maxElements);

    for (let i = 0; i < count; i++) {
      const value = this.get(i);
      if (value === null) {
        elements.push("null");
      } else if (typeof value === "bigint") {
        elements.push(`${value}n`);
      } else if (typeof value === "object") {
        elements.push((value as any).toString?.() || "[object]");
      } else {
        elements.push(String(value));
      }
    }

    const suffix = this.length > maxElements ? ", ..." : "";
    return `${this.toString()} = [${elements.join(", ")}${suffix}]`;
  }
}
