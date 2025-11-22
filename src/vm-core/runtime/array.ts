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

import { ClassInfo } from "../classfile/class-info";
import { JavaObject } from "./object";
import { JavaValue } from "../core/types";

/**
 * Java 数组类型
 */
export enum ArrayType {
  BOOLEAN = 4,    // Z
  CHAR = 5,       // C
  FLOAT = 6,      // F
  DOUBLE = 7,     // D
  BYTE = 8,       // B
  SHORT = 9,      // S
  INT = 10,       // I
  LONG = 11,      // J
  OBJECT = 100,   // 对象数组
}

/**
 * Java 数组对象
 * 继承自 JavaObject，同时管理数组元素
 */
export class JavaArray extends JavaObject {
  /** 数组元素类型 */
  readonly componentType: ArrayType;
  
  /** 数组长度 */
  readonly length: number;
  
  /** 数组元素存储 */
  private elements: JavaValue[];

  constructor(classInfo: ClassInfo, componentType: ArrayType, length: number) {
    super(classInfo);
    this.componentType = componentType;
    this.length = length;
    this.elements = new Array(length);
    
    // 初始化数组元素为默认值
    this.initializeElements();
  }

  /**
   * 从描述符创建数组（简化工厂方法，用于测试）
   * @param descriptor 类型描述符（如 "I", "J", "[I" 等）
   * @param length 数组长度
   */
  static createFromDescriptor(descriptor: string, length: number): JavaArray {
    const componentType = getArrayTypeFromDescriptor(descriptor);
    
    // 创建一个模拟的 ClassInfo
    const arrayClassName = descriptor.startsWith('[') ? descriptor : `[${descriptor}`;
    const mockClassInfo = {
      thisClass: arrayClassName,
      superClass: 'java/lang/Object',
      interfaces: [],
      accessFlags: 0x0001,
      fields: [],
      methods: [],
      constantPool: { getSize: () => 0 },
      isPublic: () => true,
      isFinal: () => true,
      isInterface: () => false,
      isAbstract: () => false,
      getJavaVersion: () => "1.0",
      getInstanceFields: () => [],
      getStaticFields: () => [],
    } as unknown as ClassInfo;

    return new JavaArray(mockClassInfo, componentType, length);
  }

  /**
   * 初始化数组元素为默认值
   */
  private initializeElements(): void {
    const defaultValue = this.getArrayDefaultValue();
    for (let i = 0; i < this.length; i++) {
      this.elements[i] = defaultValue;
    }
  }

  /**
   * 获取数组元素的默认值
   */
  private getArrayDefaultValue(): JavaValue {
    switch (this.componentType) {
      case ArrayType.BOOLEAN:
      case ArrayType.BYTE:
      case ArrayType.CHAR:
      case ArrayType.SHORT:
      case ArrayType.INT:
        return 0;
      case ArrayType.LONG:
        return 0n;
      case ArrayType.FLOAT:
      case ArrayType.DOUBLE:
        return 0.0;
      case ArrayType.OBJECT:
        return null;
      default:
        return null;
    }
  }

  /**
   * 获取数组元素
   */
  getElement(index: number): JavaValue {
    if (index < 0 || index >= this.length) {
      throw new Error(`ArrayIndexOutOfBoundsException: ${index} (length: ${this.length})`);
    }
    return this.elements[index];
  }

  /**
   * 设置数组元素
   */
  setElement(index: number, value: JavaValue): void {
    if (index < 0 || index >= this.length) {
      throw new Error(`ArrayIndexOutOfBoundsException: ${index} (length: ${this.length})`);
    }
    
    // 类型检查（简化版本）
    if (!this.isValidElement(value)) {
      throw new Error(`ArrayStoreException: Cannot store ${typeof value} in ${ArrayType[this.componentType]} array`);
    }
    
    this.elements[index] = value;
  }

  /**
   * 验证元素类型是否匹配
   */
  private isValidElement(value: JavaValue): boolean {
    if (value === null) {
      return true; // null 可以赋值给任何引用类型数组
    }

    switch (this.componentType) {
      case ArrayType.BOOLEAN:
        return typeof value === 'boolean' || (typeof value === 'number' && (value === 0 || value === 1));
      case ArrayType.BYTE:
      case ArrayType.CHAR:
      case ArrayType.SHORT:
      case ArrayType.INT:
        return typeof value === 'number' && Number.isInteger(value);
      case ArrayType.LONG:
        return typeof value === 'bigint';
      case ArrayType.FLOAT:
      case ArrayType.DOUBLE:
        return typeof value === 'number';
      case ArrayType.OBJECT:
        return value instanceof JavaObject;
      default:
        return false;
    }
  }

  /**
   * 获取所有元素（调试用）
   */
  getElements(): JavaValue[] {
    return [...this.elements];
  }

  /**
   * 获取数组元素（兼容旧 API）
   */
  get(index: number): JavaValue {
    return this.getElement(index);
  }

  /**
   * 设置数组元素（兼容旧 API）
   */
  set(index: number, value: JavaValue): void {
    this.setElement(index, value);
  }

  /**
   * 复制数组元素到另一个数组
   */
  copyTo(dest: JavaArray, srcPos: number, destPos: number, length: number): void {
    if (srcPos < 0 || destPos < 0 || length < 0) {
      throw new Error("IndexOutOfBoundsException: negative index or length");
    }
    if (srcPos + length > this.length) {
      throw new Error("IndexOutOfBoundsException: source array overflow");
    }
    if (destPos + length > dest.length) {
      throw new Error("IndexOutOfBoundsException: destination array overflow");
    }

    for (let i = 0; i < length; i++) {
      dest.setElement(destPos + i, this.elements[srcPos + i]);
    }
  }

  /**
   * 打印数组元素（调试用）
   */
  printElements(): string {
    return `[${this.elements.map(e => String(e)).join(', ')}]`;
  }

  /**
   * 判断是否为基本类型数组
   */
  isPrimitiveArray(): boolean {
    return this.componentType !== ArrayType.OBJECT;
  }
}

/**
 * 从字段描述符获取数组类型
 */
export function getArrayTypeFromDescriptor(descriptor: string): ArrayType {
  switch (descriptor) {
    case 'Z': return ArrayType.BOOLEAN;
    case 'B': return ArrayType.BYTE;
    case 'C': return ArrayType.CHAR;
    case 'S': return ArrayType.SHORT;
    case 'I': return ArrayType.INT;
    case 'J': return ArrayType.LONG;
    case 'F': return ArrayType.FLOAT;
    case 'D': return ArrayType.DOUBLE;
    default:
      if (descriptor.startsWith('L') || descriptor.startsWith('[')) {
        return ArrayType.OBJECT;
      }
      throw new Error(`Unknown array type descriptor: ${descriptor}`);
  }
}

/**
 * 从数组类型获取字段描述符
 */
export function getDescriptorFromArrayType(arrayType: ArrayType): string {
  switch (arrayType) {
    case ArrayType.BOOLEAN: return 'Z';
    case ArrayType.BYTE: return 'B';
    case ArrayType.CHAR: return 'C';
    case ArrayType.SHORT: return 'S';
    case ArrayType.INT: return 'I';
    case ArrayType.LONG: return 'J';
    case ArrayType.FLOAT: return 'F';
    case ArrayType.DOUBLE: return 'D';
    case ArrayType.OBJECT: return 'Ljava/lang/Object;';
    default: throw new Error(`Unknown array type: ${arrayType}`);
  }
}
