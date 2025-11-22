/**
 * Displayable - LCDUI 可显示对象基类
 * 
 * 这是所有可以在 Display 上显示的对象的抽象基类。
 * 包括 Canvas、Form、Alert 等。
 */

export abstract class Displayable {
  protected width: number;
  protected height: number;
  protected title: string | null = null;

  constructor(width: number = 240, height: number = 320) {
    this.width = width;
    this.height = height;
  }

  /**
   * 获取显示区域宽度
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * 获取显示区域高度
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * 设置标题
   */
  public setTitle(title: string | null): void {
    this.title = title;
  }

  /**
   * 获取标题
   */
  public getTitle(): string | null {
    return this.title;
  }

  /**
   * 当 Displayable 被显示时调用
   * 子类可以重写此方法
   */
  protected sizeChanged(w: number, h: number): void {
    // 默认实现为空
  }
}
