// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: wifi;

/**
 * Network Speed Monitor Widget
 * 实时网速监控小组件
 * 
 * Features:
 * - Real-time download/upload speed display
 * - Signal strength indicator
 * - Network type (WiFi/Cellular)
 * - IP address
 * - Ping latency
 * 
 * Supports: small, medium, large widget families
 * 
 * Usage on iOS:
 *   1. Install Scriptable app
 *   2. Add this script
 *   3. Set the widget parameter to your server URL (optional)
 *   4. Add widget to home screen
 * 
 * For browser preview:
 *   The preview server provides mock data at /api/network-speed
 */

// ══════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════

const CONFIG = {
  // Set your speed test server URL here (must return JSON with downloadSpeed, uploadSpeed, etc.)
  // Leave empty to use mock/demo data
  apiUrl: '',
  
  // Color scheme - dark gradient
  bgGradient: {
    light: [
      new Color('#667eea', 1),
      new Color('#764ba2', 1),
    ],
    dark: [
      new Color('#0f0c29', 1),
      new Color('#302b63', 1),
      new Color('#24243e', 1),
    ],
  },
  
  // Speed thresholds (Mbps) for color coding
  speedThresholds: {
    fast: 50,    // green
    medium: 10,  // yellow
    slow: 0,     // red
  },
  
  // Auto refresh interval (seconds) - for background refresh
  refreshInterval: 300,
};

// ══════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════

const widgetFamily = (typeof config !== 'undefined' && config.widgetFamily) 
  ? config.widgetFamily 
  : 'medium';

const widgetParameter = (typeof config !== 'undefined' && config.widgetParameter) 
  ? config.widgetParameter 
  : '';

// Allow override via widget parameter
if (widgetParameter && widgetParameter.startsWith('http')) {
  CONFIG.apiUrl = widgetParameter;
}

const widget = await createWidget();
if (typeof config !== 'undefined' && config.runInApp) {
  widget.presentMedium();
}
if (typeof Script !== 'undefined') {
  Script.setWidget(widget);
  Script.complete();
}

// ══════════════════════════════════════════
// WIDGET BUILDER
// ══════════════════════════════════════════

async function createWidget() {
  const data = await fetchNetworkData();
  
  const w = new ListWidget();
  w.url = 'speedtest://';
  
  // Background
  const isDark = true; // Always use dark for this widget
  const colors = isDark ? CONFIG.bgGradient.dark : CONFIG.bgGradient.light;
  const gradient = new LinearGradient();
  gradient.colors = colors;
  gradient.locations = colors.map((_, i) => i / (colors.length - 1));
  gradient.angle = 135;
  w.backgroundGradient = gradient;

  // Build based on size
  switch (widgetFamily) {
    case 'small':
      buildSmallWidget(w, data);
      break;
    case 'large':
      buildLargeWidget(w, data);
      break;
    case 'medium':
    default:
      buildMediumWidget(w, data);
      break;
  }

  return w;
}

// ══════════════════════════════════════════
// SMALL WIDGET (169 x 169)
// ══════════════════════════════════════════

function buildSmallWidget(w, data) {
  // Compact: just download speed + signal
  const titleStack = w.addStack();
  titleStack.layoutHorizontally();
  titleStack.centerAlignContent();
  
  const titleText = titleStack.addText('⬇');
  titleText.font = Font.mediumSystemFont(16);
  titleText.textColor = getSpeedColor(data.downloadSpeed);
  
  titleStack.addSpacer(6);
  
  const speedText = titleStack.addText(formatSpeed(data.downloadSpeed));
  speedText.font = Font.boldSystemFont(20);
  speedText.textColor = getSpeedColor(data.downloadSpeed);
  
  w.addSpacer(4);
  
  // Upload
  const upStack = w.addStack();
  upStack.layoutHorizontally();
  upStack.centerAlignContent();
  
  const upIcon = upStack.addText('⬆');
  upIcon.font = Font.mediumSystemFont(12);
  upIcon.textColor = getSpeedColor(data.uploadSpeed);
  
  upStack.addSpacer(4);
  
  const upText = upStack.addText(formatSpeed(data.uploadSpeed));
  upText.font = Font.semiboldSystemFont(14);
  upText.textColor = getSpeedColor(data.uploadSpeed);
  
  w.addSpacer();
  
  // Signal info at bottom
  const bottomStack = w.addStack();
  bottomStack.layoutHorizontally();
  bottomStack.centerAlignContent();
  
  const signalIcon = bottomStack.addText(getSignalIcon(data.signal));
  signalIcon.font = Font.mediumSystemFont(10);
  signalIcon.textColor = new Color('#aaaacc', 0.8);
  
  bottomStack.addSpacer(4);
  
  const typeText = bottomStack.addText(data.networkType || 'WiFi');
  typeText.font = Font.mediumSystemFont(10);
  typeText.textColor = new Color('#aaaacc', 0.8);
  
  bottomStack.addSpacer();
  
  const pingText = bottomStack.addText(`${data.ping}ms`);
  pingText.font = Font.mediumSystemFont(9);
  pingText.textColor = new Color('#aaaacc', 0.6);
}

