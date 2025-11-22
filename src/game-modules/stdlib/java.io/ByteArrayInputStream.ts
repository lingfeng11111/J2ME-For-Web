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

import { InputStream } from './InputStream';

export class ByteArrayInputStream extends InputStream {
    protected buf: Uint8Array;
    protected pos: number;
    protected count: number;
    protected markPos: number = 0;

    constructor(buf: Uint8Array) {
        super();
        this.buf = buf;
        this.pos = 0;
        this.count = buf.length;
    }

    public read(): number {
        return (this.pos < this.count) ? (this.buf[this.pos++] & 0xff) : -1;
    }

    public readBytesOffset(b: Int8Array, off: number, len: number): number {
        if (b == null) {
            throw new Error("NullPointerException");
        } else if (off < 0 || len < 0 || len > b.length - off) {
            throw new Error("IndexOutOfBoundsException");
        }

        if (this.pos >= this.count) {
            return -1;
        }

        let avail = this.count - this.pos;
        if (len > avail) {
            len = avail;
        }
        if (len <= 0) {
            return 0;
        }

        // 复制数据: Uint8Array -> Int8Array
        // 注意: 直接复制位模式，无需转换数值
        for (let i = 0; i < len; i++) {
            b[off + i] = this.buf[this.pos + i];
        }
        
        this.pos += len;
        return len;
    }

    public available(): number {
        return this.count - this.pos;
    }

    public close(): void {
        // Do nothing
    }
}
