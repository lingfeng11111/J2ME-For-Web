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

import { JarLoader } from '../loader/JarLoader';

/**
 * 全局上下文
 * 存储 VM 运行时的全局状态，如资源加载器等。
 */
export class Context {
    private static instance: Context;
    private jarLoader: JarLoader;

    private constructor() {
        this.jarLoader = new JarLoader();
    }

    public static getInstance(): Context {
        if (!Context.instance) {
            Context.instance = new Context();
        }
        return Context.instance;
    }

    public getJarLoader(): JarLoader {
        return this.jarLoader;
    }

    public setJarLoader(loader: JarLoader): void {
        this.jarLoader = loader;
    }
}
