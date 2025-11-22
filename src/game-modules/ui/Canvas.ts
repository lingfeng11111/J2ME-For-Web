/**
 * Canvas - LCDUI 画布基类
 * 
 * 游戏必须继承此类并实现 paint() 方法。
 * 提供键盘事件处理和重绘机制。
 */

import { Displayable } from './Displayable';
import { Graphics } from '../graphics/Graphics';

export abstract class Canvas extends Displayable {
  // 按键常量
  public static readonly KEY_NUM0 = 48;
  public static readonly KEY_NUM1 = 49;
  public static readonly KEY_NUM2 = 50;
  public static readonly KEY_NUM3 = 51;
  public static readonly KEY_NUM4 = 52;
  public static readonly KEY_NUM5 = 53;
  public static readonly KEY_NUM6 = 54;
  public static readonly KEY_NUM7 = 55;
  public static readonly KEY_NUM8 = 56;
  public static readonly KEY_NUM9 = 57;
  public static readonly KEY_STAR = 42;
  public static readonly KEY_POUND = 35;

  // 游戏动作常量
  public static readonly UP = 1;
  public static readonly DOWN = 6;
  public static readonly LEFT = 2;
  public static readonly RIGHT = 5;
  public static readonly FIRE = 8;
  public static readonly GAME_A = 9;
  public static readonly GAME_B = 10;
  public static readonly GAME_C = 11;
  public static readonly GAME_D = 12;

  private htmlCanvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private repaintPending: boolean = false;

  constructor() {
    super();
  }

  /**
   * 抽象方法:绘制画布
   * 游戏必须实现此方法
   */
  protected abstract paint(g: Graphics): void;

  /**
   * 请求重绘
   */
  repaint(): void {
    if (this.repaintPending) {
      return;
    }
    
    this.repaintPending = true;
    
    // 使用 requestAnimationFrame 优化重绘
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.performPaint());
    } else {
      setTimeout(() => this.performPaint(), 16); // ~60 FPS
    }
  }

  /**
   * 请求重绘指定区域
   */
  repaintRect(x: number, y: number, width: number, height: number): void {
    // 简化实现:重绘整个画布
    this.repaint();
  }

  /**
   * 立即重绘
   */
  serviceRepaints(): void {
    if (this.repaintPending) {
      this.performPaint();
    }
  }

  /**
   * 执行实际的绘制
   */
  private performPaint(): void {
    if (!this.ctx) {
      return;
    }

    this.repaintPending = false;

    // 创建 Graphics 对象
    const g = new Graphics(this.ctx, this.width, this.height);

    try {
      // 调用用户的 paint 方法
      this.paint(g);
    } catch (error) {
      console.error('Error in Canvas.paint():', error);
    } finally {
      // 清理资源
      g.dispose();
    }
  }

  /**
   * 绑定 HTML Canvas 元素
   * (由 Display 调用)
   */
  bindCanvas(canvas: HTMLCanvasElement): void {
    this.htmlCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (this.ctx) {
      // 设置默认字体
      this.ctx.font = '12px sans-serif';
    }

    // 设置画布尺寸
    canvas.width = this.width;
    canvas.height = this.height;
  }

  /**
   * 获取游戏动作
   */
  getGameAction(keyCode: number): number {
    switch (keyCode) {
      case Canvas.KEY_NUM2:
        return Canvas.UP;
      case Canvas.KEY_NUM8:
        return Canvas.DOWN;
      case Canvas.KEY_NUM4:
        return Canvas.LEFT;
      case Canvas.KEY_NUM6:
        return Canvas.RIGHT;
      case Canvas.KEY_NUM5:
        return Canvas.FIRE;
      case Canvas.KEY_NUM7:
        return Canvas.GAME_A;
      case Canvas.KEY_NUM9:
        return Canvas.GAME_B;
      default:
        return 0;
    }
  }

  /**
   * 获取按键名称
   */
  getKeyName(keyCode: number): string {
    if (keyCode >= Canvas.KEY_NUM0 && keyCode <= Canvas.KEY_NUM9) {
      return String.fromCharCode(keyCode);
    }
    switch (keyCode) {
      case Canvas.KEY_STAR:
        return '*';
      case Canvas.KEY_POUND:
        return '#';
      default:
        return '';
    }
  }

  /**
   * 按键按下事件
   * 子类可以重写此方法
   */
  protected keyPressed(keyCode: number): void {
    // 默认实现为空
  }

  /**
   * 按键释放事件
   * 子类可以重写此方法
   */
  protected keyReleased(keyCode: number): void {
    // 默认实现为空
  }

  /**
   * 按键重复事件
   * 子类可以重写此方法
   */
  protected keyRepeated(keyCode: number): void {
    // 默认实现为空
  }

  /**
   * 指针按下事件
   * 子类可以重写此方法
   */
  protected pointerPressed(x: number, y: number): void {
    // 默认实现为空
  }

  /**
   * 指针释放事件
   * 子类可以重写此方法
   */
  protected pointerReleased(x: number, y: number): void {
    // 默认实现为空
  }

  /**
   * 指针拖动事件
   * 子类可以重写此方法
   */
  protected pointerDragged(x: number, y: number): void {
    // 默认实现为空
  }

  /**
   * 显示通知
   * 子类可以重写此方法
   */
  protected showNotify(): void {
    // 默认实现为空
  }

  /**
   * 隐藏通知
   * 子类可以重写此方法
   */
  protected hideNotify(): void {
    // 默认实现为空
  }

  /**
   * 是否双缓冲
   */
  isDoubleBuffered(): boolean {
    return true; // Canvas 2D 默认双缓冲
  }

  /**
   * 检查是否有指针事件支持
   */
  hasPointerEvents(): boolean {
    return true;
  }

  /**
   * 检查是否有指针移动事件支持
   */
  hasPointerMotionEvents(): boolean {
    return true;
  }

  /**
   * 检查是否有重复按键事件支持
   */
  hasRepeatEvents(): boolean {
    return true;
  }

  /**
   * 内部方法:触发按键按下
   */
  public _triggerKeyPressed(keyCode: number): void {
    this.keyPressed(keyCode);
  }

  /**
   * 内部方法:触发按键释放
   */
  public _triggerKeyReleased(keyCode: number): void {
    this.keyReleased(keyCode);
  }

  /**
   * 内部方法:触发按键重复
   */
  public _triggerKeyRepeated(keyCode: number): void {
    this.keyRepeated(keyCode);
  }

  /**
   * 内部方法:触发指针按下
   */
  public _triggerPointerPressed(x: number, y: number): void {
    this.pointerPressed(x, y);
  }

  /**
   * 内部方法:触发指针释放
   */
  public _triggerPointerReleased(x: number, y: number): void {
    this.pointerReleased(x, y);
  }

  /**
   * 内部方法:触发指针拖动
   */
  public _triggerPointerDragged(x: number, y: number): void {
    this.pointerDragged(x, y);
  }
}
