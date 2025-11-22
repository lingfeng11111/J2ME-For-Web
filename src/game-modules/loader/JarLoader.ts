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

import JSZip from 'jszip';
import { Image } from '../graphics/Image';

/**
 * JarLoader - JAR 资源加载器
 * 
 * 负责解析 JAR (ZIP) 文件，并提供同步的资源访问接口。
 * 为了适配 J2ME 的同步 API (getResourceAsStream)，我们在加载阶段将所有文件解压到内存中。
 */
export class JarLoader {
  private files: Map<string, Uint8Array> = new Map();
  private loaded: boolean = false;

  /**
   * 加载 JAR 文件
   * @param data JAR 文件数据 (ArrayBuffer)
   */
  public async loadJar(data: ArrayBuffer): Promise<void> {
    try {
      const zip = await JSZip.loadAsync(data);
      
      // 遍历并解压所有文件
      const promises: Promise<void>[] = [];
      
      zip.forEach((relativePath, file) => {
        if (!file.dir) {
          const promise = file.async('uint8array').then(content => {
            // 规范化路径: 移除开头的 /，统一使用 / 分隔
            const normalizedPath = this.normalizePath(relativePath);
            this.files.set(normalizedPath, content);
          });
          promises.push(promise);
        }
      });

      await Promise.all(promises);
      this.loaded = true;
      console.log(`JAR loaded: ${this.files.size} files extracted.`);
    } catch (e) {
      console.error("Failed to load JAR:", e);
      throw e;
    }
  }

  /**
   * 获取文件数据
   * @param path 文件路径
   * @returns 文件数据 (Uint8Array) 或 null
   */
  public getFile(path: string): Uint8Array | null {
    if (!this.loaded) {
      console.warn("JarLoader not loaded yet.");
      return null;
    }
    const normalizedPath = this.normalizePath(path);
    return this.files.get(normalizedPath) || null;
  }

  /**
   * 检查文件是否存在
   */
  public fileExists(path: string): boolean {
    const normalizedPath = this.normalizePath(path);
    return this.files.has(normalizedPath);
  }

  /**
   * 加载图片资源
   * @param path 图片路径
   * @returns Image 对象
   */
  public loadImage(path: string): Image | null {
    const data = this.getFile(path);
    if (!data) {
      return null;
    }

    // 将 Uint8Array 转换为 Blob URL (浏览器环境)
    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
      const blob = new Blob([data as any], { type: this.getMimeType(path) });
      const url = URL.createObjectURL(blob);
      return Image.createImageFromPath(url);
    } else {
      // Node.js 环境: 暂时返回空图片或模拟
      console.warn("Blob/URL not supported in this environment.");
      return Image.createImage(100, 100); // 占位
    }
  }

  /**
   * 规范化路径
   * 移除开头的 /，确保一致性
   */
  private normalizePath(path: string): string {
    let p = path.replace(/\\/g, '/'); // 替换反斜杠
    if (p.startsWith('/')) {
      p = p.substring(1);
    }
    return p;
  }

  /**
   * 获取 MIME 类型
   */
  private getMimeType(path: string): string {
    if (path.endsWith('.png')) return 'image/png';
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
    if (path.endsWith('.gif')) return 'image/gif';
    return 'application/octet-stream';
  }
}
