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

import { NativeRegistry } from "../../../vm-core/native/native-registry";
import { JavaObject } from "../../../vm-core/runtime/object";
import { ClassInfo } from "../../../vm-core/classfile/class-info";

/**
 * java.lang.Class 的运行时表示
 * 表示 Java 类的反射对象
 */
export class JavaClass extends JavaObject {
  readonly representedClass: ClassInfo;

  constructor(classInfo: ClassInfo) {
    // 创建 JavaObject，classInfo 应该是 java.lang.Class 的 ClassInfo
    // 但实际上我们这里简化处理，直接传入 representedClass
    super(classInfo as any);
    this.representedClass = classInfo;
  }

  /**
   * 获取类的全限定名
   */
  getName(): string {
    return this.representedClass.thisClass;
  }

  /**
   * 获取父类的 Class 对象
   */
  getSuperclass(): JavaClass | null {
    if (!this.representedClass.superClass) {
      return null; // Object 类没有父类
    }
    
    // TODO: 这里需要从类加载器获取父类的 ClassInfo，然后创建 JavaClass
    // 暂时返回 null
    return null;
  }

  /**
   * 判断是否为接口
   */
  isInterface(): boolean {
    return this.representedClass.isInterface();
  }

  /**
   * 判断是否为数组
   */
  isArray(): boolean {
    return this.representedClass.thisClass.startsWith("[");
  }

  /**
   * 获取简单类名
   */
  getSimpleName(): string {
    return this.representedClass.getSimpleName();
  }
}

/**
 * 注册 java.lang.Class 的 Native 方法
 */
export function registerClassNatives(): void {
  const className = "java/lang/Class";

  // public native String getName();
  NativeRegistry.register(className, "getName", "()Ljava/lang/String;", (frame, thread) => {
    const thisObj = frame.getLocal(0) as JavaClass;
    if (!thisObj) {
      throw new Error("NullPointerException");
    }
    
    const name = thisObj.getName();
    // TODO: 需要创建 JavaString 对象
    // 目前暂时返回原生字符串
    frame.stack.push(name as any);
  });

  // public native Class getSuperclass();
  NativeRegistry.register(className, "getSuperclass", "()Ljava/lang/Class;", (frame, thread) => {
    const thisObj = frame.getLocal(0) as JavaClass;
    if (!thisObj) {
      throw new Error("NullPointerException");
    }
    
    const superClass = thisObj.getSuperclass();
    frame.stack.push(superClass);
  });

  // public native boolean isInterface();
  NativeRegistry.register(className, "isInterface", "()Z", (frame, thread) => {
    const thisObj = frame.getLocal(0) as JavaClass;
    if (!thisObj) {
      throw new Error("NullPointerException");
    }
    
    frame.stack.push(thisObj.isInterface() ? 1 : 0);
  });

  // public native boolean isArray();
  NativeRegistry.register(className, "isArray", "()Z", (frame, thread) => {
    const thisObj = frame.getLocal(0) as JavaClass;
    if (!thisObj) {
      throw new Error("NullPointerException");
    }
    
    frame.stack.push(thisObj.isArray() ? 1 : 0);
  });
}
