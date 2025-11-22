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
 * J2ME-For-Web System Class Path
 * 系统类路径，提供核心系统类的模拟实现
 */

import { ClassPath } from "./class-loader";
import { ClassInfo } from "./class-info";

/**
 * 系统类路径
 * 模拟核心系统类，不需要从文件读取，直接返回模拟的 ClassInfo
 */
export class SystemClassPath implements ClassPath {
  /** 系统类缓存（类名 -> ClassInfo） */
  private systemClasses: Map<string, ClassInfo> = new Map();

  constructor() {
    this.initializeSystemClasses();
  }

  /**
   * 初始化系统类
   * 创建核心系统类的模拟 ClassInfo
   */
  private initializeSystemClasses(): void {
    // java.lang.Object
    this.createSystemClass("java/lang/Object", null, [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "hashCode", descriptor: "()I", accessFlags: 0x0001 },
        { name: "getClass", descriptor: "()Ljava/lang/Class;", accessFlags: 0x0011 }, // public final
        { name: "clone", descriptor: "()Ljava/lang/Object;", accessFlags: 0x0004 }, // protected
        { name: "notify", descriptor: "()V", accessFlags: 0x0011 }, // public final
        { name: "notifyAll", descriptor: "()V", accessFlags: 0x0011 }, // public final
        { name: "wait", descriptor: "(J)V", accessFlags: 0x0011 }, // public final
      ]
    });

    // java.lang.String
    this.createSystemClass("java/lang/String", "java/lang/Object", ["java/io/Serializable", "java/lang/Comparable", "java/lang/CharSequence"], {
      fields: [
        { name: "value", descriptor: "[C", accessFlags: 0x0002 }, // private
        { name: "offset", descriptor: "I", accessFlags: 0x0002 }, // private
        { name: "count", descriptor: "I", accessFlags: 0x0002 }, // private
      ],
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "([C)V", accessFlags: 0x0001 },
        { name: "charAt", descriptor: "(I)C", accessFlags: 0x0001 },
        { name: "length", descriptor: "()I", accessFlags: 0x0001 },
        { name: "substring", descriptor: "(II)Ljava/lang/String;", accessFlags: 0x0001 },
        { name: "toString", descriptor: "()Ljava/lang/String;", accessFlags: 0x0001 },
      ]
    });

    // java.lang.Class
    this.createSystemClass("java/lang/Class", "java/lang/Object", ["java/io/Serializable"], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0000 }, // private
        { name: "getName", descriptor: "()Ljava/lang/String;", accessFlags: 0x0001 },
        { name: "getSuperclass", descriptor: "()Ljava/lang/Class;", accessFlags: 0x0001 },
        { name: "isInterface", descriptor: "()Z", accessFlags: 0x0001 },
        { name: "isArray", descriptor: "()Z", accessFlags: 0x0001 },
        { name: "getComponentType", descriptor: "()Ljava/lang/Class;", accessFlags: 0x0001 },
      ]
    });

    // javax.microedition.midlet.MIDlet
    this.createSystemClass("javax/microedition/midlet/MIDlet", "java/lang/Object", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "startApp", descriptor: "()V", accessFlags: 0x0001 },
        { name: "pauseApp", descriptor: "()V", accessFlags: 0x0001 },
        { name: "destroyApp", descriptor: "(Z)V", accessFlags: 0x0001 },
        { name: "notifyDestroyed", descriptor: "()V", accessFlags: 0x0011 }, // public final
        { name: "notifyPaused", descriptor: "()V", accessFlags: 0x0011 }, // public final
        { name: "resumeRequest", descriptor: "()V", accessFlags: 0x0011 }, // public final
        { name: "getAppProperty", descriptor: "(Ljava/lang/String;)Ljava/lang/String;", accessFlags: 0x0001 },
      ]
    });

    // java.io.InputStream
    this.createSystemClass("java/io/InputStream", "java/lang/Object", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "read", descriptor: "()I", accessFlags: 0x0001 },
        { name: "read", descriptor: "([B)I", accessFlags: 0x0001 },
        { name: "read", descriptor: "([BII)I", accessFlags: 0x0001 },
        { name: "skip", descriptor: "(J)J", accessFlags: 0x0001 },
        { name: "available", descriptor: "()I", accessFlags: 0x0001 },
        { name: "close", descriptor: "()V", accessFlags: 0x0001 },
      ]
    });

    // java.io.ByteArrayInputStream
    this.createSystemClass("java/io/ByteArrayInputStream", "java/io/InputStream", [], {
      fields: [
        { name: "buf", descriptor: "[B", accessFlags: 0x0002 }, // protected
        { name: "pos", descriptor: "I", accessFlags: 0x0002 }, // protected
        { name: "count", descriptor: "I", accessFlags: 0x0002 }, // protected
      ],
      methods: [
        { name: "<init>", descriptor: "([B)V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "([BII)V", accessFlags: 0x0001 },
        { name: "read", descriptor: "()I", accessFlags: 0x0001 },
        { name: "read", descriptor: "([BII)I", accessFlags: 0x0001 },
        { name: "skip", descriptor: "(J)J", accessFlags: 0x0001 },
        { name: "available", descriptor: "()I", accessFlags: 0x0001 },
        { name: "reset", descriptor: "()V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.System
    this.createSystemClass("java/lang/System", "java/lang/Object", [], {
      fields: [
        { name: "out", descriptor: "Ljava/io/PrintStream;", accessFlags: 0x0019 }, // public static final
        { name: "err", descriptor: "Ljava/io/PrintStream;", accessFlags: 0x0019 }, // public static final
        { name: "in", descriptor: "Ljava/io/InputStream;", accessFlags: 0x0019 }, // public static final
      ],
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0000 }, // private
        { name: "currentTimeMillis", descriptor: "()J", accessFlags: 0x0008 }, // public static
        { name: "arraycopy", descriptor: "(Ljava/lang/Object;ILjava/lang/Object;II)V", accessFlags: 0x0008 }, // public static
        { name: "getProperty", descriptor: "(Ljava/lang/String;)Ljava/lang/String;", accessFlags: 0x0008 }, // public static
      ]
    });

    // java.lang.Throwable
    this.createSystemClass("java/lang/Throwable", "java/lang/Object", ["java/io/Serializable"], {
      fields: [
        { name: "detailMessage", descriptor: "Ljava/lang/String;", accessFlags: 0x0002 }, // private
      ],
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
        { name: "getMessage", descriptor: "()Ljava/lang/String;", accessFlags: 0x0001 },
        { name: "toString", descriptor: "()Ljava/lang/String;", accessFlags: 0x0001 },
        { name: "printStackTrace", descriptor: "()V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.Exception
    this.createSystemClass("java/lang/Exception", "java/lang/Throwable", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.RuntimeException
    this.createSystemClass("java/lang/RuntimeException", "java/lang/Exception", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.NullPointerException
    this.createSystemClass("java/lang/NullPointerException", "java/lang/RuntimeException", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.ArrayIndexOutOfBoundsException
    this.createSystemClass("java/lang/ArrayIndexOutOfBoundsException", "java/lang/RuntimeException", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.ClassCastException
    this.createSystemClass("java/lang/ClassCastException", "java/lang/RuntimeException", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.ArithmeticException
    this.createSystemClass("java/lang/ArithmeticException", "java/lang/RuntimeException", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });

    // java.lang.IllegalMonitorStateException
    this.createSystemClass("java/lang/IllegalMonitorStateException", "java/lang/RuntimeException", [], {
      methods: [
        { name: "<init>", descriptor: "()V", accessFlags: 0x0001 },
        { name: "<init>", descriptor: "(Ljava/lang/String;)V", accessFlags: 0x0001 },
      ]
    });
  }

  /**
   * 创建系统类
   * @param className 类名（内部名称格式，如 java/lang/Object）
   * @param superClass 父类名
   * @param interfaces 实现的接口列表
   * @param members 类成员（字段和方法）
   */
  private createSystemClass(
    className: string,
    superClass: string | null,
    interfaces: string[] = [],
    members: {
      fields?: Array<{ name: string; descriptor: string; accessFlags: number }>;
      methods?: Array<{ name: string; descriptor: string; accessFlags: number }>;
    } = {}
  ): void {
    const classInfo = {
      thisClass: className,
      superClass: superClass,
      interfaces: interfaces,
      accessFlags: 0x0001, // public
      fields: members.fields || [],
      methods: members.methods || [],
      constantPool: {
        getSize: () => 0,
        resolve: () => { throw new Error("System class constant pool not implemented"); }
      },
      isPublic: () => true,
      isFinal: () => false,
      isInterface: () => false,
      isAbstract: () => false,
      isStatic: () => false,
      getJavaVersion: () => "1.1",
      getInstanceFields: function(this: any) {
        return this.fields.filter((f: any) => (f.accessFlags & 0x0008) === 0); // 非 static
      },
      getStaticFields: function(this: any) {
        return this.fields.filter((f: any) => (f.accessFlags & 0x0008) !== 0); // static
      },
      getMethod: function(this: any, name: string, descriptor: string) {
        return this.methods.find((m: any) => m.name === name && m.descriptor === descriptor) || null;
      },
      getField: function(this: any, name: string, descriptor: string) {
        return this.fields.find((f: any) => f.name === name && f.descriptor === descriptor) || null;
      }
    } as unknown as ClassInfo;

    this.systemClasses.set(className, classInfo);
  }

  /**
   * 读取类文件字节
   * @param className 类的内部名称（如 java/lang/String）
   * @returns Class 文件的字节数组，系统类返回 null（因为已经缓存了 ClassInfo）
   */
  readClass(className: string): Uint8Array | null {
    // 系统类不需要从文件读取，直接返回 null
    // ClassLoader 会检测到返回 null，然后从缓存中获取 ClassInfo
    return null;
  }

  /**
   * 获取系统类
   * @param className 类的内部名称
   * @returns 系统类的 ClassInfo，如果不存在则返回 undefined
   */
  getSystemClass(className: string): ClassInfo | undefined {
    return this.systemClasses.get(className);
  }

  /**
   * 检查是否是系统类
   * @param className 类的内部名称
   * @returns 是否是系统类
   */
  isSystemClass(className: string): boolean {
    return this.systemClasses.has(className);
  }

  /**
   * 获取所有系统类名称
   * @returns 系统类名称列表
   */
  getAllSystemClassNames(): string[] {
    return Array.from(this.systemClasses.keys());
  }
}