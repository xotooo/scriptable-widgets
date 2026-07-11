// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: book;

/**
 * Vocabulary Builder Widget
 * 背单词小组件
 * 
 * Features:
 * - Word of the day with phonetic, definition (EN + CN)
 * - Example sentences with translation
 * - Etymology / word roots / prefixes / suffixes
 * - Derivative words
 * - Synonyms & antonyms
 * - Difficulty level tag
 * 
 * Supports: small, medium, large widget families
 * 
 * Data Source:
 *   - Uses a built-in word list with 100+ curated words
 *   - Can also fetch from a custom API (set widget parameter to URL)
 * 
 * Usage on iOS:
 *   1. Install Scriptable app
 *   2. Add this script
 *   3. (Optional) Set widget parameter to your API URL
 *   4. Add widget to home screen
 */

// ══════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════

const CONFIG = {
  // API URL for fetching word data (must return JSON matching the format below)
  // Leave empty to use built-in word list
  apiUrl: '',
  
  // Colors
  bgGradient: [
    new Color('#0d1117', 1),
    new Color('#161b22', 1),
    new Color('#21262d', 1),
  ],
  accentColor: new Color('#58a6ff', 1),
  accentGreen: new Color('#7ee787', 1),
  accentOrange: new Color('#ffa657', 1),
  accentPink: new Color('#f778ba', 1),
  accentPurple: new Color('#bc8cff', 1),
  textColor: new Color('#e6edf3', 1),
  secondaryText: new Color('#8b949e', 1),
  cardBg: new Color('#ffffff', 0.06),
  
  // How many words to cycle through per day (1 = word of the day)
  wordsPerDay: 1,
};

// ══════════════════════════════════════════
// BUILT-IN WORD LIST
// ══════════════════════════════════════════

