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
 * J2ME-For-Web Attributes
 * Class 文件属性解析
 */

import { ClassFileReader } from "./reader";
import { ConstantPool } from "./constant-pool";

// ============================================
// 属性类型
// ============================================

export interface Attribute {
  name: string;
  data: Uint8Array;
}

/** Code 属性 (方法的字节码) */
export interface CodeAttribute extends Attribute {
  name: "Code";
  maxStack: number;
  maxLocals: number;
  code: Uint8Array;
  exceptionTable: ExceptionTableEntry[];
  attributes: Attribute[];
}

/** 异常表条目 */
export interface ExceptionTableEntry {
  startPc: number;
  endPc: number;
  handlerPc: number;
  catchType: number; // 0 表示 finally
}

/** SourceFile 属性 */
export interface SourceFileAttribute extends Attribute {
  name: "SourceFile";
  sourceFile: string;
}

/** LineNumberTable 属性 */
export interface LineNumberTableAttribute extends Attribute {
  name: "LineNumberTable";
  lineNumberTable: LineNumberEntry[];
}

export interface LineNumberEntry {
  startPc: number;
  lineNumber: number;
}

/** LocalVariableTable 属性 */
export interface LocalVariableTableAttribute extends Attribute {
  name: "LocalVariableTable";
  localVariableTable: LocalVariableEntry[];
}

export interface LocalVariableEntry {
  startPc: number;
  length: number;
  name: string;
  descriptor: string;
  index: number;
}

// ============================================
// 属性解析器
// ============================================

export class AttributeParser {
  constructor(
    private reader: ClassFileReader,
    private constantPool: ConstantPool
  ) {}

  /**
   * 解析属性列表
   */
  parseAttributes(): Attribute[] {
    const count = this.reader.readU2();
    const attributes: Attribute[] = [];

    for (let i = 0; i < count; i++) {
      attributes.push(this.parseAttribute());
    }

    return attributes;
  }

  /**
   * 解析单个属性
   */
  private parseAttribute(): Attribute {
    const nameIndex = this.reader.readU2();
    const length = this.reader.readU4();
    const name = this.constantPool.getUtf8(nameIndex);

    // 根据属性名称解析不同类型的属性
    switch (name) {
      case "Code":
        return this.parseCodeAttribute(name, length);
      case "SourceFile":
        return this.parseSourceFileAttribute(name);
      case "LineNumberTable":
        return this.parseLineNumberTableAttribute(name);
      case "LocalVariableTable":
        return this.parseLocalVariableTableAttribute(name);
      default:
        // 未知属性,直接读取原始数据
        return {
          name,
          data: this.reader.readBytes(length),
        };
    }
  }

  /**
   * 解析 Code 属性
   */
  private parseCodeAttribute(name: string, length: number): CodeAttribute {
    const maxStack = this.reader.readU2();
    const maxLocals = this.reader.readU2();
    const codeLength = this.reader.readU4();
    const code = this.reader.readBytes(codeLength);

    // 异常表
    const exceptionTableLength = this.reader.readU2();
    const exceptionTable: ExceptionTableEntry[] = [];
    for (let i = 0; i < exceptionTableLength; i++) {
      exceptionTable.push({
        startPc: this.reader.readU2(),
        endPc: this.reader.readU2(),
        handlerPc: this.reader.readU2(),
        catchType: this.reader.readU2(),
      });
    }

    // Code 属性的子属性
    const attributes = this.parseAttributes();

    return {
      name: "Code",
      data: new Uint8Array(0),
      maxStack,
      maxLocals,
      code,
      exceptionTable,
      attributes,
    };
  }

  /**
   * 解析 SourceFile 属性
   */
  private parseSourceFileAttribute(name: string): SourceFileAttribute {
    const sourceFileIndex = this.reader.readU2();
    const sourceFile = this.constantPool.getUtf8(sourceFileIndex);

    return {
      name: "SourceFile",
      data: new Uint8Array(0),
      sourceFile,
    };
  }

  /**
   * 解析 LineNumberTable 属性
   */
  private parseLineNumberTableAttribute(name: string): LineNumberTableAttribute {
    const tableLength = this.reader.readU2();
    const lineNumberTable: LineNumberEntry[] = [];

    for (let i = 0; i < tableLength; i++) {
      lineNumberTable.push({
        startPc: this.reader.readU2(),
        lineNumber: this.reader.readU2(),
      });
    }

    return {
      name: "LineNumberTable",
      data: new Uint8Array(0),
      lineNumberTable,
    };
  }

  /**
   * 解析 LocalVariableTable 属性
   */
  private parseLocalVariableTableAttribute(
    name: string
  ): LocalVariableTableAttribute {
    const tableLength = this.reader.readU2();
    const localVariableTable: LocalVariableEntry[] = [];

    for (let i = 0; i < tableLength; i++) {
      const startPc = this.reader.readU2();
      const length = this.reader.readU2();
      const nameIndex = this.reader.readU2();
      const descriptorIndex = this.reader.readU2();
      const index = this.reader.readU2();

      localVariableTable.push({
        startPc,
        length,
        name: this.constantPool.getUtf8(nameIndex),
        descriptor: this.constantPool.getUtf8(descriptorIndex),
        index,
      });
    }

    return {
      name: "LocalVariableTable",
      data: new Uint8Array(0),
      localVariableTable,
    };
  }
}
