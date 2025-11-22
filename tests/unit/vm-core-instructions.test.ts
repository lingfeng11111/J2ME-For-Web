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
 * VM 核心指令测试
 * 测试系统类加载、对象创建和方法调用指令
 */

import * as fs from 'fs';
import * as path from 'path';
import { JarLoader } from '../../src/game-modules/loader/JarLoader';
import { JarClassPath } from '../../src/game-modules/loader/JarClassPath';
import { SystemClassPath } from '../../src/vm-core/classfile/system-class-path';
import { CompositeClassPath } from '../../src/vm-core/classfile/composite-class-path';
import { ClassLoader } from '../../src/vm-core/classfile/class-loader';
import { ClassInfo } from '../../src/vm-core/classfile/class-info';
import { JavaObject } from '../../src/vm-core/runtime/object';
import { Thread } from '../../src/vm-core/threading/thread';
import { Frame } from '../../src/vm-core/interpreter/frame';
import { initInstructions } from '../../src/vm-core/interpreter/instructions';
import { InstructionRegistry } from '../../src/vm-core/interpreter/instruction';
import { Opcode } from '../../src/vm-core/bytecode/opcodes';

// 初始化指令集
initInstructions();

console.log('=== VM 核心指令测试 ===\n');

// 测试 1: SystemClassPath 系统类加载
console.log('测试 1: SystemClassPath 系统类加载');
try {
  const systemPath = new SystemClassPath();
  
  // 测试加载 java.lang.Object
  const objectClass = systemPath.getSystemClass('java/lang/Object');
  console.log(`  ✅ java/lang/Object: ${objectClass ? '加载成功' : '加载失败'}`);
  if (objectClass) {
    console.log(`     - 类名: ${objectClass.thisClass}`);
    console.log(`     - 父类: ${objectClass.superClass || 'null'}`);
    console.log(`     - 方法数: ${objectClass.methods.length}`);
  }
  
  // 测试加载 javax.microedition.midlet.MIDlet
  const midletClass = systemPath.getSystemClass('javax/microedition/midlet/MIDlet');
  console.log(`  ✅ javax/microedition/midlet/MIDlet: ${midletClass ? '加载成功' : '加载失败'}`);
  if (midletClass) {
    console.log(`     - 类名: ${midletClass.thisClass}`);
    console.log(`     - 父类: ${midletClass.superClass}`);
    console.log(`     - 方法数: ${midletClass.methods.length}`);
    const startAppMethod = midletClass.getMethod('startApp', '()V');
    console.log(`     - startApp()V 方法: ${startAppMethod ? '找到' : '未找到'}`);
  }
  
  // 测试加载 java.lang.String
  const stringClass = systemPath.getSystemClass('java/lang/String');
  console.log(`  ✅ java/lang/String: ${stringClass ? '加载成功' : '加载失败'}`);
  if (stringClass) {
    console.log(`     - 类名: ${stringClass.thisClass}`);
    console.log(`     - 父类: ${stringClass.superClass}`);
    console.log(`     - 接口数: ${stringClass.interfaces.length}`);
  }
  
  console.log('');
} catch (e: any) {
  console.log(`  ❌ 测试失败: ${e.message}\n`);
}

// 测试 2: CompositeClassPath 组合类路径
console.log('测试 2: CompositeClassPath 组合类路径');
try {
  const systemPath = new SystemClassPath();
  const dummyLoader = new JarLoader();
  const dummyPath = new JarClassPath(dummyLoader);
  
  const compositePath = new CompositeClassPath(systemPath, dummyPath);
  
  // 测试系统类加载
  const data1 = compositePath.readClass('java/lang/Object');
  console.log(`  ✅ java/lang/Object 通过 CompositePath: ${data1 === null ? '返回 null（系统类）' : '返回数据'}`);
  
  // 测试类路径数量
  console.log(`  ✅ 类路径数量: ${compositePath.getClassPathCount()}`);
  
  console.log('');
} catch (e: any) {
  console.log(`  ❌ 测试失败: ${e.message}\n`);
}

