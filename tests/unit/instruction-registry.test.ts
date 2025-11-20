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
 * J2ME-For-Web Constant Pool Test
 * 简单的测试指令注册表测试
 */
import { InstructionRegistry } from '../../src/vm-core/interpreter/instruction';
import { initInstructions } from '../../src/vm-core/interpreter/instructions';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertDefined(value: any, message: string) {
  assert(value !== null && value !== undefined, message);
}

console.log('=== 指令注册测试 ===');

// 初始化指令集
initInstructions();

console.log('1. 测试常量指令注册...');
const nopHandler = InstructionRegistry.get(0x00);
const iconst0Handler = InstructionRegistry.get(0x03);
const bipushHandler = InstructionRegistry.get(0x10);

assertDefined(nopHandler, 'NOP 指令应该被注册');
assertDefined(iconst0Handler, 'ICONST_0 指令应该被注册');
assertDefined(bipushHandler, 'BIPUSH 指令应该被注册');
console.log('✅ 常量指令测试通过');

console.log('2. 测试加载指令注册...');
const iloadHandler = InstructionRegistry.get(0x15);
const aloadHandler = InstructionRegistry.get(0x19);
const lloadHandler = InstructionRegistry.get(0x16);

assertDefined(iloadHandler, 'ILOAD 指令应该被注册');
assertDefined(aloadHandler, 'ALOAD 指令应该被注册');
assertDefined(lloadHandler, 'LLOAD 指令应该被注册');
console.log('✅ 加载指令测试通过');

console.log('3. 测试存储指令注册...');
const istoreHandler = InstructionRegistry.get(0x36);
const astoreHandler = InstructionRegistry.get(0x3a);
const lstoreHandler = InstructionRegistry.get(0x37);

assertDefined(istoreHandler, 'ISTORE 指令应该被注册');
assertDefined(astoreHandler, 'ASTORE 指令应该被注册');
assertDefined(lstoreHandler, 'LSTORE 指令应该被注册');
console.log('✅ 存储指令测试通过');

console.log('4. 测试数学指令注册...');
const iaddHandler = InstructionRegistry.get(0x60);
const isubHandler = InstructionRegistry.get(0x64);
const imulHandler = InstructionRegistry.get(0x68);

assertDefined(iaddHandler, 'IADD 指令应该被注册');
assertDefined(isubHandler, 'ISUB 指令应该被注册');
assertDefined(imulHandler, 'IMUL 指令应该被注册');
console.log('✅ 数学指令测试通过');

console.log('5. 测试控制流指令注册...');
const returnHandler = InstructionRegistry.get(0xb1);
const ireturnHandler = InstructionRegistry.get(0xac);

assertDefined(returnHandler, 'RETURN 指令应该被注册');
assertDefined(ireturnHandler, 'IRETURN 指令应该被注册');
console.log('✅ 控制流指令测试通过');

console.log('6. 测试 InvokeInstructions 导入...');
const registeredCount = (InstructionRegistry as any)['handlers'].filter((h: any) => h !== null).length;
assert(registeredCount > 0, '应该有指令被注册');
console.log(`✅ 已注册指令数量: ${registeredCount}`);

console.log('7. 测试未使用的操作码...');
const unusedHandler = InstructionRegistry.get(0xff);
assert(unusedHandler === null, '未使用的操作码应该返回 null');
console.log('✅ 未使用操作码测试通过');

console.log('\n=== 所有测试通过! ===');