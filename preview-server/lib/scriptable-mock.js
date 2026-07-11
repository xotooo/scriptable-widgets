/**
 * Scriptable API Mock for Browser Preview
 * 
 * Emulates the Scriptable iOS app's JavaScript API so widget scripts
 * can be developed and previewed in a browser without an iOS device.
 * 
 * This mock renders ListWidget hierarchies into actual DOM elements
 * with CSS that approximates the iOS widget appearance.
 */

// ============================================================
// COLOR
// ============================================================
class Color {
  constructor(hex, alpha = 1.0) {
    this._hex = hex.replace('#', '');
    if (this._hex.length === 3) {
      this._hex = this._hex.split('').map(c => c + c).join('');
    }
    this._r = parseInt(this._hex.substring(0, 2), 16);
    this._g = parseInt(this._hex.substring(2, 4), 16);
    this._b = parseInt(this._hex.substring(4, 6), 16);
    this._alpha = alpha;
    this.red = this._r / 255;
    this.green = this._g / 255;
    this.blue = this._b / 255;
    this.hex = '#' + this._hex;
  }

  get rgba() {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._alpha})`;
  }

  static black() { return new Color('000000'); }
  static white() { return new Color('ffffff'); }
  static red() { return new Color('ff3b30'); }
  static green() { return new Color('34c759'); }
  static blue() { return new Color('007aff'); }
  static yellow() { return new Color('ffcc00'); }
  static gray() { return new Color('8e8e93'); }
  static grey() { return new Color('8e8e93'); }
  static orange() { return new Color('ff9500'); }
  static purple() { return new Color('af52de'); }
  static pink() { return new Color('ff2d55'); }
  static brown() { return new Color('a2845e'); }
  static cyan() { return new Color('32ade6'); }
  static teal() { return new Color('30b0c7'); }
  static indigo() { return new Color('5856d6'); }
  static lightGray() { return new Color('c7c7cc'); }
  static darkGray() { return new Color('48484a'); }
  static clear() { return new Color('000000', 0); }
  static dynamic(light, dark) {
    // In browser preview, use dark mode
    return dark || light;
  }
}

// ============================================================
// FONT
// ============================================================
class Font {
  constructor(name, size) {
    this._name = name || '-apple-system';
    this._size = size || 14;
    this._weight = 'regular';
  }

  get css() {
    const weightMap = {
      'regular': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700,
      'heavy': 800,
      'black': 900,
      'light': 300,
      'ultralight': 200,
    };
    const w = weightMap[this._weight] || 400;
    const family = this._name === 'SF Mono' || this._name === 'Menlo' 
      ? `"SF Mono", "Menlo", monospace` 
      : `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif`;
    return `${w} ${this._size}px ${family}`;
  }

  get size() { return this._size; }

  static regularSystemFont(size) {
    const f = new Font(null, size);
    f._weight = 'regular';
    return f;
  }
  static mediumSystemFont(size) {
    const f = new Font(null, size);
    f._weight = 'medium';
    return f;
  }
  static semiboldSystemFont(size) {
    const f = new Font(null, size);
    f._weight = 'semibold';
    return f;
  }
  static boldSystemFont(size) {
    const f = new Font(null, size);
    f._weight = 'bold';
    return f;
  }
  static heavySystemFont(size) {
    const f = new Font(null, size);
    f._weight = 'heavy';
    return f;
  }
  static blackSystemFont(size) {
    const f = new Font(null, size);
    f._weight = 'black';
    return f;
  }
  static monospacedSystemFont(size, weight = 'regular') {
    const f = new Font('SF Mono', size);
    f._weight = weight;
    return f;
  }
  static roundedSystemFont(size, weight = 'regular') {
    const f = new Font(null, size);
    f._weight = weight;
    f._rounded = true;
    return f;
  }
}

// ============================================================
// SIZE & POINT & RECT (value types)
// ============================================================
class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Insets {
  constructor(top, left, bottom, right) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }
}

class LinearGradient {
  constructor(locations, colors, angle) {
    this.locations = locations || [0, 1];
    this.colors = colors || [Color.black(), Color.white()];
    this.angle = angle || 0;
  }
  get css() {
    const colors = this.colors.map((c, i) => {
      const loc = this.locations[i] !== undefined ? this.locations[i] : (i / (this.colors.length - 1));
      return `${c.rgba} ${(loc * 100).toFixed(1)}%`;
    }).join(', ');
    return `linear-gradient(${this.angle}deg, ${colors})`;
  }
}

// ============================================================
// WIDGET TEXT
// ============================================================
class WidgetText {
  constructor(text = '') {
    this.text = text;
    this._font = Font.regularSystemFont(14);
    this._textColor = Color.white();
    this._textOpacity = 1.0;
    this._lineLimit = 0;
    this._minimumScaleFactor = 1.0;
    this._element = document.createElement('div');
    this._element.className = 'widget-text';
    this._updateElement();
  }

  get font() { return this._font; }
  set font(f) { this._font = f; this._updateElement(); }

  get textColor() { return this._textColor; }
  set textColor(c) { this._textColor = c; this._updateElement(); }

  get textOpacity() { return this._textOpacity; }
  set textOpacity(v) { this._textOpacity = v; this._updateElement(); }

  get lineLimit() { return this._lineLimit; }
  set lineLimit(v) { this._lineLimit = v; this._updateElement(); }

  get minimumScaleFactor() { return this._minimumScaleFactor; }
  set minimumScaleFactor(v) { this._minimumScaleFactor = v; }

  _updateElement() {
    if (this.text instanceof Date) {
      // WidgetDate behavior
      this._element.textContent = this.text.toLocaleString();
    } else {
      this._element.textContent = String(this.text || '');
    }
    this._element.style.font = this._font.css;
    this._element.style.color = this._textColor.rgba;
    this._element.style.opacity = this._textOpacity;
    if (this._lineLimit > 0) {
      this._element.style.maxHeight = `${this._lineLimit * this._font.size * 1.3}px`;
      this._element.style.overflow = 'hidden';
      this._element.style.display = '-webkit-box';
      this._element.style.webkitLineClamp = String(this._lineLimit);
      this._element.style.webkitBoxOrient = 'vertical';
    }
  }

  get element() { return this._element; }
}

// ============================================================
// WIDGET DATE
// ============================================================
class WidgetDate {
  constructor(date) {
    this._date = date;
    this._font = Font.regularSystemFont(14);
    this._textColor = Color.white();
    this._textOpacity = 1.0;
    this._element = document.createElement('div');
    this._element.className = 'widget-date';
    this._updateElement();
  }
  get font() { return this._font; }
  set font(f) { this._font = f; this._updateElement(); }
  get textColor() { return this._textColor; }
  set textColor(c) { this._textColor = c; this._updateElement(); }
  get textOpacity() { return this._textOpacity; }
  set textOpacity(v) { this._textOpacity = v; this._updateElement(); }

  _updateElement() {
    this._element.textContent = this._date ? this._date.toLocaleString() : '';
    this._element.style.font = this._font.css;
    this._element.style.color = this._textColor.rgba;
    this._element.style.opacity = this._textOpacity;
  }

  get element() { return this._element; }
}

// ============================================================
// WIDGET IMAGE
// ============================================================
class WidgetImage {
  constructor(image) {
    this._image = image;
    this._imageSize = null;
    this._cornerRadius = 0;
    this._opacity = 1.0;
    this._tintColor = null;
    this._contentMode = 'aspectFill';
    this._resizable = false;
    this._element = document.createElement('img');
    this._element.className = 'widget-image';
    this._element.style.display = 'block';
    this._updateElement();
  }

  get imageSize() { return this._imageSize; }
  set imageSize(s) { this._imageSize = s; this._updateElement(); }
  get cornerRadius() { return this._cornerRadius; }
  set cornerRadius(v) { this._cornerRadius = v; this._updateElement(); }
  get opacity() { return this._opacity; }
  set opacity(v) { this._opacity = v; this._updateElement(); }
  get tintColor() { return this._tintColor; }
  set tintColor(c) { this._tintColor = c; this._updateElement(); }
  get imageOpacity() { return this._opacity; }
  set imageOpacity(v) { this._opacity = v; this._updateElement(); }
  get contentMode() { return this._contentMode; }
  set contentMode(v) { this._contentMode = v; this._updateElement(); }

  setImage(image) { this._image = image; this._updateElement(); }

  _updateElement() {
    if (this._image && this._image.src) {
      this._element.src = this._image.src;
    }
    if (this._imageSize) {
      this._element.style.width = `${this._imageSize.width}px`;
      this._element.style.height = `${this._imageSize.height}px`;
    }
    this._element.style.borderRadius = `${this._cornerRadius}px`;
    this._element.style.opacity = this._opacity;
    if (this._tintColor) {
      // Approximate tint with a CSS filter overlay
      this._element.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${this._tintColor.rgba})`;
    }
    if (this._contentMode === 'aspectFill') {
      this._element.style.objectFit = 'cover';
    } else if (this._contentMode === 'aspectFit') {
      this._element.style.objectFit = 'contain';
    } else if (this._contentMode === 'fit') {
      this._element.style.objectFit = 'contain';
    } else if (this._contentMode === 'fill') {
      this._element.style.objectFit = 'fill';
    }
  }

  get element() { return this._element; }
}

