/**
 * Display - LCDUI 显示管理器
 * 
 * 单例模式,管理当前显示的 Displayable 对象。
 * 负责将 Canvas 绑定到 HTML Canvas 元素。
 */

import { Displayable } from './Displayable';
import { Canvas } from './Canvas';

export class Display {
  private static instance: Display | null = null;
  private currentDisplayable: Displayable | null = null;
  private htmlCanvas: HTMLCanvasElement | null = null;

  private constructor() {
    // 私有构造函数,确保单例
  }

  /**
   * 获取 Display 实例
   * @param midlet MIDlet 实例 (J2ME 标准参数,这里暂时忽略)
   */
  public static getDisplay(midlet: any): Display {
    if (!Display.instance) {
      Display.instance = new Display();
    }
    return Display.instance;
  }

  /**
   * 设置当前显示的 Displayable
   */
  public setCurrent(displayable: Displayable | null): void {
    // 隐藏旧的 Displayable
    if (this.currentDisplayable instanceof Canvas) {
      (this.currentDisplayable as any).hideNotify?.();
    }

    this.currentDisplayable = displayable;

    // 显示新的 Displayable
    if (displayable instanceof Canvas) {
      this.showCanvas(displayable);
    }
  }

  /**
   * 获取当前显示的 Displayable
   */
  public getCurrent(): Displayable | null {
    return this.currentDisplayable;
  }

  /**
   * 显示 Canvas
   */
  private showCanvas(canvas: Canvas): void {
    // 如果还没有 HTML Canvas,创建一个
    if (!this.htmlCanvas) {
      this.createHTMLCanvas();
    }

    if (this.htmlCanvas) {
      // 绑定 Canvas
      canvas.bindCanvas(this.htmlCanvas);

      // 触发显示通知
      (canvas as any).showNotify?.();

      // 请求重绘
      canvas.repaint();
    }
  }

  /**
   * 创建 HTML Canvas 元素
   */
  private createHTMLCanvas(): void {
    // 查找现有的 Canvas
    let canvas = document.getElementById('j2me-canvas') as HTMLCanvasElement;

    if (!canvas) {
      // 创建新的 Canvas
      canvas = document.createElement('canvas');
      canvas.id = 'j2me-canvas';
      canvas.style.border = '1px solid #000';
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
      
      // 添加到 body
      document.body.appendChild(canvas);
    }

    this.htmlCanvas = canvas;

    // 绑定事件监听器
    this.bindEventListeners();
  }

  /**
   * 绑定事件监听器
   */
  private bindEventListeners(): void {
    if (!this.htmlCanvas) {
      return;
    }

    // 键盘事件
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // 鼠标事件 (映射为指针事件)
    this.htmlCanvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.htmlCanvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.htmlCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    // 触摸事件
    this.htmlCanvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.htmlCanvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    this.htmlCanvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
  }

  /**
   * 处理键盘按下
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!(this.currentDisplayable instanceof Canvas)) {
      return;
    }

    const keyCode = this.mapKeyCode(e.key);
    if (keyCode !== 0) {
      e.preventDefault();
      this.currentDisplayable._triggerKeyPressed(keyCode);
    }
  }

  /**
   * 处理键盘释放
   */
  private handleKeyUp(e: KeyboardEvent): void {
    if (!(this.currentDisplayable instanceof Canvas)) {
      return;
    }

    const keyCode = this.mapKeyCode(e.key);
    if (keyCode !== 0) {
      e.preventDefault();
      this.currentDisplayable._triggerKeyReleased(keyCode);
    }
  }

