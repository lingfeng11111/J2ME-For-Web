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
 * J2ME-For-Web Java Throwable
 * Java 异常对象的运行时表示
 */

import { JavaObject } from "./object";
import { JavaString } from "./string";
import { ClassInfo } from "../classfile/class-info";

/**
 * Java 异常对象
 * 对应 java.lang.Throwable 及其子类
 */
export class JavaThrowable extends JavaObject {
  /** 异常消息 */
  private message: string | null;

  /** 堆栈跟踪 */
  private stackTrace: StackTraceElement[];

  /** 原因异常 */
  private cause: JavaThrowable | null;

  constructor(classInfo: ClassInfo, message?: string) {
    super(classInfo);
    this.message = message || null;
    this.stackTrace = [];
    this.cause = null;
  }

  /**
   * 获取异常消息
   */
  getMessage(): string | null {
    return this.message;
  }

  /**
   * 设置异常消息
   */
  setMessage(message: string): void {
    this.message = message;
  }

  /**
   * 获取堆栈跟踪
   */
  getStackTrace(): StackTraceElement[] {
    return this.stackTrace;
  }

  /**
   * 设置堆栈跟踪
   */
  setStackTrace(stackTrace: StackTraceElement[]): void {
    this.stackTrace = stackTrace;
  }

  /**
   * 添加堆栈跟踪元素
   */
  addStackTraceElement(element: StackTraceElement): void {
    this.stackTrace.push(element);
  }

  /**
   * 获取原因异常
   */
  getCause(): JavaThrowable | null {
    return this.cause;
  }

  /**
   * 设置原因异常
   */
  setCause(cause: JavaThrowable): void {
    this.cause = cause;
  }

  /**
   * 打印堆栈跟踪
   */
  printStackTrace(): void {
    console.error(`${this.classInfo.thisClass}: ${this.message || ""}`);
    for (const element of this.stackTrace) {
      console.error(`  at ${element.className}.${element.methodName}(${element.fileName}:${element.lineNumber})`);
    }
    if (this.cause) {
      console.error("Caused by:");
      this.cause.printStackTrace();
    }
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return `${this.classInfo.thisClass}: ${this.message || ""}`;
  }
}

/**
 * 堆栈跟踪元素
 */
export interface StackTraceElement {
  /** 类名 */
  className: string;
  /** 方法名 */
  methodName: string;
  /** 文件名 */
  fileName: string;
  /** 行号 */
  lineNumber: number;
}

/**
 * 异常工厂
 * 用于创建常见的异常对象
 */
export class ThrowableFactory {
  /**
   * 创建 NullPointerException
   */
  static createNullPointerException(message?: string): JavaThrowable {
    const classInfo = ThrowableFactory.createMockClassInfo("java/lang/NullPointerException");
    return new JavaThrowable(classInfo, message || "null");
  }

  /**
   * 创建 ArrayIndexOutOfBoundsException
   */
  static createArrayIndexOutOfBoundsException(index: number): JavaThrowable {
    const classInfo = ThrowableFactory.createMockClassInfo("java/lang/ArrayIndexOutOfBoundsException");
    return new JavaThrowable(classInfo, `Index ${index} out of bounds`);
  }

  /**
   * 创建 ClassCastException
   */
  static createClassCastException(message: string): JavaThrowable {
    const classInfo = ThrowableFactory.createMockClassInfo("java/lang/ClassCastException");
    return new JavaThrowable(classInfo, message);
  }

  /**
   * 创建 ArithmeticException
   */
  static createArithmeticException(message: string): JavaThrowable {
    const classInfo = ThrowableFactory.createMockClassInfo("java/lang/ArithmeticException");
    return new JavaThrowable(classInfo, message);
  }

  /**
   * 创建 IllegalMonitorStateException
   */
  static createIllegalMonitorStateException(message: string): JavaThrowable {
    const classInfo = ThrowableFactory.createMockClassInfo("java/lang/IllegalMonitorStateException");
    return new JavaThrowable(classInfo, message);
  }

  /**
   * 创建模拟的 ClassInfo
   */
  private static createMockClassInfo(className: string): ClassInfo {
    return {
      thisClass: className,
      superClass: "java/lang/Throwable",
      interfaces: [],
      accessFlags: 0x0001,
      fields: [],
      methods: [],
      constantPool: { getSize: () => 0 } as any,
      isPublic: () => true,
      isFinal: () => false,
      isInterface: () => false,
      isAbstract: () => false,
      getJavaVersion: () => "1.1",
      getInstanceFields: () => [],
      getStaticFields: () => [],
    } as unknown as ClassInfo;
  }
}