// ══════════════════════════════════════════
// MEDIUM WIDGET (360 x 169)
// ══════════════════════════════════════════

function buildMediumWidget(w, data) {
  // Two columns: left = speeds, right = details
  const mainStack = w.addStack();
  mainStack.layoutHorizontally();
  mainStack.centerAlignContent();
  
  // ── Left column: Speed display ──
  const leftStack = mainStack.addStack();
  leftStack.layoutVertically();
  
  // Download
  const dlLabel = leftStack.addText('DOWNLOAD');
  dlLabel.font = Font.mediumSystemFont(9);
  dlLabel.textColor = new Color('#ffffff', 0.5);
  
  const dlStack = leftStack.addStack();
  dlStack.layoutHorizontally();
  dlStack.bottomAlignContent();
  
  const dlSpeed = dlStack.addText(formatSpeed(data.downloadSpeed).split(' ')[0]);
  dlSpeed.font = Font.boldSystemFont(32);
  dlSpeed.textColor = getSpeedColor(data.downloadSpeed);
  
  dlStack.addSpacer(2);
  
  const dlUnit = dlStack.addText(formatSpeed(data.downloadSpeed).split(' ')[1] || 'Mbps');
  dlUnit.font = Font.mediumSystemFont(11);
  dlUnit.textColor = new Color('#ffffff', 0.4);
  
  leftStack.addSpacer(6);
  
  // Upload
  const ulLabel = leftStack.addText('UPLOAD');
  ulLabel.font = Font.mediumSystemFont(9);
  ulLabel.textColor = new Color('#ffffff', 0.5);
  
  const ulStack = leftStack.addStack();
  ulStack.layoutHorizontally();
  ulStack.bottomAlignContent();
  
  const ulSpeed = ulStack.addText(formatSpeed(data.uploadSpeed).split(' ')[0]);
  ulSpeed.font = Font.boldSystemFont(22);
  ulSpeed.textColor = getSpeedColor(data.uploadSpeed);
  
  ulStack.addSpacer(2);
  
  const ulUnit = ulStack.addText(formatSpeed(data.uploadSpeed).split(' ')[1] || 'Mbps');
  ulUnit.font = Font.mediumSystemFont(10);
  ulUnit.textColor = new Color('#ffffff', 0.4);
  
  mainStack.addSpacer(20);
  
  // ── Right column: Details ──
  const rightStack = mainStack.addStack();
  rightStack.layoutVertically();
  rightStack.size = new Size(130, 0);
  
  // Signal bars
  const signalStack = rightStack.addStack();
  signalStack.layoutHorizontally();
  signalStack.centerAlignContent();
  
  const signalLabel = signalStack.addText('SIGNAL');
  signalLabel.font = Font.mediumSystemFont(8);
  signalLabel.textColor = new Color('#ffffff', 0.4);
  
  signalStack.addSpacer();
  
  // Signal strength bar
  const signalBars = signalStack.addText(getSignalBars(data.signal));
  signalBars.font = Font.mediumSystemFont(10);
  signalBars.textColor = getSpeedColor(data.signal / 2);
  
  rightStack.addSpacer(6);
  
  // Signal percentage
  const sigPct = rightStack.addText(`${data.signal}%`);
  sigPct.font = Font.semiboldSystemFont(14);
  sigPct.textColor = Color.white();
  
  rightStack.addSpacer(8);
  
  // Network type / SSID
  addInfoRow(rightStack, 'Type', data.networkType || 'WiFi');
  if (data.ssid) addInfoRow(rightStack, 'SSID', data.ssid);
  
  rightStack.addSpacer(6);
  
  // Ping
  const pingStack = rightStack.addStack();
  pingStack.layoutHorizontally();
  pingStack.centerAlignContent();
  
  const pingLabel = pingStack.addText('PING');
  pingLabel.font = Font.mediumSystemFont(8);
  pingLabel.textColor = new Color('#ffffff', 0.4);
  
  pingStack.addSpacer();
  
  const pingValue = pingStack.addText(`${data.ping}ms`);
  pingValue.font = Font.semiboldSystemFont(12);
  pingValue.textColor = getPingColor(data.ping);
  
  rightStack.addSpacer();
  
  // IP at bottom
  if (data.ip) {
    const ipText = rightStack.addText(data.ip);
    ipText.font = new Font('SF Mono', 9);
    ipText.textColor = new Color('#ffffff', 0.3);
    ipText.lineLimit = 1;
  }
}

