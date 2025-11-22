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
 * java.io.InputStream
 */
export class InputStream {
    /**
     * Reads the next byte of data from the input stream.
     * @returns the next byte of data, or -1 if the end of the stream is reached.
     */
    public read(): number {
        return -1;
    }

    /**
     * Reads some number of bytes from the input stream and stores them into the buffer array b.
     * @param b the buffer into which the data is read.
     * @returns the total number of bytes read into the buffer, or -1 if there is no more data because the end of the stream has been reached.
     */
    public readBytes(b: Int8Array): number {
        return this.readBytesOffset(b, 0, b.length);
    }

    /**
     * Reads up to len bytes of data from the input stream into an array of bytes.
     * @param b the buffer into which the data is read.
     * @param off the start offset in array b at which the data is written.
     * @param len the maximum number of bytes to read.
     */
    public readBytesOffset(b: Int8Array, off: number, len: number): number {
        if (b == null) {
            throw new Error("NullPointerException");
        } else if (off < 0 || len < 0 || len > b.length - off) {
            throw new Error("IndexOutOfBoundsException");
        } else if (len == 0) {
            return 0;
        }

        let c = this.read();
        if (c == -1) {
            return -1;
        }
        b[off] = c;

        let i = 1;
        try {
            for (; i < len; i++) {
                c = this.read();
                if (c == -1) {
                    break;
                }
                b[off + i] = c;
            }
        } catch (ee) {
        }
        return i;
    }

    public close(): void {}

    public available(): number {
        return 0;
    }
}
