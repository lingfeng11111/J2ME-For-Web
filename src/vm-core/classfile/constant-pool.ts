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
 * J2ME-For-Web Constant Pool
 * 常量池解析和管理
 */

import { ConstantTag, CONSTANT_TAG_SIZE } from "../core/constants";
import { ClassFileReader } from "./reader";
import {
  ConstantValue,
  Utf8Constant,
  IntegerConstant,
  FloatConstant,
  LongConstant,
  DoubleConstant,
  ClassConstant,
  StringConstant,
  FieldrefConstant,
  MethodrefConstant,
  InterfaceMethodrefConstant,
  NameAndTypeConstant,
  ResolvedClassRef,
  ResolvedFieldRef,
  ResolvedMethodRef,
} from "./constant-pool-types";

/**
 * 常量池
 * 负责解析和缓存 Class 文件的常量池
 */
export class ConstantPool {
  private entries: Uint32Array; // 每个条目的偏移量
  private resolved: (ConstantValue | undefined)[]; // 已解析的常量缓存
  private buffer: Uint8Array; // 原始字节数组

  constructor(reader: ClassFileReader) {
    this.buffer = reader["buffer"]; // 访问 reader 的 buffer
    this.entries = new Uint32Array(0);
    this.resolved = [];
    this.scanEntries(reader);
  }

  // ============================================
  // 扫描常量池 (延迟解析)
  // ============================================

  /**
   * 快速扫描常量池,只记录每个条目的偏移量
   * 不立即解析内容,提高性能
   */
  private scanEntries(reader: ClassFileReader): void {
    const count = reader.readU2(); // 常量池大小
    this.entries = new Uint32Array(count);
    this.resolved = new Array(count);

    // 索引 0 保留不用
    this.entries[0] = 0;
    this.resolved[0] = undefined;

    let offset = reader.getOffset();

    // 扫描所有条目
    for (let i = 1; i < count; i++) {
      this.entries[i] = offset;

      const tag = this.buffer[offset];
      offset++; // 跳过 tag

      if (tag === ConstantTag.Utf8) {
        // UTF-8 是可变长度的
        const length = (this.buffer[offset] << 8) | this.buffer[offset + 1];
        offset += 2 + length;
      } else if (tag in CONSTANT_TAG_SIZE) {
        // 固定长度的条目
        offset += CONSTANT_TAG_SIZE[tag];
      } else {
        throw new Error(`Unknown constant pool tag: ${tag} at index ${i}`);
      }

      // Long 和 Double 占用两个索引位置
      if (tag === ConstantTag.Long || tag === ConstantTag.Double) {
        i++; // 跳过下一个索引
        if (i < count) {
          this.entries[i] = 0; // 标记为无效
        }
      }
    }

    // 更新 reader 的位置
    reader.setOffset(offset);
  }

  // ============================================
  // 解析常量池条目
  // ============================================

  /**
   * 获取常量池条目 (延迟解析)
   */
  get(index: number): ConstantValue {
    if (index <= 0 || index >= this.entries.length) {
      throw new Error(`Invalid constant pool index: ${index}`);
    }

    // 检查缓存
    if (this.resolved[index]) {
      return this.resolved[index]!;
    }

    // 解析并缓存
    const entry = this.parseEntry(index);
    this.resolved[index] = entry;
    return entry;
  }