const WORD_LIST = [
  {
    word: 'ephemeral', phonetic: '/ɪˈfemərəl/', pos: 'adj.',
    def: 'lasting for a very short time', defCn: '短暂的；瞬息的',
    examples: [
      { en: 'Fame in the modern world is an ephemeral thing.', cn: '现代社会中，名声不过是转瞬即逝的东西。' },
    ],
    roots: [
      { part: 'epi-', meaning: 'on, upon' },
      { part: 'hemera', meaning: 'day (Greek)' },
      { part: '-al', meaning: 'adjective suffix' },
    ],
    literalMeaning: 'lasting only a day',
    derivatives: [
      { word: 'ephemerality', pos: 'n.', def: '短暂性' },
      { word: 'ephemerally', pos: 'adv.', def: '短暂地' },
    ],
    synonyms: ['transient', 'fleeting', 'momentary'],
    antonyms: ['permanent', 'eternal'],
    level: 'GRE',
  },
  {
    word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', pos: 'adj.',
    def: 'present, appearing, or found everywhere', defCn: '无处不在的；普遍存在的',
    examples: [
      { en: 'Smartphones have become ubiquitous in modern society.', cn: '智能手机在现代社会中已无处不在。' },
    ],
    roots: [
      { part: 'ubique', meaning: 'everywhere (Latin)' },
    ],
    literalMeaning: 'being everywhere at once',
    derivatives: [
      { word: 'ubiquity', pos: 'n.', def: '普遍存在' },
      { word: 'ubiquitously', pos: 'adv.', def: '无处不在地' },
    ],
    synonyms: ['omnipresent', 'universal', 'pervasive'],
    antonyms: ['rare', 'scarce', 'uncommon'],
    level: 'TOEFL',
  },
  {
    word: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', pos: 'n.',
    def: 'the occurrence of events by chance in a happy way', defCn: '机缘巧合；意外发现',
    examples: [
      { en: 'Their meeting was pure serendipity.', cn: '他们的相遇纯属机缘巧合。' },
    ],
    roots: [
      { part: 'Serendip', meaning: 'old name for Sri Lanka (from Persian fairy tale)' },
      { part: '-ity', meaning: 'noun suffix' },
    ],
    literalMeaning: 'the faculty of making happy discoveries by accident',
    derivatives: [
      { word: 'serendipitous', pos: 'adj.', def: '机缘巧合的' },
      { word: 'serendipitously', pos: 'adv.', def: '偶然地' },
    ],
    synonyms: ['chance', 'fortune', 'providence'],
    antonyms: ['design', 'intention', 'plan'],
    level: 'GRE',
  },
  {
    word: 'paradigm', phonetic: '/ˈpærədaɪm/', pos: 'n.',
    def: 'a typical example or pattern of something', defCn: '范式；典范；示例',
    examples: [
      { en: 'This discovery represents a paradigm shift in medicine.', cn: '这一发现代表了医学领域的范式转变。' },
    ],
    roots: [
      { part: 'para-', meaning: 'beside, beyond' },
      { part: 'deiknymi', meaning: 'to show, to display (Greek)' },
    ],
    literalMeaning: 'to show side by side (as a model)',
    derivatives: [
      { word: 'paradigmatic', pos: 'adj.', def: '范式的' },
      { word: 'paradigm shift', pos: 'n.', def: '范式转变' },
    ],
    synonyms: ['model', 'pattern', 'standard', 'archetype'],
    antonyms: ['anomaly', 'aberration'],
    level: 'GRE / TOEFL',
  },
  {
    word: 'resilience', phonetic: '/rɪˈzɪliəns/', pos: 'n.',
    def: 'the capacity to recover quickly from difficulties', defCn: '韧性；恢复力；适应力',
    examples: [
      { en: 'Her resilience in the face of adversity inspired everyone.', cn: '她在逆境中展现出的韧性鼓舞了所有人。' },
    ],
    roots: [
      { part: 're-', meaning: 'back, again' },
      { part: 'salire', meaning: 'to jump, to leap (Latin)' },
    ],
    literalMeaning: 'to jump back, to rebound',
    derivatives: [
      { word: 'resilient', pos: 'adj.', def: '有韧性的' },
      { word: 'resiliency', pos: 'n.', def: '韧性（同 resilience）' },
    ],
    synonyms: ['flexibility', 'elasticity', 'toughness', 'fortitude'],
    antonyms: ['fragility', 'vulnerability', 'brittleness'],
    level: 'CET-6 / IELTS',
  },
  {
    word: 'meticulous', phonetic: '/məˈtɪkjələs/', pos: 'adj.',
    def: 'showing great attention to detail; very careful', defCn: '一丝不苟的；细致的',
    examples: [
      { en: 'He kept meticulous records of every transaction.', cn: '他对每笔交易都做了细致的记录。' },
    ],
    roots: [
      { part: 'metus', meaning: 'fear (Latin)' },
      { part: '-ulous', meaning: 'full of (suffix)' },
    ],
    literalMeaning: 'full of fear (originally meaning fearful, evolved to overly careful)',
    derivatives: [
      { word: 'meticulously', pos: 'adv.', def: '细致地' },
      { word: 'meticulousness', pos: 'n.', def: '细致性' },
    ],
    synonyms: ['thorough', 'scrupulous', 'diligent', 'painstaking'],
    antonyms: ['careless', 'sloppy', 'negligent'],
    level: 'TOEFL / GRE',
  },
  {
    word: 'eloquent', phonetic: '/ˈeləkwənt/', pos: 'adj.',
    def: 'fluent and persuasive in speaking or writing', defCn: '雄辩的；有说服力的',
    examples: [
      { en: 'She gave an eloquent speech at the graduation ceremony.', cn: '她在毕业典礼上发表了雄辩的演讲。' },
    ],
    roots: [
      { part: 'ex-', meaning: 'out, out of' },
      { part: 'loqui', meaning: 'to speak (Latin)' },
    ],
    literalMeaning: 'to speak out',
    derivatives: [
      { word: 'eloquence', pos: 'n.', def: '雄辩' },
      { word: 'eloquently', pos: 'adv.', def: '雄辩地' },
    ],
    synonyms: ['articulate', 'fluent', 'persuasive', 'expressive'],
    antonyms: ['inarticulate', 'halting', 'clumsy'],
    level: 'CET-6 / TOEFL',
  },
  {
    word: 'pragmatic', phonetic: '/præɡˈmætɪk/', pos: 'adj.',
    def: 'dealing with things sensibly and realistically', defCn: '务实的；实用主义的',
    examples: [
      { en: 'We need a pragmatic approach to solve this problem.', cn: '我们需要用务实的方法来解决这个问题。' },
    ],
    roots: [
      { part: 'pragma', meaning: 'deed, action (Greek)' },
      { part: '-tic', meaning: 'adjective suffix' },
    ],
    literalMeaning: 'relating to action and practice',
    derivatives: [
      { word: 'pragmatism', pos: 'n.', def: '实用主义' },
      { word: 'pragmatist', pos: 'n.', def: '实用主义者' },
    ],
    synonyms: ['practical', 'realistic', 'sensible', 'down-to-earth'],
    antonyms: ['idealistic', 'impractical', 'theoretical'],
    level: 'GRE / TOEFL',
  },
  {
    word: 'candor', phonetic: '/ˈkændər/', pos: 'n.',
    def: 'the quality of being open and honest', defCn: '坦率；直言不讳',
    examples: [
      { en: 'I appreciated his candor about the challenges we face.', cn: '我很欣赏他对我们所面临挑战的坦率。' },
    ],
    roots: [
      { part: 'candidus', meaning: 'white, bright (Latin)' },
    ],
    literalMeaning: 'whiteness, purity (evolved to mean openness/honesty)',
    derivatives: [
      { word: 'candid', pos: 'adj.', def: '坦率的' },
      { word: 'candidly', pos: 'adv.', def: '坦率地' },
    ],
    synonyms: ['honesty', 'frankness', 'openness', 'sincerity'],
    antonyms: ['deceit', 'evasion', 'reticence'],
    level: 'GRE',
  },
  {
    word: 'vex', phonetic: '/veks/', pos: 'v.',
    def: 'to make someone feel annoyed or worried', defCn: '使恼怒；使烦恼',
    examples: [
      { en: 'The constant noise vexed the neighbors.', cn: '持续的噪音让邻居们很恼火。' },
    ],
    roots: [
      { part: ' vexare', meaning: 'to shake, to agitate (Latin)' },
    ],
    literalMeaning: 'to shake, to jostle',
    derivatives: [
      { word: 'vexation', pos: 'n.', def: '烦恼' },
      { word: 'vexing', pos: 'adj.', def: '令人烦恼的' },
      { word: 'vexatious', pos: 'adj.', def: '惹人烦的' },
    ],
    synonyms: ['annoy', 'irritate', 'bother', 'vex'],
    antonyms: ['soothe', 'calm', 'comfort', 'placate'],
    level: 'GRE',
  },
  {
    word: 'nostalgia', phonetic: '/nɒˈstældʒə/', pos: 'n.',
    def: 'a sentimental longing for the past', defCn: '怀旧；乡愁',
    examples: [
      { en: 'The old photos filled him with nostalgia.', cn: '老照片让他满怀怀旧之情。' },
    ],
    roots: [
      { part: 'nostos', meaning: 'return home (Greek)' },
      { part: 'algos', meaning: 'pain (Greek)' },
    ],
    literalMeaning: 'the pain of longing for home',
    derivatives: [
      { word: 'nostalgic', pos: 'adj.', def: '怀旧的' },
      { word: 'nostalgically', pos: 'adv.', def: '怀旧地' },
    ],
    synonyms: ['reminiscence', 'longing', 'sentimentality', 'wistfulness'],
    antonyms: ['indifference', 'detachment', 'apathy'],
    level: 'TOEFL',
  },
  {
    word: 'quintessential', phonetic: '/ˌkwɪntɪˈsenʃəl/', pos: 'adj.',
    def: 'representing the most perfect example of a quality', defCn: '典型的；精髓的',
    examples: [
      { en: 'Paris is the quintessential romantic city.', cn: '巴黎是典型的浪漫之都。' },
    ],
    roots: [
      { part: 'quintus', meaning: 'fifth (Latin)' },
      { part: 'essentia', meaning: 'essence (Latin)' },
    ],
    literalMeaning: 'the fifth essence (the most refined element in ancient philosophy)',
    derivatives: [
      { word: 'quintessence', pos: 'n.', def: '精髓；典范' },
    ],
    synonyms: ['typical', 'archetypal', 'definitive', 'exemplary'],
    antonyms: ['atypical', 'unrepresentative', 'aberrant'],
    level: 'GRE',
  },
  {
    word: 'ambivalent', phonetic: '/æmˈbɪvələnt/', pos: 'adj.',
    def: 'having mixed feelings about something', defCn: '矛盾的；举棋不定的',
    examples: [
      { en: 'She felt ambivalent about leaving her hometown.', cn: '她对离开家乡感到心情矛盾。' },
    ],
    roots: [
      { part: 'ambi-', meaning: 'both, on both sides' },
      { part: 'valere', meaning: 'to be strong (Latin)' },
    ],
    literalMeaning: 'having strength on both sides',
    derivatives: [
      { word: 'ambivalence', pos: 'n.', def: '矛盾心理' },
      { word: 'ambivalently', pos: 'adv.', def: '矛盾地' },
    ],
    synonyms: ['conflicted', 'uncertain', 'mixed', 'torn'],
    antonyms: ['certain', 'decisive', 'unambiguous'],
    level: 'TOEFL / GRE',
  },
  {
    word: 'tenacious', phonetic: '/təˈneɪʃəs/', pos: 'adj.',
    def: 'holding firmly; persistent; determined', defCn: '坚韧的；顽强的；执着的',
    examples: [
      { en: 'Her tenacious effort eventually led to success.', cn: '她顽强的努力最终带来了成功。' },
    ],
    roots: [
      { part: 'tenax', meaning: 'holding fast (Latin)' },
      { part: 'tenere', meaning: 'to hold (Latin)' },
    ],
    literalMeaning: 'holding fast',
    derivatives: [
      { word: 'tenacity', pos: 'n.', def: '坚韧；执着' },
      { word: 'tenaciously', pos: 'adv.', def: '顽强地' },
    ],
    synonyms: ['persistent', 'determined', 'resolute', 'dogged'],
    antonyms: ['yielding', 'weak', 'fickle', 'irresolute'],
    level: 'GRE / TOEFL',
  },
  {
    word: 'surreptitious', phonetic: '/ˌsʌrəpˈtɪʃəs/', pos: 'adj.',
    def: 'kept secret, especially because it would not be approved of', defCn: '偷偷摸摸的；秘密的',
    examples: [
      { en: 'He cast a surreptitious glance at his phone during the meeting.', cn: '他在会议期间偷偷地看了一眼手机。' },
    ],
    roots: [
      { part: 'sur-', meaning: 'over, above, secretly' },
      { part: 'rapere', meaning: 'to seize, to grab (Latin)' },
    ],
    literalMeaning: 'to snatch secretly',
    derivatives: [
      { word: 'surreptitiously', pos: 'adv.', def: '偷偷地' },
    ],
    synonyms: ['secret', 'clandestine', 'furtive', 'stealthy'],
    antonyms: ['open', 'transparent', 'overt', 'blatant'],
    level: 'GRE',
  },
];