  /**
   * 映射键盘按键到 J2ME 按键码
   */
  private mapKeyCode(key: string): number {
    switch (key) {
      case '0': return Canvas.KEY_NUM0;
      case '1': return Canvas.KEY_NUM1;
      case '2': return Canvas.KEY_NUM2;
      case '3': return Canvas.KEY_NUM3;
      case '4': return Canvas.KEY_NUM4;
      case '5': return Canvas.KEY_NUM5;
      case '6': return Canvas.KEY_NUM6;
      case '7': return Canvas.KEY_NUM7;
      case '8': return Canvas.KEY_NUM8;
      case '9': return Canvas.KEY_NUM9;
      case '*': return Canvas.KEY_STAR;
      case '#': return Canvas.KEY_POUND;
      case 'ArrowUp': return Canvas.KEY_NUM2;
      case 'ArrowDown': return Canvas.KEY_NUM8;
      case 'ArrowLeft': return Canvas.KEY_NUM4;
      case 'ArrowRight': return Canvas.KEY_NUM6;
      case 'Enter': return Canvas.KEY_NUM5;
      case ' ': return Canvas.KEY_NUM5;
      default: return 0;
    }
  }

  /**
   * 处理鼠标按下
   */
  private handleMouseDown(e: MouseEvent): void {
    if (!(this.currentDisplayable instanceof Canvas) || !this.htmlCanvas) {
      return;
    }

    const rect = this.htmlCanvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    this.currentDisplayable._triggerPointerPressed(x, y);
  }

  /**
   * 处理鼠标释放
   */
  private handleMouseUp(e: MouseEvent): void {
    if (!(this.currentDisplayable instanceof Canvas) || !this.htmlCanvas) {
      return;
    }

    const rect = this.htmlCanvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    this.currentDisplayable._triggerPointerReleased(x, y);
  }

  /**
   * 处理鼠标移动
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!(this.currentDisplayable instanceof Canvas) || !this.htmlCanvas) {
      return;
    }

    // 只在按下时触发拖动
    if (e.buttons === 1) {
      const rect = this.htmlCanvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);

      this.currentDisplayable._triggerPointerDragged(x, y);
    }
  }

  /**
   * 处理触摸开始
   */
  private handleTouchStart(e: TouchEvent): void {
    if (!(this.currentDisplayable instanceof Canvas) || !this.htmlCanvas) {
      return;
    }

    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.htmlCanvas.getBoundingClientRect();
    const x = Math.floor(touch.clientX - rect.left);
    const y = Math.floor(touch.clientY - rect.top);

    this.currentDisplayable._triggerPointerPressed(x, y);
  }

  /**
   * 处理触摸结束
   */
  private handleTouchEnd(e: TouchEvent): void {
    if (!(this.currentDisplayable instanceof Canvas) || !this.htmlCanvas) {
      return;
    }

    e.preventDefault();
    const touch = e.changedTouches[0];
    const rect = this.htmlCanvas.getBoundingClientRect();
    const x = Math.floor(touch.clientX - rect.left);
    const y = Math.floor(touch.clientY - rect.top);

    this.currentDisplayable._triggerPointerReleased(x, y);
  }

  /**
   * 处理触摸移动
   */
  private handleTouchMove(e: TouchEvent): void {
    if (!(this.currentDisplayable instanceof Canvas) || !this.htmlCanvas) {
      return;
    }

    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.htmlCanvas.getBoundingClientRect();
    const x = Math.floor(touch.clientX - rect.left);
    const y = Math.floor(touch.clientY - rect.top);

    this.currentDisplayable._triggerPointerDragged(x, y);
  }

  /**
   * 调用串行化 (确保在主线程执行)
   */
  public callSerially(runnable: () => void): void {
    setTimeout(runnable, 0);
  }

  /**
   * 振动设备
   */
  public vibrate(duration: number): boolean {
    // Web 环境下暂不支持振动
    console.warn('Display.vibrate() not supported in web environment');
    return false;
  }

  /**
   * 闪烁背光
   */
  public flashBacklight(duration: number): boolean {
    // Web 环境下暂不支持背光闪烁
    console.warn('Display.flashBacklight() not supported in web environment');
    return false;
  }

  /**
   * 获取颜色数量
   */
  public numColors(): number {
    return 16777216; // 24-bit color (2^24)
  }

  /**
   * 是否支持颜色
   */
  public isColor(): boolean {
    return true;
  }

  /**
   * 获取显示器数量
   */
  public numAlphaLevels(): number {
    return 256; // 8-bit alpha
  }
}
