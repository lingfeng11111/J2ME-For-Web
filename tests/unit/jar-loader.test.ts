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

import * as fs from 'fs';
import * as path from 'path';
import { JarLoader } from '../../src/game-modules/loader/JarLoader';
import { Context } from '../../src/game-modules/context/Context';
import { Image } from '../../src/game-modules/graphics/Image';
import { Launcher } from '../../src/game-modules/launcher/Launcher';

/**
 * 测试 JarLoader 加载真实 JAR 文件
 */
async function runTest() {
  console.log('=== JarLoader 集成测试 ===\n');

  const jarPath = path.resolve(__dirname, '../../../tests/integration/魔兽争霸3.jar');
  console.log(`Loading JAR: ${jarPath}`);

  if (!fs.existsSync(jarPath)) {
    console.error('❌ Test JAR not found!');
    return;
  }

  try {
    // 读取文件 Buffer
    const buffer = fs.readFileSync(jarPath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    // 初始化 Loader
    const loader = new JarLoader();
    await loader.loadJar(arrayBuffer);

    console.log('✅ JAR Loaded successfully');

    // 1. 检查 MANIFEST.MF
    const manifestPath = 'META-INF/MANIFEST.MF';
    if (loader.fileExists(manifestPath)) {
        console.log(`✅ Found ${manifestPath}`);
        const content = loader.getFile(manifestPath);
        if (content) {
            const text = new TextDecoder().decode(content);
            console.log('--- Manifest Content (First 5 lines) ---');
            console.log(text.split('\n').slice(0, 5).join('\n'));
            console.log('----------------------------------------');
        }
    } else {
        console.error(`❌ ${manifestPath} not found!`);
    }
    
    // 3. 检查图片资源 (根据 Manifest 读取)
    const iconPath = '/icons/ico.png';
    if (loader.fileExists(iconPath)) {
        console.log(`✅ Found ${iconPath}`);
        const img = loader.loadImage(iconPath);
        console.log(`   Image object created: ${img ? '✅' : '❌'}`);
        if (img) {
            console.log(`   Image size: ${img.getWidth()}x${img.getHeight()}`);
        }

        // 4. 测试 Context 集成
        console.log('\n4. 测试 Context 集成');
        Context.getInstance().setJarLoader(loader);
        
        // 6. 测试 Launcher
        console.log('\n6. 测试 Launcher');
        const launcher = new Launcher({
            jarData: arrayBuffer
        });
        
        await launcher.load();
        const mainClass = launcher.getMainClassName();
        console.log(`   Main Class detected: ${mainClass}`);
        
        // 尝试启动 (加载主类)
        // 我们期望它能找到并加载主类，但可能会因为缺少父类(MIDlet)或其他依赖而失败
        // 或者因为 ClassLoader 还不完善
        try {
            launcher.start();
        } catch (e: any) {
            console.log(`   Launcher start result: ${e.message}`);
        }
    } else {
        console.log(`⚠️ ${iconPath} not found`);
    }

  } catch (e) {
    console.error('❌ Failed:', e);
  }
}

runTest();