  /**
   * 解析单个常量池条目
   */
  private parseEntry(index: number): ConstantValue {
    const offset = this.entries[index];
    const tag = this.buffer[offset];

    const reader = new ClassFileReader(this.buffer);
    reader.setOffset(offset + 1); // 跳过 tag

    switch (tag) {
      case ConstantTag.Utf8:
        return this.parseUtf8(reader);

      case ConstantTag.Integer:
        return { tag: ConstantTag.Integer, value: reader.readI4() };

      case ConstantTag.Float:
        return { tag: ConstantTag.Float, value: reader.readFloat() };

      case ConstantTag.Long:
        return { tag: ConstantTag.Long, value: reader.readI8() };

      case ConstantTag.Double:
        return { tag: ConstantTag.Double, value: reader.readDouble() };

      case ConstantTag.Class:
        return { tag: ConstantTag.Class, nameIndex: reader.readU2() };

      case ConstantTag.String:
        return { tag: ConstantTag.String, stringIndex: reader.readU2() };

      case ConstantTag.Fieldref:
        return {
          tag: ConstantTag.Fieldref,
          classIndex: reader.readU2(),
          nameAndTypeIndex: reader.readU2(),
        };

      case ConstantTag.Methodref:
        return {
          tag: ConstantTag.Methodref,
          classIndex: reader.readU2(),
          nameAndTypeIndex: reader.readU2(),
        };

      case ConstantTag.InterfaceMethodref:
        return {
          tag: ConstantTag.InterfaceMethodref,
          classIndex: reader.readU2(),
          nameAndTypeIndex: reader.readU2(),
        };

      case ConstantTag.NameAndType:
        return {
          tag: ConstantTag.NameAndType,
          nameIndex: reader.readU2(),
          descriptorIndex: reader.readU2(),
        };

      default:
        throw new Error(`Unsupported constant pool tag: ${tag}`);
    }
  }

  /**
   * 解析 UTF-8 常量 (零拷贝)
   */
  private parseUtf8(reader: ClassFileReader): Utf8Constant {
    const length = reader.readU2();
    const bytes = reader.readUtf8Bytes(length);
    return {
      tag: ConstantTag.Utf8,
      bytes,
      value: undefined, // 延迟解码
    };
  }

  // ============================================
  // 类型安全的访问方法
  // ============================================

  /**
   * 获取 UTF-8 字符串
   */
  getUtf8(index: number): string {
    const entry = this.get(index);
    if (entry.tag !== ConstantTag.Utf8) {
      throw new Error(`Expected UTF-8 constant at index ${index}, got tag ${entry.tag}`);
    }

    // 延迟解码
    if (!entry.value) {
      entry.value = new TextDecoder("utf-8").decode(entry.bytes);
    }

    return entry.value;
  }

  /**
   * 获取类名 (通过 Class 常量)
   */
  getClassName(index: number): string {
    const entry = this.get(index);
    if (entry.tag !== ConstantTag.Class) {
      throw new Error(`Expected Class constant at index ${index}`);
    }
    return this.getUtf8(entry.nameIndex);
  }

  /**
   * 获取字符串常量
   */
  getString(index: number): string {
    const entry = this.get(index);
    if (entry.tag !== ConstantTag.String) {
      throw new Error(`Expected String constant at index ${index}`);
    }
    return this.getUtf8(entry.stringIndex);
  }

  /**
   * 解析字段引用
   */
  getFieldRef(index: number): ResolvedFieldRef {
    const entry = this.get(index);
    if (entry.tag !== ConstantTag.Fieldref) {
      throw new Error(`Expected Fieldref constant at index ${index}`);
    }

    const className = this.getClassName(entry.classIndex);
    const nameAndType = this.get(entry.nameAndTypeIndex) as NameAndTypeConstant;
    const fieldName = this.getUtf8(nameAndType.nameIndex);
    const descriptor = this.getUtf8(nameAndType.descriptorIndex);

    return { className, fieldName, descriptor };
  }

  /**
   * 解析方法引用
   */
  getMethodRef(index: number): ResolvedMethodRef {
    const entry = this.get(index);
    if (
      entry.tag !== ConstantTag.Methodref &&
      entry.tag !== ConstantTag.InterfaceMethodref
    ) {
      throw new Error(`Expected Methodref constant at index ${index}`);
    }

    const className = this.getClassName(entry.classIndex);
    const nameAndType = this.get(entry.nameAndTypeIndex) as NameAndTypeConstant;
    const methodName = this.getUtf8(nameAndType.nameIndex);
    const descriptor = this.getUtf8(nameAndType.descriptorIndex);

    return { className, methodName, descriptor };
  }

  /**
   * 获取常量池大小
   */
  getSize(): number {
    return this.entries.length;
  }
}