// ══════════════════════════════════════════
// LARGE WIDGET (360 x 379)
// ══════════════════════════════════════════

function buildLargeWidget(w, data) {
  // Title row
  const titleStack = w.addStack();
  titleStack.layoutHorizontally();
  titleStack.centerAlignContent();
  
  const title = titleStack.addText('🌐 Network Monitor');
  title.font = Font.boldSystemFont(18);
  title.textColor = Color.white();
  
  titleStack.addSpacer();
  
  const time = titleStack.addText(formatTime(new Date()));
  time.font = new Font('SF Mono', 10);
  time.textColor = new Color('#ffffff', 0.4);
  
  w.addSpacer(12);
  
  // Speed cards row
  const cardsStack = w.addStack();
  cardsStack.layoutHorizontally();
  cardsStack.centerAlignContent();
  cardsStack.spacing = 10;
  
  // Download card
  const dlCard = cardsStack.addStack();
  dlCard.layoutVertically();
  dlCard.backgroundColor = new Color('#ffffff', 0.08);
  dlCard.cornerRadius = 14;
  dlCard.setPadding(12, 12, 12, 12);
  dlStack_layoutContent(dlCard, '⬇ DOWNLOAD', data.downloadSpeed);
  
  cardsStack.addSpacer(10);
  
  // Upload card
  const ulCard = cardsStack.addStack();
  ulCard.layoutVertically();
  ulCard.backgroundColor = new Color('#ffffff', 0.08);
  ulCard.cornerRadius = 14;
  ulCard.setPadding(12, 12, 12, 12);
  ulStack_layoutContent(ulCard, '⬆ UPLOAD', data.uploadSpeed);
  
  w.addSpacer(16);
  
  // Details section
  const detailsStack = w.addStack();
  detailsStack.layoutHorizontally();
  detailsStack.centerAlignContent();
  
  // Left details
  const leftDetails = detailsStack.addStack();
  leftDetails.layoutVertically();
  leftDetails.size = new Size(150, 0);
  
  const detailsTitle = leftDetails.addText('CONNECTION');
  detailsTitle.font = Font.mediumSystemFont(10);
  detailsTitle.textColor = new Color('#ffffff', 0.4);
  
  leftDetails.addSpacer(6);
  
  addInfoRowLarge(leftDetails, 'Type', data.networkType || 'WiFi');
  if (data.ssid) addInfoRowLarge(leftDetails, 'SSID', data.ssid);
  addInfoRowLarge(leftDetails, 'IP', data.ip || 'N/A');
  addInfoRowLarge(leftDetails, 'Ping', `${data.ping}ms`);
  
  detailsStack.addSpacer(20);
  
  // Right: Signal visualization
  const rightDetails = detailsStack.addStack();
  rightDetails.layoutVertically();
  
  const signalTitle = rightDetails.addText('SIGNAL STRENGTH');
  signalTitle.font = Font.mediumSystemFont(10);
  signalTitle.textColor = new Color('#ffffff', 0.4);
  
  rightDetails.addSpacer(8);
  
  // Large signal bars
  const signalViz = rightDetails.addText(getSignalBars(data.signal));
  signalViz.font = Font.boldSystemFont(28);
  signalViz.textColor = getSpeedColor(data.signal / 2);
  
  rightDetails.addSpacer(4);
  
  const signalPct = rightDetails.addText(`${data.signal}%  ${getSignalLabel(data.signal)}`);
  signalPct.font = Font.semiboldSystemFont(14);
  signalPct.textColor = Color.white();
  
  w.addSpacer();
  
  // Footer
  const footerStack = w.addStack();
  footerStack.layoutHorizontally();
  footerStack.centerAlignContent();
  
  const footerText = footerStack.addText(`Updated ${formatTime(new Date())} • Tap to refresh`);
  footerText.font = Font.mediumSystemFont(9);
  footerText.textColor = new Color('#ffffff', 0.3);
  
  footerStack.addSpacer();
  
  // Speed assessment
  const assessmentText = footerStack.addText(getSpeedAssessment(data.downloadSpeed));
  assessmentText.font = Font.mediumSystemFont(9);
  assessmentText.textColor = getSpeedColor(data.downloadSpeed);
}

// ══════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════

function dlStack_layoutContent(stack, label, speed) {
  const labelText = stack.addText(label);
  labelText.font = Font.mediumSystemFont(10);
  labelText.textColor = new Color('#ffffff', 0.5);
  
  stack.addSpacer(4);
  
  const speedStack = stack.addStack();
  speedStack.layoutHorizontally();
  speedStack.bottomAlignContent();
  
  const speedNum = speedStack.addText(formatSpeed(speed).split(' ')[0]);
  speedNum.font = Font.boldSystemFont(36);
  speedNum.textColor = getSpeedColor(speed);
  
  speedStack.addSpacer(3);
  
  const speedUnit = speedStack.addText(formatSpeed(speed).split(' ')[1] || 'Mbps');
  speedUnit.font = Font.mediumSystemFont(11);
  speedUnit.textColor = new Color('#ffffff', 0.4);
  
  stack.addSpacer();
  
  // Mini bar
  const barStack = stack.addStack();
  barStack.layoutHorizontally();
  barStack.size = new Size(130, 3);
}

