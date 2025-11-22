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

import { Image } from './Image';
import { Font } from './Font';

/**
 * Graphics - LCDUI 图形绘制 API
 * 
 * 提供 J2ME 标准的图形绘制接口,内部使用 HTML5 Canvas 2D API 实现。
 * 坐标系统:左上角为原点 (0, 0)
 * 颜色格式:0xRRGGBB
 */
export class Graphics {
  // 锚点常量
  public static readonly LEFT = 4;
  public static readonly RIGHT = 8;
  public static readonly TOP = 16;
  public static readonly BOTTOM = 32;
  public static readonly HCENTER = 1;
  public static readonly VCENTER = 2;
  public static readonly BASELINE = 64;

  // 变换常量 (Sprite 变换)
  public static readonly TRANS_NONE = 0;
  public static readonly TRANS_ROT90 = 5;
  public static readonly TRANS_ROT180 = 3;
  public static readonly TRANS_ROT270 = 6;
  public static readonly TRANS_MIRROR = 2;
  public static readonly TRANS_MIRROR_ROT90 = 7;
  public static readonly TRANS_MIRROR_ROT180 = 1;
  public static readonly TRANS_MIRROR_ROT270 = 4;

  // 线条样式
  public static readonly SOLID = 0;
  public static readonly DOTTED = 1;

  private ctx: CanvasRenderingContext2D;
  private color: number = 0x000000; // 默认黑色
  private font: Font;
  private translateX: number = 0;
  private translateY: number = 0;
  private clipX: number = 0;
  private clipY: number = 0;
  private clipWidth: number;
  private clipHeight: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.clipWidth = width;
    this.clipHeight = height;
    this.font = Font.getDefaultFont();
    