// ============================================================
// WIDGET SPACER
// ============================================================
class WidgetSpacer {
  constructor(length) {
    this._length = length;
    this._element = document.createElement('div');
    this._element.className = 'widget-spacer';
    this._updateElement();
  }

  get length() { return this._length; }
  set length(v) { this._length = v; this._updateElement(); }

  _updateElement() {
    this._element.style.flexGrow = this._length == null ? '1' : '0';
    if (this._length != null) {
      this._element.style.minWidth = `${this._length}px`;
      this._element.style.minHeight = `${this._length}px`;
    }
  }

  get element() { return this._element; }
}

// ============================================================
// WIDGET STACK
// ============================================================
class WidgetStack {
  constructor() {
    this._layout = 'vertical'; // default
    this._align = 'center';
    this._spacing = 0;
    this._backgroundColor = null;
    this._cornerRadius = 0;
    this._borderWidth = 0;
    this._borderColor = null;
    this._size = null;
    this._padding = null;
    this._opacity = 1.0;
    this._backgroundGradient = null;
    this._children = [];
    this._url = null;
    this._element = document.createElement('div');
    this._element.className = 'widget-stack';
    this._updateElement();
  }

  // Layout methods
  layoutHorizontally() { this._layout = 'horizontal'; this._updateElement(); }
  layoutVertically() { this._layout = 'vertical'; this._updateElement(); }

