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

  /** Class 对象缓存 (用于反射) */
  private classObject: any = null;

  /** 对象的身份哈希码 (延迟生成) */
  private identityHash: number | null = null;

  /** 静态 ID 计数器 */
  private static nextId = 0;

  /** 全局类加载器引用 (用于支持父类字段初始化和类型检查) */
  private static classLoader: any = null;

  /**
   * 设置全局类加载器
   */
  static setClassLoader(loader: any): void {
    JavaObject.classLoader = loader;
  }

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

    // 递归初始化父类字段
    if (this.classInfo.superClass && this.classInfo.superClass !== "java/lang/Object") {
      this.initializeSuperClassFields(this.classInfo.superClass);
    }

    // 初始化当前类的实例字段
    for (const field of this.classInfo.getInstanceFields()) {
      const defaultValue = this.getDefaultValue(field);
      this.setField(field.name, field.descriptor, defaultValue);
    }
  }

  /**
   * 递归初始化父类字段
   */
  private initializeSuperClassFields(superClassName: string): void {
    if (superClassName === "java/lang/Object" || !JavaObject.classLoader) {
      // Object 类没有实例字段，或类加载器未设置
      return;
    }

    try {
      // 通过类加载器获取父类的 ClassInfo
      const superClassInfo = JavaObject.classLoader.loadClass(superClassName);
      
      // 递归初始化父类的父类
      if (superClassInfo.superClass && superClassInfo.superClass !== "java/lang/Object") {
        this.initializeSuperClassFields(superClassInfo.superClass);
      }

      // 初始化父类的实例字段
      if (typeof superClassInfo.getInstanceFields === "function") {
        for (const field of superClassInfo.getInstanceFields()) {
          const defaultValue = this.getDefaultValue(field);
          this.setField(field.name, field.descriptor, defaultValue);
        }
      }
    } catch (e) {
      // 如果类加载失败，记录警告但不中断对象创建
      console.warn(`Failed to initialize superclass fields for ${superClassName}:`, e);
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

    // 递归检查父类链
    if (this.classInfo.superClass && JavaObject.classLoader) {
      if (this.isInstanceOfSuperClass(this.classInfo.superClass, className)) {
        return true;
      }
    }

    // 检查接口
    if (this.classInfo.interfaces.includes(className)) {
      return true;
    }

    return false;
  }

  /**
   * 递归检查父类链
   */
  private isInstanceOfSuperClass(superClassName: string, targetClassName: string): boolean {
    if (superClassName === targetClassName) {
      return true;
    }

    if (superClassName === "java/lang/Object" || !JavaObject.classLoader) {
      return false;
    }

    try {
      const superClassInfo = JavaObject.classLoader.loadClass(superClassName);
      
      // 递归检查父类的父类
      if (superClassInfo.superClass) {
        return this.isInstanceOfSuperClass(superClassInfo.superClass, targetClassName);
      }
    } catch (e) {
      console.warn(`Failed to check instanceof for superclass ${superClassName}:`, e);
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

  // ============================================
  // 反射支持
  // ============================================

  /**
   * 获取对象的 Class 对象
   * 用于支持 Object.getClass() 方法
   * 
   * 注意: 为了避免循环依赖,返回类型为 any
   * 实际返回的是 JavaClass 实例
   */
  getClassObject(): any {
    if (!this.classObject) {
      // 延迟加载 JavaClass,避免循环依赖
      // 这里需要动态导入或通过依赖注入
      // 目前暂时返回一个空对象,等待 JavaClass 设置
      this.classObject = { classInfo: this.classInfo };
    }
    return this.classObject;
  }

  /**
   * 设置 Class 对象
   * 由 JavaClass 创建时调用
   */
  setClassObject(classObject: any): void {
    this.classObject = classObject;
  }

  /**
   * 获取对象的身份哈希码
   * 相当于 System.identityHashCode(this)
   * 
   * 使用对象 ID 作为哈希码，保证：
   * 1. 每个对象有唯一的哈希码
   * 2. 同一对象多次调用返回相同值
   * 3. 性能高效（延迟生成）
   */
  getIdentityHashCode(): number {
    if (this.identityHash === null) {
      // 使用对象 ID 作为身份哈希码
      this.identityHash = this.id;
    }
    return this.identityHash;
  }
}