// 测试 3: ClassLoader 系统类加载
console.log('测试 3: ClassLoader 系统类加载');
try {
  const systemPath = new SystemClassPath();
  const classLoader = new ClassLoader({ readClass: () => null }, systemPath);
  
  // 加载系统类
  const objectClass = classLoader.loadClass('java/lang/Object');
  console.log(`  ✅ 加载 java/lang/Object: ${objectClass.thisClass}`);
  
  const midletClass = classLoader.loadClass('javax/microedition/midlet/MIDlet');
  console.log(`  ✅ 加载 javax/microedition/midlet/MIDlet: ${midletClass.thisClass}`);
  console.log(`     - 父类: ${midletClass.superClass}`);
  
  // 验证缓存
  const cachedClass = classLoader.getClass('java/lang/Object');
  console.log(`  ✅ 从缓存获取: ${cachedClass === objectClass ? '成功' : '失败'}`);
  
  console.log('');
} catch (e: any) {
  console.log(`  ❌ 测试失败: ${e.message}\n`);
}

// 测试 4: JavaObject 对象创建
console.log('测试 4: JavaObject 对象创建');
try {
  const systemPath = new SystemClassPath();
  const classLoader = new ClassLoader({ readClass: () => null }, systemPath);
  
  // 加载类
  const objectClass = classLoader.loadClass('java/lang/Object');
  const midletClass = classLoader.loadClass('javax/microedition/midlet/MIDlet');
  
  // 创建对象
  const obj1 = new JavaObject(objectClass);
  console.log(`  ✅ 创建 java/lang/Object 实例: ID=${obj1.id}`);
  console.log(`     - 类信息: ${obj1.classInfo.thisClass}`);
  
  const obj2 = new JavaObject(midletClass);
  console.log(`  ✅ 创建 javax/microedition/midlet/MIDlet 实例: ID=${obj2.id}`);
  console.log(`     - 类信息: ${obj2.classInfo.thisClass}`);
  console.log(`     - 父类: ${obj2.classInfo.superClass}`);
  
  console.log('');
} catch (e: any) {
  console.log(`  ❌ 测试失败: ${e.message}\n`);
}

// 测试 5: 使用真实 JAR 测试 ClassLoader
console.log('测试 5: 使用真实 JAR 测试 ClassLoader');
try {
  const jarPath = path.resolve(__dirname, '../../tests/integration/魔兽争霸3.jar');
  
  if (fs.existsSync(jarPath)) {
    const buffer = fs.readFileSync(jarPath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    
    const jarLoader = new JarLoader();
    jarLoader.loadJar(arrayBuffer).then(() => {
      const jarClassPath = new JarClassPath(jarLoader);
      const systemPath = new SystemClassPath();
      const compositePath = new CompositeClassPath(systemPath, jarClassPath);
      
      const classLoader = new ClassLoader(compositePath);
      
      // 尝试加载系统类
      const objectClass = classLoader.loadClass('java/lang/Object');
      console.log(`  ✅ 从系统路径加载 java/lang/Object: ${objectClass.thisClass}`);
      
      // 尝试加载 JAR 中的类（如果存在）
      try {
        const testClass = classLoader.loadClass('tr'); // 从之前的测试知道主类是 tr
        console.log(`  ✅ 从 JAR 加载主类 tr: ${testClass.thisClass}`);
        console.log(`     - 父类: ${testClass.superClass}`);
      } catch (e: any) {
        console.log(`  ⚠️  加载 JAR 类失败（预期）: ${e.message}`);
      }
      
      console.log('');
      console.log('=== 所有测试完成 ===\n');
    }).catch(e => {
      console.log(`  ❌ JAR 加载失败: ${e.message}\n`);
      console.log('=== 所有测试完成 ===\n');
    });
  } else {
    console.log(`  ⚠️  测试 JAR 文件不存在: ${jarPath}`);
    console.log('');
    console.log('=== 所有测试完成 ===\n');
  }
} catch (e: any) {
  console.log(`  ❌ 测试失败: ${e.message}\n`);
  console.log('=== 所有测试完成 ===\n');
}

console.log('=== 所有测试完成 ===\n');