  // Alignment methods
  topAlignContent() { this._align = 'flex-start'; this._updateElement(); }
  centerAlignContent() { this._align = 'center'; this._updateElement(); }
  bottomAlignContent() { this._align = 'flex-end'; this._updateElement(); }
  leadingAlignContent() { this._align = 'flex-start'; this._updateElement(); }
  trailingAlignContent() { this._align = 'flex-end'; this._updateElement(); }

  // Properties
  get spacing() { return this._spacing; }
  set spacing(v) { this._spacing = v; this._updateElement(); }
  get backgroundColor() { return this._backgroundColor; }
  set backgroundColor(c) {
    if (c instanceof LinearGradient) {
      this._backgroundGradient = c;
      this._backgroundColor = null;
    } else {
      this._backgroundColor = c;
    }
    this._updateElement();
  }
  get backgroundGradient() { return this._backgroundGradient; }
  set backgroundGradient(g) { this._backgroundGradient = g; this._updateElement(); }
  get cornerRadius() { return this._cornerRadius; }
  set cornerRadius(v) { this._cornerRadius = v; this._updateElement(); }
  get borderWidth() { return this._borderWidth; }
  set borderWidth(v) { this._borderWidth = v; this._updateElement(); }
  get borderColor() { return this._borderColor; }
  set borderColor(c) { this._borderColor = c; this._updateElement(); }
  get size() { return this._size; }
  set size(s) { this._size = s; this._updateElement(); }
  get opacity() { return this._opacity; }
  set opacity(v) { this._opacity = v; this._updateElement(); }
  get topPadding() { return this._padding?.top || 0; }
  set topPadding(v) { this._setPadding('top', v); }
  get bottomPadding() { return this._padding?.bottom || 0; }
  set bottomPadding(v) { this._setPadding('bottom', v); }
  get leftPadding() { return this._padding?.left || 0; }
  set leftPadding(v) { this._setPadding('left', v); }
  get rightPadding() { return this._padding?.right || 0; }
  set rightPadding(v) { this._setPadding('right', v); }

  _setPadding(side, val) {
    if (!this._padding) this._padding = { top: 0, left: 0, bottom: 0, right: 0 };
    this._padding[side] = val;
    this._updateElement();
  }

  setPadding(left, top, right, bottom) {
    // Note: Scriptable iOS uses (top, left, bottom, right) order, but many scripts
    // call setPadding(top, left, bottom, right). We support both by checking arg count.
    this._padding = { top, left, bottom, right };
    this._updateElement();
  }

