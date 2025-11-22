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
 * Font - LCDUI 字体类
 * 
 * 管理字体属性并提供文本测量功能。
 * 映射 J2ME 字体到 Web CSS 字体。
 */
export class Font {
  // 样式常量
  public static readonly STYLE_PLAIN = 0;
  public static readonly STYLE_BOLD = 1;
  public static readonly STYLE_ITALIC = 2;
  public static readonly STYLE_UNDERLINED = 4;

  // 大小常量
  public static readonly SIZE_SMALL = 8;
  public static readonly SIZE_MEDIUM = 0;
  public static readonly SIZE_LARGE = 16;

  // 字面常量 (J2ME)
  public static readonly FACE_SYSTEM = 0;
  public static readonly FACE_MONOSPACE = 32;
  public static readonly FACE_PROPORTIONAL = 64;

  // 默认字体
  private static defaultFont: Font | null = null;

  private face: number;
  private style: number;
  private size: number;
  private cssString: string;
  private metrics: TextMetrics | null = null;
  private height: number;

  private constructor(face: number, style: number, size: number) {
    this.face = face;
    this.style = style;
    this.size = size;
    this.cssString = this.computeCSS();
    this.height = this.computeHeight();
  }

  /**
   * 获取字体实例 (工厂方法)
   */
  public static getFont(face: number, style: number, size: number): Font {
    // 简单实现: 每次返回新对象 (实际应缓存)
    return new Font(face, style, size);
  }

  /**
   * 获取默认字体
   */
  public static getDefaultFont(): Font {
    if (!Font.defaultFont) {
      Font.defaultFont = new Font(Font.FACE_SYSTEM, Font.STYLE_PLAIN, Font.SIZE_MEDIUM);
    }
    return Font.defaultFont;
  }

  /**
   * 获取字体样式
   */
  public getStyle(): number {
    return this.style;
  }

  /**
   * 获取字体大小
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * 获取字体字面
   */
  public getFace(): number {
    return this.face;
  }

  /**
   * 是否加粗
   */
  public isBold(): boolean {
    return (this.style & Font.STYLE_BOLD) !== 0;
  }

  /**
   * 是否斜体
   */
  public isItalic(): boolean {
    return (this.style & Font.STYLE_ITALIC) !== 0;
  }

  /**
   * 是否有下划线
   */
  public isUnderlined(): boolean {
    return (this.style & Font.STYLE_UNDERLINED) !== 0;
  }

  /**
   * 获取字体高度 (像素)
   */
  public getHeight(): number {
    return this.height;
  }

  /**
   * 获取基线位置
   */
  public getBaselinePosition(): number {
    return Math.ceil(this.height * 0.8);
  }

  /**
   * 计算字符串宽度
   */
  public stringWidth(str: string): number {
    if (typeof document === 'undefined') {
      return str.length * 8; // Node.js 环境估算
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = this.cssString;
      return Math.ceil(ctx.measureText(str).width);
    }
    return 0;
  }

  /**
   * 内部方法: 获取 CSS 字体字符串
   */
  public _toCSS(): string {
    return this.cssString;
  }

  /**
   * 计算 CSS 字符串
   */
  private computeCSS(): string {
    let css = "";

    // 样式
    if (this.style & Font.STYLE_ITALIC) {
      css += "italic ";
    }
    if (this.style & Font.STYLE_BOLD) {
      css += "bold ";
    }

    // 大小
    let pxSize = 12; // 默认 MEDIUM
    if (this.size === Font.SIZE_SMALL) {
      pxSize = 10;
    } else if (this.size === Font.SIZE_LARGE) {
      pxSize = 16;
    }
    css += `${pxSize}px `;

    // 字体族
    if (this.face === Font.FACE_MONOSPACE) {
      css += "monospace";
    } else {
      css += "sans-serif";
    }

    return css;
  }

  /**
   * 计算字体高度
   */
  private computeHeight(): number {
    if (this.size === Font.SIZE_SMALL) {
      return 12;
    } else if (this.size === Font.SIZE_LARGE) {
      return 20;
    } else {
      return 16; // MEDIUM
    }
  }
}
