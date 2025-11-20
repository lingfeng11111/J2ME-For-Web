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

import { ConstantInstructions } from "./constants";
import { MathInstructions } from "./math";
import { ControlInstructions } from "./control";
import { LoadInstructions } from "./loads";
import { StoreInstructions } from "./stores";
import { InvokeInstructions } from "./invoke";
import { FieldInstructions } from "./field-instructions";
import { ArrayInstructions } from "./array-instructions";

// 导出类以确保它们被加载
export {
  ConstantInstructions,
  MathInstructions,
  ControlInstructions,
  LoadInstructions,
  StoreInstructions,
  InvokeInstructions,
  FieldInstructions,
  ArrayInstructions
};

/**
 * 初始化指令集
 * 只要导入此模块,所有指令就会自动注册
 */
export function initInstructions(): void {
  // 实际上不需要做任何事,导入时装饰器已经执行了
  // 但保留这个函数作为一个显式的初始化入口是个好习惯
}