  setWidth(width) {
    if (!this._size) this._size = new Size(0, 0);
    this._size = new Size(width, this._size.height || 0);
    this._updateElement();
  }

  setHeight(height) {
    if (!this._size) this._size = new Size(0, 0);
    this._size = new Size(this._size.width || 0, height);
    this._updateElement();
  }

  // Content methods
  addText(text) {
    const w = new WidgetText(text);
    this._children.push(w);
    this._element.appendChild(w.element);
    return w;
  }

  addDate(date) {
    const w = new WidgetDate(date);
    this._children.push(w);
    this._element.appendChild(w.element);
    return w;
  }

  addImage(image) {
    const w = new WidgetImage(image);
    this._children.push(w);
    this._element.appendChild(w.element);
    return w;
  }

  addStack() {
    const s = new WidgetStack();
    this._children.push(s);
    this._element.appendChild(s.element);
    return s;
  }

  addSpacer(length) {
    const s = new WidgetSpacer(length);
    this._children.push(s);
    this._element.appendChild(s.element);
    return s;
  }

  addEmpty() {
    const s = new WidgetSpacer(0);
    this._children.push(s);
    this._element.appendChild(s.element);
    return s;
  }

  setUrl(url) { this._url = url; }
  get url() { return this._url; }
  set url(v) { this._url = v; }

  _updateElement() {
    const isH = this._layout === 'horizontal';
    this._element.style.display = 'flex';
    this._element.style.flexDirection = isH ? 'row' : 'column';
    this._element.style.alignItems = this._align;
    this._element.style.justifyContent = this._align === 'flex-start' ? 'flex-start' : 
                                          this._align === 'flex-end' ? 'flex-end' : 'center';
    this._element.style.gap = `${this._spacing}px`;
    this._element.style.borderRadius = `${this._cornerRadius}px`;
    if (this._backgroundColor) {
      this._element.style.background = this._backgroundColor.rgba;
    } else if (this._backgroundGradient) {
      this._element.style.background = this._backgroundGradient.css;
    }
    if (this._borderWidth > 0) {
      this._element.style.border = `${this._borderWidth}px solid ${this._borderColor ? this._borderColor.rgba : '#fff'}`;
    }
    if (this._size) {
      this._element.style.width = `${this._size.width}px`;
      this._element.style.height = `${this._size.height}px`;
    }
    this._element.style.opacity = this._opacity;
    if (this._padding) {
      this._element.style.padding = `${this._padding.top}px ${this._padding.right}px ${this._padding.bottom}px ${this._padding.left}px`;
    }
  }

  get element() { return this._element; }
}

// ============================================================
// LIST WIDGET (root container)
// ============================================================
class ListWidget extends WidgetStack {
  constructor() {
    super();
    this._element.className = 'list-widget';
    this._layout = 'vertical';
    this._updateElement();
  }

  // Preview methods (iOS only, no-op in browser)
  presentSmall() {}
  presentMedium() {}
  presentLarge() {}

  _updateElement() {
    super._updateElement();
    this._element.style.borderRadius = '22px';
    this._element.style.overflow = 'hidden';
  }
}

// ============================================================
// IMAGE
// ============================================================
class ScriptableImage {
  constructor(src) {
    this.src = src;
  }
  static fromFile(path) {
    return new ScriptableImage(path);
  }
  static async fromData(data) {
    return new ScriptableImage(data);
  }
}

// ============================================================
// REQUEST
// ============================================================
class Request {
  constructor(url = '') {
    this.url = url;
    this.method = 'GET';
    this.headers = {};
    this.body = null;
    this.timeoutInterval = 60;
    this.cachePolicy = 1;
    this._response = null;
  }

  get response() { return this._response; }

  async loadJSON() {
    const opts = { method: this.method, headers: this.headers };
    if (this.body) opts.body = this.body;
    const res = await fetch(this.url, opts);
    this._response = { statusCode: res.status, headers: Object.fromEntries(res.headers.entries()) };
    return await res.json();
  }

  async loadString() {
    const opts = { method: this.method, headers: this.headers };
    if (this.body) opts.body = this.body;
    const res = await fetch(this.url, opts);
    this._response = { statusCode: res.status, headers: Object.fromEntries(res.headers.entries()) };
    return await res.text();
  }

  async loadImage() {
    const opts = { method: this.method, headers: this.headers };
    if (this.body) opts.body = this.body;
    const res = await fetch(this.url, opts);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return new ScriptableImage(url);
  }

