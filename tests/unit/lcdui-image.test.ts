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

import { Image, Font, Graphics } from '../../src/game-modules/stdlib/javax.microedition/lcdui';

/**
 * 测试 Image 和 Font 类
 */
function runTest() {
  console.log('=== LCDUI Image & Font 测试 ===\n');

  // 1. 测试 Image 创建 (可变)
  console.log('1. 测试 Image 创建 (可变)');
  try {
    const img = Image.createImage(100, 50);
    console.log(`   创建成功: ${img.getWidth() === 100 && img.getHeight() === 50 ? '✅' : '❌'}`);
    console.log(`   是可变图像: ${img.isMutable() ? '✅' : '❌'}`);
    
    const g = img.getGraphics();
    console.log(`   获取 Graphics: ${g ? '✅' : '❌'}`);
    
    // 简单绘图测试 (不报错即可)
    g.setColor(255, 0, 0);
    g.fillRect(0, 0, 100, 50);
    console.log('   绘图操作: ✅');
  } catch (e) {
    console.log(`   ❌ 失败: ${e}`);
  }

  // 2. 测试 Image 创建 (不可变 - 模拟)
  console.log('\n2. 测试 Image 创建 (不可变)');
  try {
    const img = Image.createImageFromPath('test.png');
    console.log(`   创建成功: ${img ? '✅' : '❌'}`);
    console.log(`   是不可变图像: ${!img.isMutable() ? '✅' : '❌'}`);
    
    try {
        img.getGraphics();
        console.log('   获取 Graphics (应失败): ❌');
    } catch (e) {
        console.log('   获取 Graphics (应失败): ✅');
    }
  } catch (e) {
    console.log(`   ❌ 失败: ${e}`);
  }

  // 3. 测试 Font
  console.log('\n3. 测试 Font');
  const font = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_BOLD | Font.STYLE_ITALIC, Font.SIZE_LARGE);
  console.log(`   Font 创建: ${font ? '✅' : '❌'}`);
  console.log(`   Is Bold: ${font.isBold() ? '✅' : '❌'}`);
  console.log(`   Is Italic: ${font.isItalic() ? '✅' : '❌'}`);
  console.log(`   Size: ${font.getSize() === Font.SIZE_LARGE ? '✅' : '❌'}`);
  
  const defaultFont = Font.getDefaultFont();
  console.log(`   Default Font: ${defaultFont ? '✅' : '❌'}`);
  
  // 文本测量 (Node 环境下是估算值)
  const width = font.stringWidth("Hello");
  console.log(`   stringWidth("Hello"): ${width} (Node环境估算)`);
  console.log(`   getHeight(): ${font.getHeight()}`);
  console.log(`   getBaselinePosition(): ${font.getBaselinePosition()}`);

  console.log('\n✅ Image & Font 单元测试完成');
}

runTest();
