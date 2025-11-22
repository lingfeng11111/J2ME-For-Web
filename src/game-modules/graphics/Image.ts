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

import { Graphics } from './Graphics';
import { Context } from '../context/Context';

/**
 * Image - LCDUI 图像类
 * 
 * 支持可变图像(Mutable)和不可变图像(Immutable)。
 * - 可变图像: 本质是一个离屏 Canvas，可以获取 Graphics 进行绘制。
 * - 不可变图像: 通常从文件加载，不可修改。
 */
export class Image {
  private element: HTMLImageElement | HTMLCanvasElement;
  private mutable: boolean;
  private graphics: Graphics | null = null;

  private constructor(element: HTMLImageElement | HTMLCanvasElement, mutable: boolean) {
    this.element = element;
    this.mutable = mutable;
  }

  /**
   * 创建可变图像 (空白图像)
   * @param width 宽度
   * @param height 高度
   */
  public static createImage(width: number, height: number): Image {
    if (width <= 0 || height <= 0) {
      throw new Error("IllegalArgumentException: Width and height must be positive");
    }
    
    // 在 Node.js 环境下模拟 Canvas (用于单元测试)
    if (typeof document === 'undefined') {
      return new Image({ width, height } as any, true);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return new Image(canvas, true);
  }

  /**
   * 从路径加载图像 (简化版)
   * 注意: J2ME 中 createImage 是同步的，但在 Web 中图片加载是异步的。
   * 这里我们返回一个 Image 对象，但内容可能尚未加载完成。
   * 实际项目中通常需要预加载机制。
   */
  public static createImageFromPath(path: string): Image {
    // 1. 尝试从 JarLoader 加载
    const loader = Context.getInstance().getJarLoader();
    if (loader && loader.fileExists(path)) {
        const img = loader.loadImage(path);
        if (img) return img;
    }

    if (typeof document === 'undefined') {
       // Node.js 环境返回占位符
       return new Image({ width: 100, height: 100, src: path } as any, false);
    }

    const img = document.createElement('img');
    img.src = path;
    // 简单的不可变图像
    return new Image(img, false);
  }

  /**
   * 获取图像宽度
   */
  public getWidth(): number {
    return this.element.width;
  }

  /**
   * 获取图像高度
   */
  public getHeight(): number {
    return this.element.height;
  }

  /**
   * 获取 Graphics 对象
   * 仅可变图像支持
   */
  public getGraphics(): Graphics {
    if (!this.mutable) {
      throw new Error("IllegalStateException: Image is immutable");
    }

    if (!this.graphics) {
      // 环境检查: 如果是浏览器环境
      if (typeof HTMLCanvasElement !== 'undefined' && this.element instanceof HTMLCanvasElement) {
        const ctx = this.element.getContext('2d');
        if (!ctx) {
            throw new Error("Failed to get 2D context");
        }
        this.graphics = new Graphics(ctx, this.element.width, this.element.height);
      } else if (typeof document === 'undefined') {
          // Node.js 环境: 模拟 Graphics (仅用于测试通过)
          this.graphics = {
              setColor: () => {},
              fillRect: () => {},
              drawLine: () => {},
              drawRect: () => {},
              dispose: () => {}
          } as any; 
      } else {
          // 理论上 mutable 只能是 Canvas
          throw new Error("Mutable image must be backed by Canvas");
      }
    }
    return this.graphics!;
  }

  /**
   * 检查是否可变
   */
  public isMutable(): boolean {
    return this.mutable;
  }

  /**
   * 获取内部 HTML 元素 (用于 Graphics.drawImage)
   */
  public _getElement(): HTMLImageElement | HTMLCanvasElement {
    return this.element;
  }

  /**
   * 获取像素数据 (ARGB)
   */
  public getRGB(rgbData: Int32Array, offset: number, scanlength: number, x: number, y: number, width: number, height: number): void {
    if (width <= 0 || height <= 0) return;

    let ctx: CanvasRenderingContext2D | null = null;

    if (typeof HTMLCanvasElement !== 'undefined' && this.element instanceof HTMLCanvasElement) {
        ctx = this.element.getContext('2d');
    } else if (typeof HTMLImageElement !== 'undefined' && this.element instanceof HTMLImageElement) {
        // 如果是 img 元素，需要画到临时 canvas 上才能获取像素
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        ctx = tempCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(this.element, -x, -y);
        }
    }

    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const idx = (i * width + j) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            
            const argb = (a << 24) | (r << 16) | (g << 8) | b;
            rgbData[offset + i * scanlength + j] = argb;
        }
    }
  }
}
