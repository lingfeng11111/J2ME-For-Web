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
 * J2ME-For-Web Java Object
 * Java 对象的运行时表示
 */

import { ClassInfo } from "../classfile/class-info";
import { FieldInfo } from "../classfile/field-info";
import { JavaValue } from "../core/types";

/**
 * Java 对象
 * 使用 TS 类实例表示 Java 对象,依赖 V8 GC 自动管理内存
 */
export class JavaObject {
  /** 对象的类信息 */
  readonly classInfo: ClassInfo;

  /** 实例字段值 (字段名 -> 值) */
  private fields: Map<string, JavaValue>;

  /** 对象 ID (调试用) */
  readonly id: number;

  /** 静态 ID 计数器 */
  private static nextId = 0;

  constructor(classInfo: ClassInfo) {
    this.classInfo = classInfo;
    this.fields = new Map();
    this.id = JavaObject.nextId++;

    // 初始化所有实例字段为默认值
    this.initializeFields();
  }

  // ============================================
  // 字段初始化
  // ============================================

  /**
   * 初始化所有实例字段为默认值
   */
  private initializeFields(): void {
    // 检查 classInfo 是否有 getInstanceFields 方法
    if (typeof this.classInfo.getInstanceFields !== "function") {
      // 模拟的 classInfo,跳过初始化
      return;
    }

    // 初始化父类字段
    if (this.classInfo.superClass) {
      // TODO: 需要递归初始化父类字段
    }

    // 初始化当前类的实例字段
    for (const field of this.classInfo.getInstanceFields()) {
      const defaultValue = this.getDefaultValue(field);
      this.setField(field.name, field.descriptor, defaultValue);
    }
  }

  /**
   * 获取字段的默认值
   */
  private getDefaultValue(field: FieldInfo): JavaValue {
    switch (field.descriptor) {
      case "Z": // boolean
      case "B": // byte
      case "C": // char
      case "S": // short
      case "I": // int
        return 0;
      case "J": // long
        return 0n;
      case "F": // float
      case "D": // double
        return 0.0;
      default:
        // 引用类型默认为 null
        return null;
    }
  }

  // ============================================
  // 字段访问
  // ============================================

  /**
   * 获取字段值
   */
  getField(name: string, descriptor: string): JavaValue {
    const key = this.makeFieldKey(name, descriptor);
    const value = this.fields.get(key);

    if (value === undefined) {
      throw new Error(
        `Field not found: ${this.classInfo.thisClass}.${name}:${descriptor}`
      );
    }

    return value;
  }

  /**
   * 设置字段值
   */
  setField(name: string, descriptor: string, value: JavaValue): void {
    const key = this.makeFieldKey(name, descriptor);
    this.fields.set(key, value);
  }

  /**
   * 生成字段的唯一键
   */
  private makeFieldKey(name: string, descriptor: string): string {
    return `${name}:${descriptor}`;
  }

  // ============================================
  // 类型检查
  // ============================================

  /**
   * 检查是否为指定类的实例
   */
  instanceof(className: string): boolean {
    // 检查当前类
    if (this.classInfo.thisClass === className) {
      return true;
    }

    // 检查父类
    // TODO: 需要递归检查父类链

    // 检查接口
    if (this.classInfo.interfaces.includes(className)) {
      return true;
    }

    return false;
  }

  /**
   * 获取对象的类名
   */
  getClassName(): string {
    return this.classInfo.thisClass;
  }

  // ============================================
  // 调试信息
  // ============================================

  /**
   * 转换为字符串 (调试用)
   */
  toString(): string {
    return `${this.classInfo.thisClass}@${this.id}`;
  }

  /**
   * 打印对象的所有字段
   */
  printFields(): string {
    const lines: string[] = [];
    lines.push(`Object: ${this.toString()}`);

    for (const [key, value] of this.fields.entries()) {
      let valueStr: string;
      if (value === null) {
        valueStr = "null";
      } else if (typeof value === "bigint") {
        valueStr = `${value}n`;
      } else if (typeof value === "object") {
        valueStr = (value as any).toString?.() || "[object]";
      } else {
        valueStr = String(value);
      }
      lines.push(`  ${key} = ${valueStr}`);
    }

    return lines.join("\n");
  }
}