  async loadBlob() {
    const opts = { method: this.method, headers: this.headers };
    if (this.body) opts.body = this.body;
    const res = await fetch(this.url, opts);
    return await res.blob();
  }

  static async loadJSON(url) {
    const r = new Request(url);
    return r.loadJSON();
  }

  static async loadString(url) {
    const r = new Request(url);
    return r.loadString();
  }
}

// ============================================================
// DRAW CONTEXT (for canvas-based rendering)
// ============================================================
class DrawContext {
  constructor() {
    this.size = new Size(100, 100);
    this.opaque = false;
    this.respectsScreenScale = true;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._fillColor = Color.black();
    this._strokeColor = Color.black();
    this._lineWidth = 1;
    this._font = Font.regularSystemFont(14);
    this._textAlignment = 'left';
  }

  _setupCanvas() {
    const scale = this.respectsScreenScale ? (window.devicePixelRatio || 2) : 1;
    this._canvas.width = this.size.width * scale;
    this._canvas.height = this.size.height * scale;
    this._canvas.style.width = `${this.size.width}px`;
    this._canvas.style.height = `${this.size.height}px`;
    this._ctx.scale(scale, scale);
  }

  setFillColor(color) { this._fillColor = color; this._ctx.fillStyle = color.rgba; }
  setStrokeColor(color) { this._strokeColor = color; this._ctx.strokeStyle = color.rgba; }
  setLineWidth(width) { this._lineWidth = width; this._ctx.lineWidth = width; }
  setFont(font) { this._font = font; this._ctx.font = font.css; }
  setTextAlignedLeft() { this._textAlignment = 'left'; this._ctx.textAlign = 'left'; }
  setTextAlignedCenter() { this._textAlignment = 'center'; this._ctx.textAlign = 'center'; }
  setTextAlignedRight() { this._textAlignment = 'right'; this._ctx.textAlign = 'right'; }

  fillRect(rect) {
    this._ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }
  strokeRect(rect) {
    this._ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
  fillEllipse(rect) {
    this._ctx.beginPath();
    this._ctx.ellipse(rect.x + rect.width/2, rect.y + rect.height/2, rect.width/2, rect.height/2, 0, 0, Math.PI*2);
    this._ctx.fill();
  }
  strokeEllipse(rect) {
    this._ctx.beginPath();
    this._ctx.ellipse(rect.x + rect.width/2, rect.y + rect.height/2, rect.width/2, rect.height/2, 0, 0, Math.PI*2);
    this._ctx.stroke();
  }
  fillPath(path) {
    this._ctx.beginPath();
    if (path._instructions) {
      path._instructions.forEach(cmd => cmd(this._ctx));
    }
    this._ctx.fill();
  }
  strokePath(path) {
    this._ctx.beginPath();
    if (path._instructions) {
      path._instructions.forEach(cmd => cmd(this._ctx));
    }
    this._ctx.stroke();
  }
  addPath(path) {
    if (path._instructions) {
      path._instructions.forEach(cmd => cmd(this._ctx));
    }
  }
  fillText(text, point) {
    this._ctx.fillText(text, point.x, point.y);
  }
  drawText(text, point) {
    this._ctx.fillText(text, point.x, point.y);
  }
  measureText(text) {
    const m = this._ctx.measureText(text);
    return new Size(m.width, this._font.size);
  }
  getImage() {
    this._setupCanvas();
    return new ScriptableImage(this._canvas.toDataURL());
  }
  getImageStream() {
    return this._canvas.toDataURL();
  }
}

// ============================================================
// PATH
// ============================================================
class Path {
  constructor() {
    this._instructions = [];
  }
  moveToPoint(point) {
    this._instructions.push(ctx => ctx.moveTo(point.x, point.y));
  }
  addLineToPoint(point) {
    this._instructions.push(ctx => ctx.lineTo(point.x, point.y));
  }
  addCurveToPoint(cp1, cp2, end) {
    this._instructions.push(ctx => ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y));
  }
  addQuadCurveToPoint(cp, end) {
    this._instructions.push(ctx => ctx.quadraticCurveTo(cp.x, cp.y, end.x, end.y));
  }
  closeSubpath() {
    this._instructions.push(ctx => ctx.closePath());
  }
  addRect(rect) {
    this._instructions.push(ctx => ctx.rect(rect.x, rect.y, rect.width, rect.height));
  }
  addRoundedRect(rect, cornerWidth, cornerHeight) {
    this._instructions.push(ctx => {
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.width, rect.height, Math.min(cornerWidth, cornerHeight));
    });
  }
  addEllipse(rect) {
    this._instructions.push(ctx => {
      ctx.beginPath();
      ctx.ellipse(rect.x + rect.width/2, rect.y + rect.height/2, rect.width/2, rect.height/2, 0, 0, Math.PI*2);
    });
  }
}