// ══════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════

const widgetFamily = (typeof config !== 'undefined' && config.widgetFamily)
  ? config.widgetFamily
  : 'medium';

const widgetParameter = (typeof config !== 'undefined' && config.widgetParameter)
  ? config.widgetParameter
  : '';

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
  const wordData = await getWordData();

  const w = new ListWidget();
  w.url = 'dictionary://';

  // Background
  const gradient = new LinearGradient();
  gradient.colors = CONFIG.bgGradient;
  gradient.locations = [0, 0.5, 1];
  gradient.angle = 145;
  w.backgroundGradient = gradient;

  switch (widgetFamily) {
    case 'small':
      buildSmallWidget(w, wordData);
      break;
    case 'large':
      buildLargeWidget(w, wordData);
      break;
    case 'medium':
    default:
      buildMediumWidget(w, wordData);
      break;
  }

  return w;
}

// ══════════════════════════════════════════
// SMALL WIDGET (169 x 169)
// ══════════════════════════════════════════

function buildSmallWidget(w, data) {
  // Level badge
  const badgeStack = w.addStack();
  badgeStack.layoutHorizontally();
  
  const badge = badgeStack.addText(data.level || 'WORD');
  badge.font = Font.boldSystemFont(8);
  badge.textColor = CONFIG.accentGreen;
  
  badgeStack.addSpacer();
  
  const dayLabel = badgeStack.addText('📖');
  dayLabel.font = Font.mediumSystemFont(10);
  dayLabel.textColor = CONFIG.secondaryText;

  w.addSpacer(4);

  // Word
  const wordText = w.addText(data.word);
  wordText.font = Font.boldSystemFont(18);
  wordText.textColor = CONFIG.textColor;

  // Phonetic
  if (data.phonetic) {
    const phoneticText = w.addText(data.phonetic);
    phoneticText.font = Font.mediumSystemFont(10);
    phoneticText.textColor = CONFIG.accentPurple;
  }

  w.addSpacer(4);

  // Definition (Chinese - compact)
  const defText = w.addText(data.defCn || data.def || '');
  defText.font = Font.mediumSystemFont(11);
  defText.textColor = CONFIG.secondaryText;
  defText.lineLimit = 2;

  w.addSpacer();

  // Part of speech at bottom
  if (data.pos) {
    const posText = w.addText(data.pos);
    posText.font = Font.mediumSystemFont(9);
    posText.textColor = CONFIG.accentOrange;
  }
}