function ulStack_layoutContent(stack, label, speed) {
  dlStack_layoutContent(stack, label, speed);
}

function addInfoRow(parent, label, value) {
  const stack = parent.addStack();
  stack.layoutHorizontally();
  stack.centerAlignContent();
  
  const labelText = stack.addText(label);
  labelText.font = Font.mediumSystemFont(8);
  labelText.textColor = new Color('#ffffff', 0.4);
  
  stack.addSpacer();
  
  const valueText = stack.addText(String(value));
  valueText.font = Font.mediumSystemFont(9);
  valueText.textColor = new Color('#ffffff', 0.7);
}

function addInfoRowLarge(parent, label, value) {
  const stack = parent.addStack();
  stack.layoutHorizontally();
  stack.centerAlignContent();
  
  const labelText = stack.addText(label);
  labelText.font = Font.mediumSystemFont(10);
  labelText.textColor = new Color('#ffffff', 0.4);
  
  stack.addSpacer();
  
  const valueText = stack.addText(String(value));
  valueText.font = Font.semiboldSystemFont(11);
  valueText.textColor = new Color('#ffffff', 0.8);
  valueText.lineLimit = 1;
}

function formatSpeed(mbps) {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(2)} Gbps`;
  } else if (mbps >= 100) {
    return `${mbps.toFixed(0)} Mbps`;
  } else if (mbps >= 10) {
    return `${mbps.toFixed(1)} Mbps`;
  } else {
    return `${mbps.toFixed(2)} Mbps`;
  }
}

function getSpeedColor(speed) {
  if (speed >= CONFIG.speedThresholds.fast) return new Color('#00d4aa');
  if (speed >= CONFIG.speedThresholds.medium) return new Color('#ffcc00');
  return new Color('#ff6b6b');
}

function getPingColor(ping) {
  if (ping < 20) return new Color('#00d4aa');
  if (ping < 50) return new Color('#ffcc00');
  return new Color('#ff6b6b');
}

function getSignalBars(signal) {
  if (signal >= 90) return '▮▮▮▮▮';
  if (signal >= 75) return '▮▮▮▮▯';
  if (signal >= 60) return '▮▮▮▯▯';
  if (signal >= 40) return '▮▮▯▯▯';
  if (signal >= 20) return '▮▯▯▯▯';
  return '▯▯▯▯▯';
}

function getSignalIcon(signal) {
  if (signal >= 75) return '▓▓▓';
  if (signal >= 50) return '▓▓░';
  if (signal >= 25) return '▓░░';
  return '░░░';
}

function getSignalLabel(signal) {
  if (signal >= 90) return 'Excellent';
  if (signal >= 75) return 'Good';
  if (signal >= 50) return 'Fair';
  if (signal >= 25) return 'Weak';
  return 'Poor';
}

function getSpeedAssessment(speed) {
  if (speed >= 100) return '🚀 Blazing Fast';
  if (speed >= 50) return '✅ Fast';
  if (speed >= 10) return '⚡ Moderate';
  return '🐌 Slow';
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// ══════════════════════════════════════════
// DATA FETCHING
// ══════════════════════════════════════════

async function fetchNetworkData() {
  // If API URL configured, fetch real data
  if (CONFIG.apiUrl) {
    try {
      const req = new Request(CONFIG.apiUrl);
      const data = await req.loadJSON();
      return {
        downloadSpeed: data.downloadSpeed || 0,
        uploadSpeed: data.uploadSpeed || 0,
        ping: data.ping || 0,
        signal: data.signal || 0,
        networkType: data.networkType || 'WiFi',
        ssid: data.ssid || '',
        ip: data.ip || '',
        timestamp: Date.now(),
      };
    } catch (e) {
      console.log('Fetch error: ' + e);
    }
  }
  
  // Browser preview: try fetching from preview server
  if (typeof fetch !== 'undefined' && typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/network-speed');
      if (res.ok) return await res.json();
    } catch (e) {
      // ignore
    }
  }
  
  // iOS demo/mock data
  return {
    downloadSpeed: 45.7,
    uploadSpeed: 12.3,
    ping: 18,
    signal: 82,
    networkType: 'WiFi',
    ssid: 'MyHome-5G',
    ip: '192.168.1.100',
    timestamp: Date.now(),
  };
}
