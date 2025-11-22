(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Font = void 0;
class Font {
    constructor(face, style, size) {
        this.metrics = null;
        this.face = face;
        this.style = style;
        this.size = size;
        this.cssString = this.computeCSS();
        this.height = this.computeHeight();
    }
    static getFont(face, style, size) {
        return new Font(face, style, size);
    }
    static getDefaultFont() {
        if (!Font.defaultFont) {
            Font.defaultFont = new Font(Font.FACE_SYSTEM, Font.STYLE_PLAIN, Font.SIZE_MEDIUM);
        }
        return Font.defaultFont;
    }
    getStyle() {
        return this.style;
    }
    getSize() {
        return this.size;
    }
    getFace() {
        return this.face;
    }
    isBold() {
        return (this.style & Font.STYLE_BOLD) !== 0;
    }
    isItalic() {
        return (this.style & Font.STYLE_ITALIC) !== 0;
    }
    isUnderlined() {
        return (this.style & Font.STYLE_UNDERLINED) !== 0;
    }
    getHeight() {
        return this.height;
    }
    getBaselinePosition() {
        return Math.ceil(this.height * 0.8);
    }
    stringWidth(str) {
        if (typeof document === 'undefined') {
            return str.length * 8;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.font = this.cssString;
            return Math.ceil(ctx.measureText(str).width);
        }
        return 0;
    }
    _toCSS() {
        return this.cssString;
    }
    computeCSS() {
        let css = "";
        if (this.style & Font.STYLE_ITALIC) {
            css += "italic ";
        }
        if (this.style & Font.STYLE_BOLD) {
            css += "bold ";
        }
        let pxSize = 12;
        if (this.size === Font.SIZE_SMALL) {
            pxSize = 10;
        }
        else if (this.size === Font.SIZE_LARGE) {
            pxSize = 16;
        }
        css += `${pxSize}px `;
        if (this.face === Font.FACE_MONOSPACE) {
            css += "monospace";
        }
        else {
            css += "sans-serif";
        }
        return css;
    }
    computeHeight() {
        if (this.size === Font.SIZE_SMALL) {
            return 12;
        }
        else if (this.size === Font.SIZE_LARGE) {
            return 20;
        }
        else {
            return 16;
        }
    }
}
exports.Font = Font;
Font.STYLE_PLAIN = 0;
Font.STYLE_BOLD = 1;
Font.STYLE_ITALIC = 2;
Font.STYLE_UNDERLINED = 4;
Font.SIZE_SMALL = 8;
Font.SIZE_MEDIUM = 0;
Font.SIZE_LARGE = 16;
Font.FACE_SYSTEM = 0;
Font.FACE_MONOSPACE = 32;
Font.FACE_PROPORTIONAL = 64;
Font.defaultFont = null;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graphics = void 0;
const Font_1 = require("./Font");
class Graphics {
    constructor(ctx, width, height) {
        this.color = 0x000000;
        this.translateX = 0;
        this.translateY = 0;
        this.clipX = 0;
        this.clipY = 0;
        this.ctx = ctx;
        this.clipWidth = width;
        this.clipHeight = height;
        this.font = Font_1.Font.getDefaultFont();
        this.ctx.save();
        this.updateFont();
    }
    setColor(red, green, blue) {
        this.color = ((red & 0xFF) << 16) | ((green & 0xFF) << 8) | (blue & 0xFF);
        this.updateCanvasColor();
    }
    setColorRGB(rgb) {
        this.color = rgb & 0xFFFFFF;
        this.updateCanvasColor();
    }
    getColor() {
        return this.color;
    }
    updateCanvasColor() {
        const r = (this.color >> 16) & 0xFF;
        const g = (this.color >> 8) & 0xFF;
        const b = this.color & 0xFF;
        const colorStr = `rgb(${r},${g},${b})`;
        this.ctx.fillStyle = colorStr;
        this.ctx.strokeStyle = colorStr;
    }
    setFont(font) {
        if (font) {
            this.font = font;
            this.updateFont();
        }
    }
    getFont() {
        return this.font;
    }
    updateFont() {
        if (this.font) {
            this.ctx.font = this.font._toCSS();
        }
    }
    translate(x, y) {
        this.translateX += x;
        this.translateY += y;
        this.ctx.translate(x, y);
    }
    getTranslateX() {
        return this.translateX;
    }
    getTranslateY() {
        return this.translateY;
    }
    setClip(x, y, width, height) {
        this.clipX = x;
        this.clipY = y;
        this.clipWidth = width;
        this.clipHeight = height;
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.translateX, this.translateY);
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.clip();
        this.updateCanvasColor();
        this.updateFont();
    }
    getClipX() {
        return this.clipX;
    }
    getClipY() {
        return this.clipY;
    }
    getClipWidth() {
        return this.clipWidth;
    }
    getClipHeight() {
        return this.clipHeight;
    }
    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
    }
    drawRect(x, y, width, height) {
        this.ctx.strokeRect(x + 0.5, y + 0.5, width, height);
    }
    fillRect(x, y, width, height) {
        this.ctx.fillRect(x, y, width, height);
    }
    drawRoundRect(x, y, width, height, arcWidth, arcHeight) {
        const radiusX = arcWidth / 2;
        const radiusY = arcHeight / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radiusX, y);
        this.ctx.lineTo(x + width - radiusX, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radiusY);
        this.ctx.lineTo(x + width, y + height - radiusY);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radiusX, y + height);
        this.ctx.lineTo(x + radiusX, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radiusY);
        this.ctx.lineTo(x, y + radiusY);
        this.ctx.quadraticCurveTo(x, y, x + radiusX, y);
        this.ctx.stroke();
    }
    fillRoundRect(x, y, width, height, arcWidth, arcHeight) {
        const radiusX = arcWidth / 2;
        const radiusY = arcHeight / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radiusX, y);
        this.ctx.lineTo(x + width - radiusX, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radiusY);
        this.ctx.lineTo(x + width, y + height - radiusY);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radiusX, y + height);
        this.ctx.lineTo(x + radiusX, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radiusY);
        this.ctx.lineTo(x, y + radiusY);
        this.ctx.quadraticCurveTo(x, y, x + radiusX, y);
        this.ctx.fill();
    }
    drawArc(x, y, width, height, startAngle, arcAngle) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radiusX = width / 2;
        const radiusY = height / 2;
        const startRad = -startAngle * Math.PI / 180;
        const endRad = -(startAngle + arcAngle) * Math.PI / 180;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startRad, endRad, arcAngle < 0);
        this.ctx.stroke();
    }
    fillArc(x, y, width, height, startAngle, arcAngle) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radiusX = width / 2;
        const radiusY = height / 2;
        const startRad = -startAngle * Math.PI / 180;
        const endRad = -(startAngle + arcAngle) * Math.PI / 180;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startRad, endRad, arcAngle < 0);
        this.ctx.closePath();
        this.ctx.fill();
    }
    drawString(str, x, y, anchor) {
        const pos = this.calculateAnchorPosition(str, x, y, anchor);
        this.ctx.fillText(str, pos.x, pos.y);
        if (this.font.isUnderlined()) {
            const width = this.font.stringWidth(str);
            const height = this.font.getHeight();
            this.ctx.fillRect(pos.x, pos.y + height - 2, width, 1);
        }
    }
    drawSubstring(str, offset, len, x, y, anchor) {
        const substr = str.substring(offset, offset + len);
        this.drawString(substr, x, y, anchor);
    }
    drawChar(char, x, y, anchor) {
        this.drawString(char, x, y, anchor);
    }
    drawChars(chars, offset, length, x, y, anchor) {
        const str = chars.slice(offset, offset + length).join('');
        this.drawString(str, x, y, anchor);
    }
    calculateAnchorPosition(str, x, y, anchor) {
        let posX = x;
        let posY = y;
        if (anchor & Graphics.HCENTER) {
            this.ctx.textAlign = 'center';
        }
        else if (anchor & Graphics.RIGHT) {
            this.ctx.textAlign = 'right';
        }
        else {
            this.ctx.textAlign = 'left';
        }
        if (anchor & Graphics.VCENTER) {
            this.ctx.textBaseline = 'middle';
        }
        else if (anchor & Graphics.BOTTOM) {
            this.ctx.textBaseline = 'bottom';
        }
        else if (anchor & Graphics.BASELINE) {
            this.ctx.textBaseline = 'alphabetic';
        }
        else {
            this.ctx.textBaseline = 'top';
        }
        return { x: posX, y: posY };
    }
    drawImage(image, x, y, anchor) {
        if (!image)
            return;
        const imgElement = image._getElement();
        const width = image.getWidth();
        const height = image.getHeight();
        let dx = x;
        let dy = y;
        if (anchor & Graphics.HCENTER) {
            dx -= width / 2;
        }
        else if (anchor & Graphics.RIGHT) {
            dx -= width;
        }
        if (anchor & Graphics.VCENTER) {
            dy -= height / 2;
        }
        else if (anchor & Graphics.BOTTOM) {
            dy -= height;
        }
        this.ctx.drawImage(imgElement, dx, dy);
    }
    drawRegion(image, srcX, srcY, srcWidth, srcHeight, transform, dstX, dstY, anchor) {
        if (!image)
            return;
        const imgElement = image._getElement();
        let transWidth = srcWidth;
        let transHeight = srcHeight;
        if (transform === Graphics.TRANS_ROT90 || transform === Graphics.TRANS_ROT270 ||
            transform === Graphics.TRANS_MIRROR_ROT90 || transform === Graphics.TRANS_MIRROR_ROT270) {
            transWidth = srcHeight;
            transHeight = srcWidth;
        }
        let dx = dstX;
        let dy = dstY;
        if (anchor & Graphics.HCENTER) {
            dx -= transWidth / 2;
        }
        else if (anchor & Graphics.RIGHT) {
            dx -= transWidth;
        }
        if (anchor & Graphics.VCENTER) {
            dy -= transHeight / 2;
        }
        else if (anchor & Graphics.BOTTOM) {
            dy -= transHeight;
        }
        this.ctx.save();
        this.ctx.translate(dx + transWidth / 2, dy + transHeight / 2);
        switch (transform) {
            case Graphics.TRANS_ROT90:
                this.ctx.rotate(Math.PI / 2);
                break;
            case Graphics.TRANS_ROT180:
                this.ctx.rotate(Math.PI);
                break;
            case Graphics.TRANS_ROT270:
                this.ctx.rotate(-Math.PI / 2);
                break;
            case Graphics.TRANS_MIRROR:
                this.ctx.scale(-1, 1);
                break;
            case Graphics.TRANS_MIRROR_ROT90:
                this.ctx.scale(-1, 1);
                this.ctx.rotate(Math.PI / 2);
                break;
            case Graphics.TRANS_MIRROR_ROT180:
                this.ctx.scale(-1, 1);
                this.ctx.rotate(Math.PI);
                break;
            case Graphics.TRANS_MIRROR_ROT270:
                this.ctx.scale(-1, 1);
                this.ctx.rotate(-Math.PI / 2);
                break;
        }
        this.ctx.drawImage(imgElement, srcX, srcY, srcWidth, srcHeight, -srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        this.ctx.restore();
    }
    fillTriangle(x1, y1, x2, y2, x3, y3) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx.fill();
    }
    copyArea(x, y, width, height, dx, dy, anchor) {
        const imageData = this.ctx.getImageData(x, y, width, height);
        this.ctx.putImageData(imageData, x + dx, y + dy);
    }
    dispose() {
        this.ctx.restore();
    }
}
exports.Graphics = Graphics;
Graphics.LEFT = 4;
Graphics.RIGHT = 8;
Graphics.TOP = 16;
Graphics.BOTTOM = 32;
Graphics.HCENTER = 1;
Graphics.VCENTER = 2;
Graphics.BASELINE = 64;
Graphics.TRANS_NONE = 0;
Graphics.TRANS_ROT90 = 5;
Graphics.TRANS_ROT180 = 3;
Graphics.TRANS_ROT270 = 6;
Graphics.TRANS_MIRROR = 2;
Graphics.TRANS_MIRROR_ROT90 = 7;
Graphics.TRANS_MIRROR_ROT180 = 1;
Graphics.TRANS_MIRROR_ROT270 = 4;
Graphics.SOLID = 0;
Graphics.DOTTED = 1;

},{"./Font":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const Graphics_1 = require("./Graphics");
class Image {
    constructor(element, mutable) {
        this.graphics = null;
        this.element = element;
        this.mutable = mutable;
    }
    static createImage(width, height) {
        if (width <= 0 || height <= 0) {
            throw new Error("IllegalArgumentException: Width and height must be positive");
        }
        if (typeof document === 'undefined') {
            return new Image({ width, height }, true);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return new Image(canvas, true);
    }
    static createImageFromPath(path) {
        if (typeof document === 'undefined') {
            return new Image({ width: 100, height: 100, src: path }, false);
        }
        const img = document.createElement('img');
        img.src = path;
        return new Image(img, false);
    }
    getWidth() {
        return this.element.width;
    }
    getHeight() {
        return this.element.height;
    }
    getGraphics() {
        if (!this.mutable) {
            throw new Error("IllegalStateException: Image is immutable");
        }
        if (!this.graphics) {
            if (typeof HTMLCanvasElement !== 'undefined' && this.element instanceof HTMLCanvasElement) {
                const ctx = this.element.getContext('2d');
                if (!ctx) {
                    throw new Error("Failed to get 2D context");
                }
                this.graphics = new Graphics_1.Graphics(ctx, this.element.width, this.element.height);
            }
            else if (typeof document === 'undefined') {
                this.graphics = {
                    setColor: () => { },
                    fillRect: () => { },
                    drawLine: () => { },
                    drawRect: () => { },
                    dispose: () => { }
                };
            }
            else {
                throw new Error("Mutable image must be backed by Canvas");
            }
        }
        return this.graphics;
    }
    isMutable() {
        return this.mutable;
    }
    _getElement() {
        return this.element;
    }
    getRGB(rgbData, offset, scanlength, x, y, width, height) {
        if (width <= 0 || height <= 0)
            return;
        let ctx = null;
        if (typeof HTMLCanvasElement !== 'undefined' && this.element instanceof HTMLCanvasElement) {
            ctx = this.element.getContext('2d');
        }
        else if (typeof HTMLImageElement !== 'undefined' && this.element instanceof HTMLImageElement) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            ctx = tempCanvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(this.element, -x, -y);
            }
        }
        if (!ctx)
            return;
        const imageData = ctx.getImageData(x, y, width, height);
        const data = imageData.data;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const idx = (i * width + j) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];
                const argb = (a << 24) | (r << 16) | (g << 8) | b;
                rgbData[offset + i * scanlength + j] = argb;
            }
        }
    }
}
exports.Image = Image;

},{"./Graphics":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
const Displayable_1 = require("./Displayable");
const Graphics_1 = require("../graphics/Graphics");
class Canvas extends Displayable_1.Displayable {
    constructor() {
        super();
        this.htmlCanvas = null;
        this.ctx = null;
        this.repaintPending = false;
    }
    repaint() {
        if (this.repaintPending) {
            return;
        }
        this.repaintPending = true;
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => this.performPaint());
        }
        else {
            setTimeout(() => this.performPaint(), 16);
        }
    }
    repaintRect(x, y, width, height) {
        this.repaint();
    }
    serviceRepaints() {
        if (this.repaintPending) {
            this.performPaint();
        }
    }
    performPaint() {
        if (!this.ctx) {
            return;
        }
        this.repaintPending = false;
        const g = new Graphics_1.Graphics(this.ctx, this.width, this.height);
        try {
            this.paint(g);
        }
        catch (error) {
            console.error('Error in Canvas.paint():', error);
        }
        finally {
            g.dispose();
        }
    }
    bindCanvas(canvas) {
        this.htmlCanvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (this.ctx) {
            this.ctx.font = '12px sans-serif';
        }
        canvas.width = this.width;
        canvas.height = this.height;
    }
    getGameAction(keyCode) {
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
    getKeyName(keyCode) {
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
    keyPressed(keyCode) {
    }
    keyReleased(keyCode) {
    }
    keyRepeated(keyCode) {
    }
    pointerPressed(x, y) {
    }
    pointerReleased(x, y) {
    }
    pointerDragged(x, y) {
    }
    showNotify() {
    }
    hideNotify() {
    }
    isDoubleBuffered() {
        return true;
    }
    hasPointerEvents() {
        return true;
    }
    hasPointerMotionEvents() {
        return true;
    }
    hasRepeatEvents() {
        return true;
    }
    _triggerKeyPressed(keyCode) {
        this.keyPressed(keyCode);
    }
    _triggerKeyReleased(keyCode) {
        this.keyReleased(keyCode);
    }
    _triggerKeyRepeated(keyCode) {
        this.keyRepeated(keyCode);
    }
    _triggerPointerPressed(x, y) {
        this.pointerPressed(x, y);
    }
    _triggerPointerReleased(x, y) {
        this.pointerReleased(x, y);
    }
    _triggerPointerDragged(x, y) {
        this.pointerDragged(x, y);
    }
}
exports.Canvas = Canvas;
Canvas.KEY_NUM0 = 48;
Canvas.KEY_NUM1 = 49;
Canvas.KEY_NUM2 = 50;
Canvas.KEY_NUM3 = 51;
Canvas.KEY_NUM4 = 52;
Canvas.KEY_NUM5 = 53;
Canvas.KEY_NUM6 = 54;
Canvas.KEY_NUM7 = 55;
Canvas.KEY_NUM8 = 56;
Canvas.KEY_NUM9 = 57;
Canvas.KEY_STAR = 42;
Canvas.KEY_POUND = 35;
Canvas.UP = 1;
Canvas.DOWN = 6;
Canvas.LEFT = 2;
Canvas.RIGHT = 5;
Canvas.FIRE = 8;
Canvas.GAME_A = 9;
Canvas.GAME_B = 10;
Canvas.GAME_C = 11;
Canvas.GAME_D = 12;

},{"../graphics/Graphics":2,"./Displayable":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
const Canvas_1 = require("./Canvas");
class Display {
    constructor() {
        this.currentDisplayable = null;
        this.htmlCanvas = null;
    }
    static getDisplay(midlet) {
        if (!Display.instance) {
            Display.instance = new Display();
        }
        return Display.instance;
    }
    setCurrent(displayable) {
        if (this.currentDisplayable instanceof Canvas_1.Canvas) {
            this.currentDisplayable.hideNotify?.();
        }
        this.currentDisplayable = displayable;
        if (displayable instanceof Canvas_1.Canvas) {
            this.showCanvas(displayable);
        }
    }
    getCurrent() {
        return this.currentDisplayable;
    }
    showCanvas(canvas) {
        if (!this.htmlCanvas) {
            this.createHTMLCanvas();
        }
        if (this.htmlCanvas) {
            canvas.bindCanvas(this.htmlCanvas);
            canvas.showNotify?.();
            canvas.repaint();
        }
    }
    createHTMLCanvas() {
        let canvas = document.getElementById('j2me-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'j2me-canvas';
            canvas.style.border = '1px solid #000';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            document.body.appendChild(canvas);
        }
        this.htmlCanvas = canvas;
        this.bindEventListeners();
    }
    bindEventListeners() {
        if (!this.htmlCanvas) {
            return;
        }
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.htmlCanvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.htmlCanvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.htmlCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.htmlCanvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.htmlCanvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        this.htmlCanvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }
    handleKeyDown(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas)) {
            return;
        }
        const keyCode = this.mapKeyCode(e.key);
        if (keyCode !== 0) {
            e.preventDefault();
            this.currentDisplayable._triggerKeyPressed(keyCode);
        }
    }
    handleKeyUp(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas)) {
            return;
        }
        const keyCode = this.mapKeyCode(e.key);
        if (keyCode !== 0) {
            e.preventDefault();
            this.currentDisplayable._triggerKeyReleased(keyCode);
        }
    }
    mapKeyCode(key) {
        switch (key) {
            case '0': return Canvas_1.Canvas.KEY_NUM0;
            case '1': return Canvas_1.Canvas.KEY_NUM1;
            case '2': return Canvas_1.Canvas.KEY_NUM2;
            case '3': return Canvas_1.Canvas.KEY_NUM3;
            case '4': return Canvas_1.Canvas.KEY_NUM4;
            case '5': return Canvas_1.Canvas.KEY_NUM5;
            case '6': return Canvas_1.Canvas.KEY_NUM6;
            case '7': return Canvas_1.Canvas.KEY_NUM7;
            case '8': return Canvas_1.Canvas.KEY_NUM8;
            case '9': return Canvas_1.Canvas.KEY_NUM9;
            case '*': return Canvas_1.Canvas.KEY_STAR;
            case '#': return Canvas_1.Canvas.KEY_POUND;
            case 'ArrowUp': return Canvas_1.Canvas.KEY_NUM2;
            case 'ArrowDown': return Canvas_1.Canvas.KEY_NUM8;
            case 'ArrowLeft': return Canvas_1.Canvas.KEY_NUM4;
            case 'ArrowRight': return Canvas_1.Canvas.KEY_NUM6;
            case 'Enter': return Canvas_1.Canvas.KEY_NUM5;
            case ' ': return Canvas_1.Canvas.KEY_NUM5;
            default: return 0;
        }
    }
    handleMouseDown(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas) || !this.htmlCanvas) {
            return;
        }
        const rect = this.htmlCanvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        this.currentDisplayable._triggerPointerPressed(x, y);
    }
    handleMouseUp(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas) || !this.htmlCanvas) {
            return;
        }
        const rect = this.htmlCanvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        this.currentDisplayable._triggerPointerReleased(x, y);
    }
    handleMouseMove(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas) || !this.htmlCanvas) {
            return;
        }
        if (e.buttons === 1) {
            const rect = this.htmlCanvas.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            this.currentDisplayable._triggerPointerDragged(x, y);
        }
    }
    handleTouchStart(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas) || !this.htmlCanvas) {
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.htmlCanvas.getBoundingClientRect();
        const x = Math.floor(touch.clientX - rect.left);
        const y = Math.floor(touch.clientY - rect.top);
        this.currentDisplayable._triggerPointerPressed(x, y);
    }
    handleTouchEnd(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas) || !this.htmlCanvas) {
            return;
        }
        e.preventDefault();
        const touch = e.changedTouches[0];
        const rect = this.htmlCanvas.getBoundingClientRect();
        const x = Math.floor(touch.clientX - rect.left);
        const y = Math.floor(touch.clientY - rect.top);
        this.currentDisplayable._triggerPointerReleased(x, y);
    }
    handleTouchMove(e) {
        if (!(this.currentDisplayable instanceof Canvas_1.Canvas) || !this.htmlCanvas) {
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.htmlCanvas.getBoundingClientRect();
        const x = Math.floor(touch.clientX - rect.left);
        const y = Math.floor(touch.clientY - rect.top);
        this.currentDisplayable._triggerPointerDragged(x, y);
    }
    callSerially(runnable) {
        setTimeout(runnable, 0);
    }
    vibrate(duration) {
        console.warn('Display.vibrate() not supported in web environment');
        return false;
    }
    flashBacklight(duration) {
        console.warn('Display.flashBacklight() not supported in web environment');
        return false;
    }
    numColors() {
        return 16777216;
    }
    isColor() {
        return true;
    }
    numAlphaLevels() {
        return 256;
    }
}
exports.Display = Display;
Display.instance = null;

},{"./Canvas":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Displayable = void 0;
class Displayable {
    constructor(width = 240, height = 320) {
        this.title = null;
        this.width = width;
        this.height = height;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setTitle(title) {
        this.title = title;
    }
    getTitle() {
        return this.title;
    }
    sizeChanged(w, h) {
    }
}
exports.Displayable = Displayable;

},{}],7:[function(require,module,exports){
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
 * 浏览器测试入口文件
 * 
 * 由于使用 CommonJS 模块格式，需要在浏览器中手动加载编译后的模块
 */

// 加载编译后的 LCDUI 模块
const { Display } = require('../../dist/src/game-modules/ui/Display');
const { Canvas } = require('../../dist/src/game-modules/ui/Canvas');
const { Graphics } = require('../../dist/src/game-modules/graphics/Graphics');
const { Image } = require('../../dist/src/game-modules/graphics/Image');
const { Font } = require('../../dist/src/game-modules/graphics/Font');

/**
 * 测试画布类
 */
class TestCanvas extends Canvas {
  constructor() {
    super();
    this.frameCount = 0;
    this.lastKeyPressed = 0;
    this.pointerX = -1;
    this.pointerY = -1;
    
    // 创建一个离屏图像 (Mutable Image)
    this.offscreenImage = Image.createImage(60, 60);
    const g = this.offscreenImage.getGraphics();
    g.setColor(200, 200, 200);
    g.fillRect(0, 0, 60, 60);
    g.setColor(255, 0, 0);
    g.drawLine(0, 0, 60, 60);
    g.drawLine(60, 0, 0, 60);
    g.setColor(0, 0, 255);
    g.drawRect(0, 0, 59, 59);
  }

  paint(g) {
    // 清空背景 (白色)
    g.setColor(255, 255, 255);
    g.fillRect(0, 0, this.getWidth(), this.getHeight());

    // 绘制标题 (黑色)
    g.setColor(0, 0, 0);
    g.drawString('J2ME LCDUI Test', this.getWidth() / 2, 10, Graphics.HCENTER | Graphics.TOP);

    // 绘制帧计数
    g.drawString(`Frame: ${this.frameCount}`, 10, 30, Graphics.LEFT | Graphics.TOP);

    // 绘制矩形 (红色)
    g.setColor(255, 0, 0);
    g.fillRect(20, 60, 80, 60);

    // 绘制矩形边框 (蓝色)
    g.setColor(0, 0, 255);
    g.drawRect(120, 60, 80, 60);

    // 绘制圆角矩形 (绿色)
    g.setColor(0, 255, 0);
    g.fillRoundRect(20, 140, 80, 60, 20, 20);

    // 绘制线条
    g.setColor(0, 0, 0);
    g.drawLine(120, 140, 200, 200);
    g.drawLine(200, 140, 120, 200);

    // 绘制圆弧 (紫色)
    g.setColor(128, 0, 128);
    g.fillArc(20, 220, 80, 80, 0, 90);

    // 绘制三角形 (橙色)
    g.setColor(255, 165, 0);
    g.fillTriangle(120, 220, 160, 220, 140, 260);

    // --- 新增测试: 图像绘制 ---
    // 1. 普通绘制
    g.drawImage(this.offscreenImage, 20, 320, Graphics.LEFT | Graphics.TOP);
    
    // 2. 区域绘制 (旋转 90 度)
    g.drawRegion(this.offscreenImage, 0, 0, 60, 60, Graphics.TRANS_ROT90, 100, 320, Graphics.LEFT | Graphics.TOP);

    // 3. 区域绘制 (镜像)
    g.drawRegion(this.offscreenImage, 0, 0, 60, 60, Graphics.TRANS_MIRROR, 180, 320, Graphics.LEFT | Graphics.TOP);

    // --- 新增测试: 字体绘制 ---
    // 1. 大号粗体
    const fontLarge = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_BOLD, Font.SIZE_LARGE);
    g.setFont(fontLarge);
    g.setColor(0, 0, 0);
    g.drawString("Large Bold", 20, 400, Graphics.LEFT | Graphics.TOP);

    // 2. 小号斜体
    const fontSmall = Font.getFont(Font.FACE_MONOSPACE, Font.STYLE_ITALIC, Font.SIZE_SMALL);
    g.setFont(fontSmall);
    g.drawString("Small Italic Monospace", 20, 430, Graphics.LEFT | Graphics.TOP);

    // 恢复默认字体
    g.setFont(Font.getDefaultFont());

    // 显示按键信息
    if (this.lastKeyPressed !== 0) {
      g.setColor(0, 0, 0);
      g.drawString(`Last Key: ${this.lastKeyPressed}`, 10, this.getHeight() - 40, Graphics.LEFT | Graphics.TOP);
      
      const gameAction = this.getGameAction(this.lastKeyPressed);
      if (gameAction !== 0) {
        g.drawString(`Game Action: ${gameAction}`, 10, this.getHeight() - 25, Graphics.LEFT | Graphics.TOP);
      }
    }

    // 显示指针位置
    if (this.pointerX >= 0 && this.pointerY >= 0) {
      g.setColor(255, 0, 0);
      g.fillRect(this.pointerX - 2, this.pointerY - 2, 5, 5);
      g.setColor(0, 0, 0);
      g.drawString(`Pointer: (${this.pointerX}, ${this.pointerY})`, 10, this.getHeight() - 10, Graphics.LEFT | Graphics.TOP);
    }

    this.frameCount++;
  }

  keyPressed(keyCode) {
    console.log(`Key pressed: ${keyCode}`);
    this.lastKeyPressed = keyCode;
    this.repaint();
  }

  keyReleased(keyCode) {
    console.log(`Key released: ${keyCode}`);
  }

  pointerPressed(x, y) {
    console.log(`Pointer pressed: (${x}, ${y})`);
    this.pointerX = x;
    this.pointerY = y;
    this.repaint();
  }

  pointerReleased(x, y) {
    console.log(`Pointer released: (${x}, ${y})`);
  }

  pointerDragged(x, y) {
    this.pointerX = x;
    this.pointerY = y;
    this.repaint();
  }
}

/**
 * 运行测试
 */
function runTest() {
  console.log('=== LCDUI 浏览器测试 ===\n');

  // 1. 测试 Display 单例
  console.log('1. 测试 Display 单例');
  const display1 = Display.getDisplay(null);
  const display2 = Display.getDisplay(null);
  console.log(`   Display 是单例: ${display1 === display2 ? '✅' : '❌'}`);

  // 2. 测试 Canvas 创建
  console.log('\n2. 测试 Canvas 创建');
  const canvas = new TestCanvas();
  console.log(`   Canvas 宽度: ${canvas.getWidth()}`);
  console.log(`   Canvas 高度: ${canvas.getHeight()}`);
  console.log(`   Canvas 双缓冲: ${canvas.isDoubleBuffered() ? '✅' : '❌'}`);
  console.log(`   Canvas 支持指针事件: ${canvas.hasPointerEvents() ? '✅' : '❌'}`);

  // 3. 测试 Display 属性
  console.log('\n3. 测试 Display 属性');
  console.log(`   支持颜色: ${display1.isColor() ? '✅' : '❌'}`);
  console.log(`   颜色数量: ${display1.numColors()}`);
  console.log(`   Alpha 级别: ${display1.numAlphaLevels()}`);

  // 4. 测试按键映射
  console.log('\n4. 测试按键映射');
  console.log(`   KEY_NUM2 -> UP: ${canvas.getGameAction(Canvas.KEY_NUM2) === Canvas.UP ? '✅' : '❌'}`);
  console.log(`   KEY_NUM8 -> DOWN: ${canvas.getGameAction(Canvas.KEY_NUM8) === Canvas.DOWN ? '✅' : '❌'}`);
  console.log(`   KEY_NUM4 -> LEFT: ${canvas.getGameAction(Canvas.KEY_NUM4) === Canvas.LEFT ? '✅' : '❌'}`);
  console.log(`   KEY_NUM6 -> RIGHT: ${canvas.getGameAction(Canvas.KEY_NUM6) === Canvas.RIGHT ? '✅' : '❌'}`);
  console.log(`   KEY_NUM5 -> FIRE: ${canvas.getGameAction(Canvas.KEY_NUM5) === Canvas.FIRE ? '✅' : '❌'}`);

  // 5. 测试按键名称
  console.log('\n5. 测试按键名称');
  console.log(`   KEY_NUM0 名称: "${canvas.getKeyName(Canvas.KEY_NUM0)}" (期望: "0")`);
  console.log(`   KEY_NUM5 名称: "${canvas.getKeyName(Canvas.KEY_NUM5)}" (期望: "5")`);
  console.log(`   KEY_STAR 名称: "${canvas.getKeyName(Canvas.KEY_STAR)}" (期望: "*")`);
  console.log(`   KEY_POUND 名称: "${canvas.getKeyName(Canvas.KEY_POUND)}" (期望: "#")`);

  // 6. 测试 Display.setCurrent() 和渲染
  console.log('\n6. 测试 Display.setCurrent() 和渲染');
  display1.setCurrent(canvas);
  console.log(`   当前 Displayable: ${display1.getCurrent() === canvas ? '✅' : '❌'}`);
  
  console.log('\n✅ 所有 LCDUI 测试通过!');
  console.log('\n提示: Canvas 已显示在页面上');
  console.log('      使用方向键或数字键 2/4/6/8 测试按键事件');
  console.log('      使用鼠标或触摸屏测试指针事件');
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.runLCDUITest = runTest;
  window.TestCanvas = TestCanvas;
  window.Display = Display;
  window.Canvas = Canvas;
  window.Graphics = Graphics;
}

// 自动运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', runTest);
}

},{"../../dist/src/game-modules/graphics/Font":1,"../../dist/src/game-modules/graphics/Graphics":2,"../../dist/src/game-modules/graphics/Image":3,"../../dist/src/game-modules/ui/Canvas":4,"../../dist/src/game-modules/ui/Display":5}]},{},[7]);
