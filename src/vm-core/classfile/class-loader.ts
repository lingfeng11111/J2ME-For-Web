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
 * J2ME-For-Web Class Loader
 * 类加载器
 */

import { ClassInfo } from "./class-info";

/**
 * 类路径接口
 * 定义如何读取 Class 文件数据
 */
export interface ClassPath {
  /**
   * 读取 Class 文件字节
   * @param className 类的内部名称 (如 java/lang/String)
   * @returns Class 文件的字节数组,如果未找到则返回 null
   */
  readClass(className: string): Uint8Array | null;
}

/**
 * 类加载器
 * 负责加载、链接和初始化类
 */
export class ClassLoader {
  /** 已加载的类缓存 (类名 -> ClassInfo) */
  private classes: Map<string, ClassInfo> = new Map();

  /** 类路径 */
  private classPath: ClassPath;

  constructor(classPath: ClassPath) {
    this.classPath = classPath;
  }

  /**
   * 加载类
   * @param className 类的内部名称 (如 java/lang/String)
   */
  loadClass(className: string): ClassInfo {
    // 1. 检查缓存
    if (this.classes.has(className)) {
      return this.classes.get(className)!;
    }

    // 2. 数组类特殊处理
    if (className.startsWith("[")) {
      return this.loadArrayClass(className);
    }

    // 3. 读取 Class 文件
    const data = this.classPath.readClass(className);
    if (!data) {
      throw new Error(`ClassNotFoundException: ${className}`);
    }

    // 4. 解析 Class 文件
    const classInfo = new ClassInfo(data);

    // 5. 验证类名
    if (classInfo.thisClass !== className) {
      throw new Error(
        `NoClassDefFoundError: Expected ${className}, found ${classInfo.thisClass}`
      );
    }

    // 6. 放入缓存 (在解析父类之前,防止循环依赖死循环)
    this.classes.set(className, classInfo);

    // 7. 递归加载父类
    if (classInfo.superClass) {
      this.loadClass(classInfo.superClass);
    }

    // 8. 递归加载接口
    for (const interfaceName of classInfo.interfaces) {
      this.loadClass(interfaceName);
    }

    return classInfo;
  }

  /**
   * 加载数组类
   * 数组类是虚拟机生成的,没有对应的 Class 文件
   */
  private loadArrayClass(className: string): ClassInfo {
    // 创建一个模拟的 ClassInfo
    // 数组类继承自 java/lang/Object,实现了 Cloneable 和 Serializable
    const classInfo = {
      thisClass: className,
      superClass: "java/lang/Object",
      interfaces: ["java/lang/Cloneable", "java/io/Serializable"],
      accessFlags: 0x0001, // public
      fields: [],
      methods: [],
      constantPool: { getSize: () => 0 }, // 模拟常量池
      // ... 其他属性模拟
      isPublic: () => true,
      isFinal: () => true,
      isInterface: () => false,
      isAbstract: () => false,
      getJavaVersion: () => "1.0",
      getInstanceFields: () => [],
      getStaticFields: () => [],
      // ...
    } as unknown as ClassInfo;

    this.classes.set(className, classInfo);
    
    // 加载父类
    this.loadClass("java/lang/Object");
    
    return classInfo;
  }

  /**
   * 获取已加载的类
   */
  getClass(className: string): ClassInfo | undefined {
    return this.classes.get(className);
  }
}
