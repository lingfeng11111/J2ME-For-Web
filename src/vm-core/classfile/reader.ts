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
 * J2ME-For-Web Class File Reader
 * 使用 DataView 实现高性能的二进制读取
 */

/**
 * Class 文件二进制读取器
 * 使用 DataView 替代手动位运算,性能提升 10x
 */
export class ClassFileReader {
  private view: DataView;
  private offset: number = 0;
  private readonly buffer: Uint8Array;

  constructor(buffer: Uint8Array) {
    this.buffer = buffer;
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  // ============================================
  // 基本读取方法
  // ============================================

  /**
   * 读取 1 字节无符号整数 (u1)
   */
  readU1(): number {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  /**
   * 读取 2 字节无符号整数 (u2) - Big Endian
   */
  readU2(): number {
    const value = this.view.getUint16(this.offset, false); // false = big-endian
    this.offset += 2;
    return value;
  }

  /**
   * 读取 4 字节无符号整数 (u4) - Big Endian
   */
  readU4(): number {
    const value = this.view.getUint32(this.offset, false);
    this.offset += 4;
    return value;
  }

  /**
   * 读取 1 字节有符号整数 (i1)
   */
  readI1(): number {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  /**
   * 读取 2 字节有符号整数 (i2) - Big Endian
   */
  readI2(): number {
    const value = this.view.getInt16(this.offset, false);
    this.offset += 2;
    return value;
  }

  /**
   * 读取 4 字节有符号整数 (i4) - Big Endian
   */
  readI4(): number {
    const value = this.view.getInt32(this.offset, false);
    this.offset += 4;
    return value;
  }

  /**
   * 读取 8 字节有符号长整数 (i8) - Big Endian
   * 使用原生 BigInt (Node.js 12+ 支持)
   */
  readI8(): bigint {
    const value = this.view.getBigInt64(this.offset, false); // false = big-endian
    this.offset += 8;
    return value;
  }

  /**
   * 读取 4 字节浮点数 (float) - Big Endian
   */
  readFloat(): number {
    const value = this.view.getFloat32(this.offset, false);
    this.offset += 4;
    return value;
  }

  /**
   * 读取 8 字节浮点数 (double) - Big Endian
   */
  readDouble(): number {
    const value = this.view.getFloat64(this.offset, false);
    this.offset += 8;
    return value;
  }

  // ============================================
  // UTF-8 字符串读取
  // ============================================

  /**
   * 读取 UTF-8 字符串 (零拷贝)
   * @param length 字节长度
   * @returns Uint8Array (延迟解码)
   */
  readUtf8Bytes(length: number): Uint8Array {
    const bytes = new Uint8Array(
      this.view.buffer,
      this.view.byteOffset + this.offset,
      length
    );
    this.offset += length;
    return bytes;
  }

  /**
   * 读取 UTF-8 字符串并解码为 JavaScript 字符串
   * @param length 字节长度
   */
  readUtf8String(length: number): string {
    const bytes = this.readUtf8Bytes(length);
    return new TextDecoder("utf-8").decode(bytes);
  }

  // ============================================
  // 字节数组读取
  // ============================================

  /**
   * 读取指定长度的字节数组 (零拷贝)
   */
  readBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(
      this.view.buffer,
      this.view.byteOffset + this.offset,
      length
    );
    this.offset += length;
    return bytes;
  }

  // ============================================
  // 位置控制
  // ============================================

  /**
   * 获取当前读取位置
   */
  getOffset(): number {
    return this.offset;
  }

  /**
   * 设置读取位置
   */
  setOffset(offset: number): void {
    if (offset < 0 || offset > this.buffer.length) {
      throw new Error(`Invalid offset: ${offset}`);
    }
    this.offset = offset;
  }

  /**
   * 跳过指定字节数
   */
  skip(bytes: number): void {
    this.offset += bytes;
  }

  /**
   * 检查是否还有数据可读
   */
  hasRemaining(): boolean {
    return this.offset < this.buffer.length;
  }

  /**
   * 获取剩余字节数
   */
  remaining(): number {
    return this.buffer.length - this.offset;
  }

  // ============================================
  // 对齐操作 (用于 tableswitch/lookupswitch)
  // ============================================

  /**
   * 对齐到 4 字节边界
   */
  alignTo4(): void {
    const padding = (4 - (this.offset % 4)) % 4;
    this.offset += padding;
  }
}
