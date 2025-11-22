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
import { Context } from "../../context/Context";
import { InputStream } from "../java.io/InputStream";
import { ByteArrayInputStream } from "../java.io/ByteArrayInputStream";

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

  /**
   * 获取资源流
   */
  getResourceAsStream(name: string): InputStream | null {
    const loader = Context.getInstance().getJarLoader();
    
    // 处理路径: 
    // 如果以 / 开头，则是绝对路径
    // 否则相对于当前类的包路径
    let path = name;
    if (name.startsWith('/')) {
        path = name.substring(1);
    } else {
        // 相对路径处理
        // 获取当前类的包名，替换 . 为 /
        const className = this.getName();
        const lastDot = className.lastIndexOf('.'); // 注意: 内部类名可能是 / 分隔
        const lastSlash = className.lastIndexOf('/');
        
        let pkg = "";
        if (lastSlash >= 0) {
            pkg = className.substring(0, lastSlash + 1);
        }
        path = pkg + name;
    }

    const data = loader.getFile(path);
    if (data) {
        return new ByteArrayInputStream(data);
    }
    return null;
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

  // public InputStream getResourceAsStream(String name);
  NativeRegistry.register(className, "getResourceAsStream", "(Ljava/lang/String;)Ljava/io/InputStream;", (frame, thread) => {
    const thisObj = frame.getLocal(0) as JavaClass;
    const nameObj = frame.getLocal(1); // String object
    
    if (!thisObj) {
      throw new Error("NullPointerException");
    }
    
    // TODO: 从 String 对象获取字符串值
    // 暂时假设 nameObj 就是 string (仅用于测试)
    // 实际应该调用 StringUtils.getStringValue(nameObj)
    const name = nameObj as unknown as string; 
    
    const stream = thisObj.getResourceAsStream(name);
    
    // 这里需要返回 InputStream 的 JavaObject 包装
    // 但目前我们还没有 InputStream 的 Java 类定义和包装逻辑
    // 所以这里会有一个类型不匹配的问题。
    // 暂时返回 null 或者抛出未实现异常
    // 为了打通流程，我们假设 stream 就是 JavaObject (这在 TS 层面是不对的，但在 JS 运行时可能混过去)
    
    // 正确做法:
    // 1. 创建 java.io.ByteArrayInputStream 的 ClassInfo
    // 2. 创建 JavaObject 实例
    // 3. 将 TS 的 InputStream 实例关联到 JavaObject (作为 native 句柄)
    
    console.warn("getResourceAsStream called but JavaObject wrapping is not implemented yet.");
    frame.stack.push(null); 
  });
}