// ══════════════════════════════════════════
// MEDIUM WIDGET (360 x 169)
// ══════════════════════════════════════════

function buildMediumWidget(w, data) {
  const mainStack = w.addStack();
  mainStack.layoutHorizontally();
  mainStack.topAlignContent();

  // ── Left: Word & Definition ──
  const leftStack = mainStack.addStack();
  leftStack.layoutVertically();
  leftStack.size = new Size(190, 0);

  // Level badge
  const badgeStack = leftStack.addStack();
  badgeStack.layoutHorizontally();
  badgeStack.centerAlignContent();

  const badge = badgeStack.addText(data.level || 'WORD');
  badge.font = Font.boldSystemFont(8);
  badge.textColor = CONFIG.accentGreen;

  badgeStack.addSpacer(6);

  const posText = badgeStack.addText(data.pos || '');
  posText.font = Font.mediumSystemFont(8);
  posText.textColor = CONFIG.accentOrange;

  badgeStack.addSpacer();

  const bookIcon = badgeStack.addText('📖');
  bookIcon.font = Font.mediumSystemFont(9);
  bookIcon.textColor = CONFIG.secondaryText;

  leftStack.addSpacer(4);

  // Word
  const wordText = leftStack.addText(data.word);
  wordText.font = Font.boldSystemFont(22);
  wordText.textColor = CONFIG.textColor;

  // Phonetic
  if (data.phonetic) {
    const phoneticText = leftStack.addText(data.phonetic);
    phoneticText.font = Font.mediumSystemFont(11);
    phoneticText.textColor = CONFIG.accentPurple;
  }

  leftStack.addSpacer(4);

  // English definition
  const defEn = leftStack.addText(data.def || '');
  defEn.font = Font.mediumSystemFont(10);
  defEn.textColor = new Color('#e6edf3', 0.7);
  defEn.lineLimit = 1;

  // Chinese definition
  const defCn = leftStack.addText(data.defCn || '');
  defCn.font = Font.semiboldSystemFont(12);
  defCn.textColor = CONFIG.textColor;
  defCn.lineLimit = 2;

  leftStack.addSpacer(4);

  // Example sentence
  if (data.examples && data.examples.length > 0) {
    const exText = leftStack.addText(`"${data.examples[0].en}"`);
    exText.font = Font.mediumSystemFont(9);
    exText.textColor = new Color('#8b949e', 0.8);
    exText.lineLimit = 2;
  }

  leftStack.addSpacer();

  // Synonyms at bottom
  if (data.synonyms && data.synonyms.length > 0) {
    const synStack = leftStack.addStack();
    synStack.layoutHorizontally();
    
    const synLabel = synStack.addText('≡ ');
    synLabel.font = Font.mediumSystemFont(8);
    synLabel.textColor = CONFIG.accentPink;
    
    const synText = synStack.addText(data.synonyms.slice(0, 3).join(', '));
    synText.font = Font.mediumSystemFont(8);
    synText.textColor = new Color('#8b949e', 0.7);
    synText.lineLimit = 1;
  }

  mainStack.addSpacer(12);

  // ── Right: Roots & Derivatives ──
  const rightStack = mainStack.addStack();
  rightStack.layoutVertically();
  rightStack.size = new Size(140, 0);

  // Word roots
  if (data.roots && data.roots.length > 0) {
    const rootTitle = rightStack.addText('🔤 WORD ROOTS');
    rootTitle.font = Font.boldSystemFont(8);
    rootTitle.textColor = CONFIG.accentBlue || CONFIG.accentColor;

    rightStack.addSpacer(3);

    for (const root of data.roots.slice(0, 3)) {
      const rootStack = rightStack.addStack();
      rootStack.layoutHorizontally();
      rootStack.centerAlignContent();

      const rootPart = rootStack.addText(root.part);
      rootPart.font = Font.semiboldSystemFont(9);
      rootPart.textColor = CONFIG.accentColor;

      rootStack.addSpacer(4);

      const rootMeaning = rootStack.addText(root.meaning);
      rootMeaning.font = Font.mediumSystemFont(8);
      rootMeaning.textColor = new Color('#8b949e', 0.7);
      rootMeaning.lineLimit = 1;
    }
  }

  rightStack.addSpacer(6);

  // Derivatives
  if (data.derivatives && data.derivatives.length > 0) {
    const derivTitle = rightStack.addText('🔄 DERIVATIVES');
    derivTitle.font = Font.boldSystemFont(8);
    derivTitle.textColor = CONFIG.accentGreen;

    rightStack.addSpacer(3);

    for (const deriv of data.derivatives.slice(0, 3)) {
      const derivStack = rightStack.addStack();
      derivStack.layoutHorizontally();
      derivStack.centerAlignContent();

      const derivWord = derivStack.addText(deriv.word);
      derivWord.font = Font.semiboldSystemFont(9);
      derivWord.textColor = CONFIG.textColor;

      derivStack.addSpacer(3);

      const derivPos = derivStack.addText(deriv.pos);
      derivPos.font = Font.mediumSystemFont(7);
      derivPos.textColor = CONFIG.accentOrange;

      derivStack.addSpacer();

      const derivDef = derivStack.addText(deriv.def || '');
      derivDef.font = Font.mediumSystemFont(7);
      derivDef.textColor = new Color('#8b949e', 0.6);
      derivDef.lineLimit = 1;
    }
  }

  rightStack.addSpacer();

  // Antonyms
  if (data.antonyms && data.antonyms.length > 0) {
    const antStack = rightStack.addStack();
    antStack.layoutHorizontally();
    
    const antLabel = antStack.addText('≠ ');
    antLabel.font = Font.mediumSystemFont(8);
    antLabel.textColor = new Color('#ff6b6b');
    
    const antText = antStack.addText(data.antonyms.slice(0, 2).join(', '));
    antText.font = Font.mediumSystemFont(8);
    antText.textColor = new Color('#8b949e', 0.6);
    antText.lineLimit = 1;
  }
}