    // 初始化 Canvas 状态
    this.ctx.save();
    this.updateFont();
  }

  /**
   * 设置颜色 (RGB 分量)
   */
  public setColor(red: number, green: number, blue: number): void {
    this.color = ((red & 0xFF) << 16) | ((green & 0xFF) << 8) | (blue & 0xFF);
    this.updateCanvasColor();
  }

  /**
   * 设置颜色 (0xRRGGBB 格式)
   */
  public setColorRGB(rgb: number): void {
    this.color = rgb & 0xFFFFFF;
    this.updateCanvasColor();
  }

  /**
   * 获取当前颜色
   */
  public getColor(): number {
    return this.color;
  }

  /**
   * 更新 Canvas 的颜色
   */
  private updateCanvasColor(): void {
    const r = (this.color >> 16) & 0xFF;
    const g = (this.color >> 8) & 0xFF;
    const b = this.color & 0xFF;
    const colorStr = `rgb(${r},${g},${b})`;
    this.ctx.fillStyle = colorStr;
    this.ctx.strokeStyle = colorStr;
  }

  /**
   * 设置字体
   */
  public setFont(font: Font): void {
    if (font) {
      this.font = font;
      this.updateFont();
    }
  }

  /**
   * 获取当前字体
   */
  public getFont(): Font {
    return this.font;
  }

  /**
   * 更新 Canvas 字体
   */
  private updateFont(): void {
    if (this.font) {
      this.ctx.font = this.font._toCSS();
    }
  }

  /**
   * 平移坐标系
   */
  public translate(x: number, y: number): void {
    this.translateX += x;
    this.translateY += y;
    this.ctx.translate(x, y);
  }

  /**
   * 获取平移 X
   */
  public getTranslateX(): number {
    return this.translateX;
  }

  /**
   * 获取平移 Y
   */
  public getTranslateY(): number {
    return this.translateY;
  }

  /**
   * 设置裁剪区域
   */
  public setClip(x: number, y: number, width: number, height: number): void {
    this.clipX = x;
    this.clipY = y;
    this.clipWidth = width;
    this.clipHeight = height;
    
    this.ctx.restore();
    this.ctx.save();
    
    // 恢复当前的变换
    this.ctx.translate(this.translateX, this.translateY);
    
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.clip();
    
    // 恢复状态
    this.updateCanvasColor();
    this.updateFont();
  }

  /**
   * 获取裁剪区域 X
   */
  public getClipX(): number {
    return this.clipX;
  }

  /**
   * 获取裁剪区域 Y
   */
  public getClipY(): number {
    return this.clipY;
  }

  /**
   * 获取裁剪区域宽度
   */
  public getClipWidth(): number {
    return this.clipWidth;
  }

  /**
   * 获取裁剪区域高度
   */
  public getClipHeight(): number {
    return this.clipHeight;
  }

  /**
   * 绘制线段
   */
  public drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
    this.ctx.stroke();
  }

  /**
   * 绘制矩形边框
   */
  public drawRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeRect(x + 0.5, y + 0.5, width, height);
  }

  /**
   * 填充矩形
   */
  public fillRect(x: number, y: number, width: number, height: number): void {
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * 绘制圆角矩形边框
   */
  public drawRoundRect(x: number, y: number, width: number, height: number, arcWidth: number, arcHeight: number): void {
    const radiusX = arcWidth / 2;
    const radiusY = arcHeight / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + radiusX, y);
    this.ctx.lineTo(x + width - radiusX, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radiusY);
    this.ctx.lineTo(x + width, y + height - radiusY);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radiusX, y + height);
    this.ctx.lineTo(x + radiusX, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radiusY);
    this.ctx.lineTo(x, y + radiusY);
    this.ctx.quadraticCurveTo(x, y, x + radiusX, y);
    this.ctx.stroke();
  }

  /**
   * 填充圆角矩形
   */
  public fillRoundRect(x: number, y: number, width: number, height: number, arcWidth: number, arcHeight: number): void {
    const radiusX = arcWidth / 2;
    const radiusY = arcHeight / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + radiusX, y);
    this.ctx.lineTo(x + width - radiusX, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radiusY);
    this.ctx.lineTo(x + width, y + height - radiusY);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radiusX, y + height);
    this.ctx.lineTo(x + radiusX, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radiusY);
    this.ctx.lineTo(x, y + radiusY);
    this.ctx.quadraticCurveTo(x, y, x + radiusX, y);
    this.ctx.fill();
  }

  /**
   * 绘制圆弧
   */
  public drawArc(x: number, y: number, width: number, height: number, startAngle: number, arcAngle: number): void {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    const startRad = -startAngle * Math.PI / 180;
    const endRad = -(startAngle + arcAngle) * Math.PI / 180;
    
    this.ctx.beginPath();
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startRad, endRad, arcAngle < 0);
    this.ctx.stroke();
  }

  /**
   * 填充圆弧
   */
  public fillArc(x: number, y: number, width: number, height: number, startAngle: number, arcAngle: number): void {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    const startRad = -startAngle * Math.PI / 180;
    const endRad = -(startAngle + arcAngle) * Math.PI / 180;
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startRad, endRad, arcAngle < 0);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * 绘制字符串
   */
  public drawString(str: string, x: number, y: number, anchor: number): void {
    const pos = this.calculateAnchorPosition(str, x, y, anchor);
    this.ctx.fillText(str, pos.x, pos.y);
    
    // 处理下划线
    if (this.font.isUnderlined()) {
        const width = this.font.stringWidth(str);
        const height = this.font.getHeight();
        // 简单的下划线实现
        this.ctx.fillRect(pos.x, pos.y + height - 2, width, 1);
    }
  }

  /**
   * 绘制子字符串
   */
  public drawSubstring(str: string, offset: number, len: number, x: number, y: number, anchor: number): void {
    const substr = str.substring(offset, offset + len);
    this.drawString(substr, x, y, anchor);
  }

  /**
   * 绘制字符
   */
  public drawChar(char: string, x: number, y: number, anchor: number): void {
    this.drawString(char, x, y, anchor);
  }

  /**
   * 绘制字符数组
   */
  public drawChars(chars: string[], offset: number, length: number, x: number, y: number, anchor: number): void {
    const str = chars.slice(offset, offset + length).join('');
    this.drawString(str, x, y, anchor);
  }

  /**
   * 计算锚点位置
   */
  private calculateAnchorPosition(str: string, x: number, y: number, anchor: number): { x: number; y: number } {
    let posX = x;
    let posY = y;

    // 水平对齐
    if (anchor & Graphics.HCENTER) {
      this.ctx.textAlign = 'center';
    } else if (anchor & Graphics.RIGHT) {
      this.ctx.textAlign = 'right';
    } else {
      this.ctx.textAlign = 'left';
    }

    // 垂直对齐
    if (anchor & Graphics.VCENTER) {
      this.ctx.textBaseline = 'middle';
    } else if (anchor & Graphics.BOTTOM) {
      this.ctx.textBaseline = 'bottom';
    } else if (anchor & Graphics.BASELINE) {
      this.ctx.textBaseline = 'alphabetic';
    } else {
      this.ctx.textBaseline = 'top';
    }

    return { x: posX, y: posY };
  }

  /**
   * 绘制图像
   */
  public drawImage(image: Image, x: number, y: number, anchor: number): void {
    if (!image) return;
    
    const imgElement = image._getElement();
    const width = image.getWidth();
    const height = image.getHeight();
    
    let dx = x;
    let dy = y;

    // 计算锚点
    if (anchor & Graphics.HCENTER) {
        dx -= width / 2;
    } else if (anchor & Graphics.RIGHT) {
        dx -= width;
    }

    if (anchor & Graphics.VCENTER) {
        dy -= height / 2;
    } else if (anchor & Graphics.BOTTOM) {
        dy -= height;
    }

    this.ctx.drawImage(imgElement, dx, dy);
  }

  /**
   * 绘制区域图像 (支持变换)
   */
  public drawRegion(image: Image, srcX: number, srcY: number, srcWidth: number, srcHeight: number, 
                    transform: number, dstX: number, dstY: number, anchor: number): void {
    if (!image) return;

    const imgElement = image._getElement();

    // 1. 计算变换后的尺寸 (用于锚点计算)
    let transWidth = srcWidth;
    let transHeight = srcHeight;
    if (transform === Graphics.TRANS_ROT90 || transform === Graphics.TRANS_ROT270 ||
        transform === Graphics.TRANS_MIRROR_ROT90 || transform === Graphics.TRANS_MIRROR_ROT270) {
        transWidth = srcHeight;
        transHeight = srcWidth;
    }

    // 2. 计算目标绘制起点 (基于锚点)
    let dx = dstX;
    let dy = dstY;

    if (anchor & Graphics.HCENTER) {
        dx -= transWidth / 2;
    } else if (anchor & Graphics.RIGHT) {
        dx -= transWidth;
    }

    if (anchor & Graphics.VCENTER) {
        dy -= transHeight / 2;
    } else if (anchor & Graphics.BOTTOM) {
        dy -= transHeight;
    }

    // 3. 保存状态并应用变换
    this.ctx.save();

    // 移动到目标位置中心
    this.ctx.translate(dx + transWidth / 2, dy + transHeight / 2);

    // 应用变换矩阵
    switch (transform) {
        case Graphics.TRANS_ROT90:
            this.ctx.rotate(Math.PI / 2);
            break;
        case Graphics.TRANS_ROT180:
            this.ctx.rotate(Math.PI);
            break;
        case Graphics.TRANS_ROT270:
            this.ctx.rotate(-Math.PI / 2);
            break;
        case Graphics.TRANS_MIRROR:
            this.ctx.scale(-1, 1);
            break;
        case Graphics.TRANS_MIRROR_ROT90:
            this.ctx.scale(-1, 1);
            this.ctx.rotate(Math.PI / 2);
            break;
        case Graphics.TRANS_MIRROR_ROT180:
            this.ctx.scale(-1, 1);
            this.ctx.rotate(Math.PI);
            break;
        case Graphics.TRANS_MIRROR_ROT270:
            this.ctx.scale(-1, 1);
            this.ctx.rotate(-Math.PI / 2);
            break;
    }

    // 4. 绘制图像 (注意: 此时坐标系原点在目标中心，所以要偏移回左上角)
    // 这里的偏移是相对于源图像的尺寸
    this.ctx.drawImage(imgElement, srcX, srcY, srcWidth, srcHeight, -srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);

    // 5. 恢复状态
    this.ctx.restore();
  }

  /**
   * 填充三角形
   */
  public fillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * 复制区域
   */
  public copyArea(x: number, y: number, width: number, height: number, dx: number, dy: number, anchor: number): void {
    const imageData = this.ctx.getImageData(x, y, width, height);
    this.ctx.putImageData(imageData, x + dx, y + dy);
  }

  /**
   * 释放资源
   */
  public dispose(): void {
    this.ctx.restore();
  }
}
