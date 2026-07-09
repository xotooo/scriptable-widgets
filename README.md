# 📱 Scriptable Widgets Collection

Scriptable iOS 小组件合集 — 包含网速监控、背单词小组件，以及一套无需 iOS 设备即可在浏览器中实时预览/调试小组件的完整开发框架。

## ✨ Features

- **📊 Network Speed Monitor** — 实时显示上传/下载速度、WiFi信号强度、延迟、IP地址
- **📖 Vocabulary Builder** — 每日单词、音标、中英释义、例句、词根词缀、衍生词、同义反义词
- **🖥️ Browser Preview Server** — 无需 iPhone，在浏览器中实时渲染和调试所有小组件
- **📦 Script Collection** — 从 5 个热门 GitHub 仓库收集的 48+ 个 Scriptable 脚本

## 🚀 Quick Start

### Browser Preview (无需 iOS 设备)

```bash
cd preview-server
node server.js
# 打开 http://localhost:8888
```

在浏览器中即可看到小组件的实时渲染效果，支持切换：
- 小组件类型（网速监控 / 背单词）
- 尺寸（小 Small / 中 Medium / 大 Large / 全部）
- 实时刷新
- 查看源代码
- 浏览脚本收藏

### iOS 上使用

1. 从 App Store 下载 [Scriptable](https://scriptable.app)（$4.99）
2. 将 `widgets/` 目录下的 `.js` 文件复制到 Scriptable
3. 在主屏幕添加小组件，选择 Scriptable
4. 在小组件上长按 → 编辑 → 选择对应脚本

## 📊 Network Speed Widget

显示实时网络状态：

| Size | 显示内容 |
|------|---------|
| Small (169×169) | 下载速度、上传速度、信号图标、延迟 |
| Medium (360×169) | 双列布局：速度大数字 + 信号/网络/IP详情 |
| Large (360×379) | 速度卡片 + 连接详情 + 信号可视化 + 速度评级 |

**自定义数据源：**

小组件 Widget Parameter 填入你的 API URL，API 需返回：

```json
{
  "downloadSpeed": 45.7,
  "uploadSpeed": 12.3,
  "ping": 18,
  "signal": 82,
  "networkType": "WiFi",
  "ssid": "MyHome-5G",
  "ip": "192.168.1.100"
}
```

颜色根据速度自动变化：
- 🟢 ≥50 Mbps: 快
- 🟡 ≥10 Mbps: 中
- 🔴 <10 Mbps: 慢

## 📖 Vocabulary Widget

每日一个精选单词：

| Size | 显示内容 |
|------|---------|
| Small | 单词、音标、中文释义、词性、难度标签 |
| Medium | 双列：单词+释义+例句+同义词 / 词根+衍生词+反义词 |
| Large | 完整信息：单词+音标+双语释义+例句卡片+词源+衍生词+同义反义 |

内置 15+ 个精选 GRE/TOEFL 高频词汇，每天自动轮换。支持自定义 API：

Widget Parameter 填入你的 API URL，返回格式：

```json
{
  "word": "ephemeral",
  "phonetic": "/ɪˈfemərəl/",
  "pos": "adj.",
  "def": "lasting for a very short time",
  "defCn": "短暂的；瞬息的",
  "examples": [{ "en": "...", "cn": "..." }],
  "roots": [{ "part": "epi-", "meaning": "on, upon" }],
  "literalMeaning": "lasting only a day",
  "derivatives": [{ "word": "ephemerality", "pos": "n.", "def": "短暂性" }],
  "synonyms": ["transient", "fleeting"],
  "antonyms": ["permanent", "eternal"],
  "level": "GRE"
}
```

## 🖥️ Preview Server

Browser-based rendering framework that emulates the Scriptable iOS API:

- `Color` — all iOS system colors + hex + alpha + dynamic colors
- `Font` — system fonts, bold, semibold, monospaced, rounded
- `ListWidget` — root container with gradient background
- `WidgetStack` — horizontal/vertical layout, padding, spacing
- `WidgetText` — text with font, color, opacity, line limit
- `WidgetImage` — images with size, corner radius, tint
- `DrawContext` — canvas-based rendering (fillRect, fillEllipse, etc.)
- `Path` — 2D path construction
- `Request` — HTTP fetch (loadJSON, loadString, loadImage)
- `FileManager` — localStorage-backed file system mock
- `Device` — simulated device info

## 📦 Collection

从以下 GitHub 仓库收集的 Scriptable 脚本：

| 来源 | 脚本数 | 内容 |
|------|--------|------|
| [gideonsenku/Scriptable](https://github.com/gideonsenku/Scriptable) | 13 | B站监控、豆瓣、RSS、微博、知乎、Claude用量、倒计时等 |
| [yaylinda/scriptable](https://github.com/yaylinda/scriptable) | 6 | 日历、Discord、终端风格、文字时钟等 |
| [Enjoyee/Scriptable](https://github.com/Enjoyee/Scriptable) | 13 | 彩云天气、基金、动森、热搜轮播、日历天气等 |
| [supermamon/scriptable-scripts](https://github.com/supermamon/scriptable-scripts) | 12 | 天气、XKCD、按钮组件、文本组件、OAuth2等 |
| [marcjulianschwarz/scriptable-widgets](https://github.com/marcjulianschwarz/scriptable-widgets) | 5 | NASA图片、新闻、德国降雨雷达、太空发射等 |

## 📁 Project Structure

```
scriptable-widgets/
├── widgets/
│   ├── network-speed/
│   │   └── network-speed.js       # 网速监控小组件
│   └── vocabulary/
│       └── vocabulary.js          # 背单词小组件
├── preview-server/
│   ├── server.js                  # Node.js HTTP 服务器
│   ├── lib/
│   │   └── scriptable-mock.js     # Scriptable API 浏览器模拟层
│   └── public/
│       └── index.html             # 预览界面
├── collection/                    # 收集的社区脚本
│   ├── gideonsenku/
│   ├── yaylinda/
│   ├── enjoyee/
│   ├── supermamon/
│   └── marcjulianschwarz/
└── README.md
```

## 📝 License

Widget code: MIT
Collection scripts: respect original authors' licenses