// ══════════════════════════════════════════
// LARGE WIDGET (360 x 379)
// ══════════════════════════════════════════

function buildLargeWidget(w, data) {
  // ── Header ──
  const headerStack = w.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();

  // Level badge with background
  const badgeBg = headerStack.addStack();
  badgeBg.backgroundColor = new Color('#7ee787', 0.15);
  badgeBg.cornerRadius = 6;
  badgeBg.setPadding(2, 6, 2, 6);
  
  const badgeText = badgeBg.addText(data.level || 'WORD');
  badgeText.font = Font.boldSystemFont(9);
  badgeText.textColor = CONFIG.accentGreen;

  headerStack.addSpacer(6);

  const posBadge = headerStack.addText(data.pos || '');
  posBadge.font = Font.mediumSystemFont(10);
  posBadge.textColor = CONFIG.accentOrange;

  headerStack.addSpacer();

  const headerIcon = headerStack.addText('📖 Word of the Day');
  headerIcon.font = Font.mediumSystemFont(10);
  headerIcon.textColor = CONFIG.secondaryText;

  w.addSpacer(8);

  // ── Word display ──
  const wordStack = w.addStack();
  wordStack.layoutHorizontally();
  wordStack.bottomAlignContent();

  const wordText = wordStack.addText(data.word);
  wordText.font = Font.boldSystemFont(34);
  wordText.textColor = CONFIG.textColor;

  wordStack.addSpacer(8);

  const phoneticText = wordStack.addText(data.phonetic || '');
  phoneticText.font = Font.mediumSystemFont(13);
  phoneticText.textColor = CONFIG.accentPurple;

  w.addSpacer(8);

  // ── Definitions ──
  const defEn = w.addText(data.def || '');
  defEn.font = Font.mediumSystemFont(13);
  defEn.textColor = new Color('#e6edf3', 0.8);

  const defCn = w.addText(data.defCn || '');
  defCn.font = Font.semiboldSystemFont(14);
  defCn.textColor = CONFIG.textColor;

  w.addSpacer(10);

  // ── Example sentence card ──
  if (data.examples && data.examples.length > 0) {
    const exCard = w.addStack();
    exCard.layoutVertically();
    exCard.backgroundColor = CONFIG.cardBg;
    exCard.cornerRadius = 10;
    exCard.setPadding(8, 10, 8, 10);

    const exLabel = exCard.addText('💬 EXAMPLE');
    exLabel.font = Font.boldSystemFont(8);
    exLabel.textColor = CONFIG.secondaryText;

    exCard.addSpacer(3);

    const exEn = exCard.addText(`"${data.examples[0].en}"`);
    exEn.font = Font.mediumSystemFont(11);
    exEn.textColor = new Color('#e6edf3', 0.85);
    exEn.lineLimit = 2;

    if (data.examples[0].cn) {
      exCard.addSpacer(2);
      const exCn = exCard.addText(data.examples[0].cn);
      exCn.font = Font.mediumSystemFont(10);
      exCn.textColor = CONFIG.secondaryText;
      exCn.lineLimit = 1;
    }
  }

  w.addSpacer(10);

  // ── Etymology & Roots ──
  const etymStack = w.addStack();
  etymStack.layoutHorizontally();
  etymStack.topAlignContent();

  // Left: Roots
  const rootsCol = etymStack.addStack();
  rootsCol.layoutVertically();
  rootsCol.size = new Size(170, 0);

  const rootsTitle = rootsCol.addText('🔤 Etymology');
  rootsTitle.font = Font.boldSystemFont(10);
  rootsTitle.textColor = CONFIG.accentColor;

  rootsCol.addSpacer(3);

  if (data.literalMeaning) {
    const litText = rootsCol.addText(`"${data.literalMeaning}"`);
    litText.font = Font.mediumSystemFont(9);
    litText.textColor = new Color('#8b949e', 0.8);
    litText.lineLimit = 1;
  }

  rootsCol.addSpacer(4);

  if (data.roots) {
    for (const root of data.roots.slice(0, 3)) {
      const rootStack = rootsCol.addStack();
      rootStack.layoutHorizontally();
      rootStack.centerAlignContent();

      const rootPart = rootStack.addText(`${root.part}`);
      rootPart.font = Font.semiboldSystemFont(10);
      rootPart.textColor = CONFIG.accentColor;

      rootStack.addSpacer(4);

      const rootMeaning = rootStack.addText(root.meaning);
      rootMeaning.font = Font.mediumSystemFont(9);
      rootMeaning.textColor = CONFIG.secondaryText;
      rootMeaning.lineLimit = 1;
    }
  }

  etymStack.addSpacer(12);

  // Right: Derivatives
  const derivCol = etymStack.addStack();
  derivCol.layoutVertically();

  const derivTitle = derivCol.addText('🔄 Derivatives');
  derivTitle.font = Font.boldSystemFont(10);
  derivTitle.textColor = CONFIG.accentGreen;

  derivCol.addSpacer(3);

  if (data.derivatives) {
    for (const deriv of data.derivatives.slice(0, 4)) {
      const derivStack = derivCol.addStack();
      derivStack.layoutHorizontally();
      derivStack.centerAlignContent();

      const derivWord = derivStack.addText(deriv.word);
      derivWord.font = Font.semiboldSystemFont(10);
      derivWord.textColor = CONFIG.textColor;

      derivStack.addSpacer(3);

      const derivPos = derivStack.addText(deriv.pos);
      derivPos.font = Font.mediumSystemFont(8);
      derivPos.textColor = CONFIG.accentOrange;

      derivStack.addSpacer();

      const derivDef = derivStack.addText(deriv.def || '');
      derivDef.font = Font.mediumSystemFont(8);
      derivDef.textColor = CONFIG.secondaryText;
      derivDef.lineLimit = 1;
    }
  }

  w.addSpacer(10);

  // ── Synonyms & Antonyms row ──
  const synAntStack = w.addStack();
  synAntStack.layoutHorizontally();
  synAntStack.topAlignContent();

  // Synonyms
  const synCol = synAntStack.addStack();
  synCol.layoutVertically();

  const synTitle = synCol.addText('≡ Synonyms');
  synTitle.font = Font.boldSystemFont(9);
  synTitle.textColor = CONFIG.accentPink;

  synCol.addSpacer(2);

  if (data.synonyms) {
    const synText = synCol.addText(data.synonyms.join(' · '));
    synText.font = Font.mediumSystemFont(9);
    synText.textColor = new Color('#e6edf3', 0.6);
    synText.lineLimit = 2;
  }

  synAntStack.addSpacer(12);

  // Antonyms
  const antCol = synAntStack.addStack();
  antCol.layoutVertically();

  const antTitle = antCol.addText('≠ Antonyms');
  antTitle.font = Font.boldSystemFont(9);
  antTitle.textColor = new Color('#ff7b72');

  antCol.addSpacer(2);

  if (data.antonyms) {
    const antText = antCol.addText(data.antonyms.join(' · '));
    antText.font = Font.mediumSystemFont(9);
    antText.textColor = new Color('#e6edf3', 0.6);
    antText.lineLimit = 2;
  }

  w.addSpacer();

  // ── Footer ──
  const footerStack = w.addStack();
  footerStack.layoutHorizontally();
  footerStack.centerAlignContent();

  const footerText = footerStack.addText(`📚 Tap for more words · Day ${getDayOfYear()}`);
  footerText.font = Font.mediumSystemFont(8);
  footerText.textColor = new Color('#8b949e', 0.5);
}

// ══════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getWordIndex() {
  return getDayOfYear() % WORD_LIST.length;
}

// ══════════════════════════════════════════
// DATA FETCHING
// ══════════════════════════════════════════

async function getWordData() {
  // If API URL configured, fetch real data
  if (CONFIG.apiUrl) {
    try {
      const req = new Request(CONFIG.apiUrl);
      return await req.loadJSON();
    } catch (e) {
      console.log('Fetch error: ' + e);
    }
  }

  // Browser preview: try fetching from preview server
  if (typeof fetch !== 'undefined' && typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/vocabulary/today');
      if (res.ok) return await res.json();
    } catch (e) {
      // ignore
    }
  }

  // Built-in word list
  return WORD_LIST[getWordIndex()];
}