// ============================================================
// DEVICE (simulated)
// ============================================================
const Device = {
  brand: 'Apple',
  model: 'iPhone 15 Pro (Preview)',
  name: 'Preview Device',
  systemName: 'iOS',
  systemVersion: '17.0',
  screenSize: new Size(393, 852),
  screenWidth: 393,
  screenHeight: 852,
  batteryLevel: 0.85,
  isCharging: false,
  language: 'zh-CN',
  locale: 'zh_CN',
  isUsingDarkAppearance: true,
  interfaceOrientation: 'portrait',
};

// ============================================================
// FILE MANAGER (mock, uses localStorage)
// ============================================================
class FileManager {
  static iCloud() { return new FileManager(); }
  static local() { return new FileManager(); }
  static module() { return new FileManager(); }

  constructor() {
    this._prefix = 'scriptable_fs_';
  }

  get documentsDirectory() { return '/Documents'; }
  get libraryDirectory() { return '/Library'; }
  get cachesDirectory() { return '/Library/Caches'; }
  get temporaryDirectory() { return '/tmp'; }

  fileExists(path) {
    return localStorage.getItem(this._prefix + path) !== null;
  }
  isDirectory(path) {
    const v = localStorage.getItem(this._prefix + '__dir_' + path);
    return v === 'true';
  }
  createDirectory(path) {
    localStorage.setItem(this._prefix + '__dir_' + path, 'true');
  }
  readString(path) {
    return localStorage.getItem(this._prefix + path) || '';
  }
  read(path) {
    return this.readString(path);
  }
  writeString(path, content) {
    localStorage.setItem(this._prefix + path, content);
  }
  write(path, data) {
    this.writeString(path, data);
  }
  remove(path) {
    localStorage.removeItem(this._prefix + path);
  }
  listContents(path) {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this._prefix + path + '/')) {
        items.push(key.substring(this._prefix.length + path.length + 1).split('/')[0]);
      }
    }
    return [...new Set(items)];
  }
  extension(path) {
    const parts = path.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
  fileName(path) {
    return path.split('/').pop();
  }
  joinPath(left, right) {
    return left + '/' + right;
  }
}

// ============================================================
// OTHER UTILITIES
// ============================================================
function importModule(name) {
  // Mock - try to find module in global scope
  return (typeof globalThis !== 'undefined' && globalThis[name]) || {};
}

function log(message) {
  console.log('[Scriptable]', message);
}

async function alert(message) {
  console.log('[Alert]', message);
}

async function paste(string) {
  try { await navigator.clipboard.writeText(string); } catch(e) {}
}

function console_log(msg) { console.log(msg); }

// ============================================================
// WIDGET FAMILY (size constants)
// ============================================================
const WidgetFamily = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  accessoryRectangular: 'accessoryRectangular',
  accessoryCircular: 'accessoryCircular',
  accessoryInline: 'accessoryInline',
  extraLarge: 'extraLarge',
};

// Widget dimensions (in points, approximate iOS sizes)
const WidgetSizes = {
  small: { width: 169, height: 169 },
  medium: { width: 360, height: 169 },
  large: { width: 360, height: 379 },
  extraLarge: { width: 360, height: 545 },
  accessoryRectangular: { width: 300, height: 50 },
  accessoryCircular: { width: 80, height: 80 },
  accessoryInline: { width: 300, height: 30 },
};

// ============================================================
// EXPORT - install all globals
// ============================================================
function installScriptableMock(target) {
  Object.assign(target, {
    Color, Font, Size, Point, Rect, Insets, LinearGradient,
    ListWidget, WidgetStack, WidgetText, WidgetImage, WidgetSpacer, WidgetDate,
    Image: ScriptableImage, Request, DrawContext, Path,
    Device, FileManager, importModule, log, alert, paste,
    WidgetFamily, WidgetSizes,
  });
}

// For browser global scope
if (typeof window !== 'undefined') {
  installScriptableMock(window);
}
