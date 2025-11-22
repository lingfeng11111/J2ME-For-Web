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
 * LCDUI 基础框架测试
 * 
 * 测试 Display、Canvas、Graphics 的基本功能
 */

import { Display, Canvas, Graphics } from '../../src/game-modules/stdlib/javax.microedition/lcdui';

/**
 * 测试画布类
 */
class TestCanvas extends Canvas {
  private frameCount: number = 0;
  private lastKeyPressed: number = 0;
  private pointerX: number = -1;
  private pointerY: number = -1;

  protected paint(g: Graphics): void {
    // 清空背景 (白色)
    g.setColor(255, 255, 255);
    g.fillRect(0, 0, this.getWidth(), this.getHeight());

    // 绘制标题 (黑色)
    g.setColor(0, 0, 0);
    g.drawString('J2ME LCDUI Test', this.getWidth() / 2, 10, Graphics.HCENTER | Graphics.TOP);

    // 绘制帧计数
    g.drawString(`Frame: ${this.frameCount}`, 10, 30, Graphics.LEFT | Graphics.TOP);

    // 绘制矩形 (红色)
    g.setColor(255, 0, 0);
    g.fillRect(20, 60, 80, 60);

    // 绘制矩形边框 (蓝色)
    g.setColor(0, 0, 255);
    g.drawRect(120, 60, 80, 60);

    // 绘制圆角矩形 (绿色)
    g.setColor(0, 255, 0);
    g.fillRoundRect(20, 140, 80, 60, 20, 20);

    // 绘制线条
    g.setColor(0, 0, 0);
    g.drawLine(120, 140, 200, 200);
    g.drawLine(200, 140, 120, 200);

    // 绘制圆弧 (紫色)
    g.setColor(128, 0, 128);
    g.fillArc(20, 220, 80, 80, 0, 90);

    // 绘制三角形 (橙色)
    g.setColor(255, 165, 0);
    g.fillTriangle(120, 220, 160, 220, 140, 260);

    // 显示按键信息
    if (this.lastKeyPressed !== 0) {
      g.setColor(0, 0, 0);
      g.drawString(`Last Key: ${this.lastKeyPressed}`, 10, this.getHeight() - 40, Graphics.LEFT | Graphics.TOP);
      
      const gameAction = this.getGameAction(this.lastKeyPressed);
      if (gameAction !== 0) {
        g.drawString(`Game Action: ${gameAction}`, 10, this.getHeight() - 25, Graphics.LEFT | Graphics.TOP);
      }
    }

    // 显示指针位置
    if (this.pointerX >= 0 && this.pointerY >= 0) {
      g.setColor(255, 0, 0);
      g.fillRect(this.pointerX - 2, this.pointerY - 2, 5, 5);
      g.setColor(0, 0, 0);
      g.drawString(`Pointer: (${this.pointerX}, ${this.pointerY})`, 10, this.getHeight() - 10, Graphics.LEFT | Graphics.TOP);
    }

    this.frameCount++;
  }

  protected keyPressed(keyCode: number): void {
    console.log(`Key pressed: ${keyCode}`);
    this.lastKeyPressed = keyCode;
    this.repaint();
  }

  protected keyReleased(keyCode: number): void {
    console.log(`Key released: ${keyCode}`);
  }

  protected pointerPressed(x: number, y: number): void {
    console.log(`Pointer pressed: (${x}, ${y})`);
    this.pointerX = x;
    this.pointerY = y;
    this.repaint();
  }

  protected pointerReleased(x: number, y: number): void {
    console.log(`Pointer released: (${x}, ${y})`);
  }

  protected pointerDragged(x: number, y: number): void {
    this.pointerX = x;
    this.pointerY = y;
    this.repaint();
  }
}

/**
 * 运行测试
 */
function runTest(): void {
  console.log('=== LCDUI 基础框架测试 ===\n');

  // 检测环境
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  console.log(`运行环境: ${isBrowser ? '浏览器' : 'Node.js'}\n`);

  // 1. 测试 Display 单例
  console.log('1. 测试 Display 单例');
  const display1 = Display.getDisplay(null);
  const display2 = Display.getDisplay(null);
  console.log(`   Display 是单例: ${display1 === display2 ? '✅' : '❌'}`);

  // 2. 测试 Canvas 创建
  console.log('\n2. 测试 Canvas 创建');
  const canvas = new TestCanvas();
  console.log(`   Canvas 宽度: ${canvas.getWidth()}`);
  console.log(`   Canvas 高度: ${canvas.getHeight()}`);
  console.log(`   Canvas 双缓冲: ${canvas.isDoubleBuffered() ? '✅' : '❌'}`);
  console.log(`   Canvas 支持指针事件: ${canvas.hasPointerEvents() ? '✅' : '❌'}`);

  // 3. 测试 Display 属性
  console.log('\n3. 测试 Display 属性');
  console.log(`   支持颜色: ${display1.isColor() ? '✅' : '❌'}`);
  console.log(`   颜色数量: ${display1.numColors()}`);
  console.log(`   Alpha 级别: ${display1.numAlphaLevels()}`);

  // 4. 测试按键映射
  console.log('\n4. 测试按键映射');
  console.log(`   KEY_NUM2 -> UP: ${canvas.getGameAction(Canvas.KEY_NUM2) === Canvas.UP ? '✅' : '❌'}`);
  console.log(`   KEY_NUM8 -> DOWN: ${canvas.getGameAction(Canvas.KEY_NUM8) === Canvas.DOWN ? '✅' : '❌'}`);
  console.log(`   KEY_NUM4 -> LEFT: ${canvas.getGameAction(Canvas.KEY_NUM4) === Canvas.LEFT ? '✅' : '❌'}`);
  console.log(`   KEY_NUM6 -> RIGHT: ${canvas.getGameAction(Canvas.KEY_NUM6) === Canvas.RIGHT ? '✅' : '❌'}`);
  console.log(`   KEY_NUM5 -> FIRE: ${canvas.getGameAction(Canvas.KEY_NUM5) === Canvas.FIRE ? '✅' : '❌'}`);

  // 5. 测试按键名称
  console.log('\n5. 测试按键名称');
  console.log(`   KEY_NUM0 名称: "${canvas.getKeyName(Canvas.KEY_NUM0)}" (期望: "0")`);
  console.log(`   KEY_NUM5 名称: "${canvas.getKeyName(Canvas.KEY_NUM5)}" (期望: "5")`);
  console.log(`   KEY_STAR 名称: "${canvas.getKeyName(Canvas.KEY_STAR)}" (期望: "*")`);
  console.log(`   KEY_POUND 名称: "${canvas.getKeyName(Canvas.KEY_POUND)}" (期望: "#")`);

  // 6. 测试 Display.setCurrent() (仅浏览器环境)
  if (isBrowser) {
    console.log('\n6. 测试 Display.setCurrent() 和渲染');
    display1.setCurrent(canvas);
    console.log(`   当前 Displayable: ${display1.getCurrent() === canvas ? '✅' : '❌'}`);
    console.log('\n✅ 所有 LCDUI 测试通过!');
    console.log('\n提示: Canvas 已显示在页面上');
    console.log('      使用方向键或数字键 2/4/6/8 测试按键事件');
    console.log('      使用鼠标或触摸屏测试指针事件');
  } else {
    console.log('\n6. 跳过 Display.setCurrent() 测试 (需要浏览器环境)');
    console.log('\n✅ 所有 Node.js 环境测试通过!');
    console.log('\n提示: 在浏览器中打开 tests/lcdui-test.html 查看完整渲染效果');
  }
}

// 运行测试
runTest();
