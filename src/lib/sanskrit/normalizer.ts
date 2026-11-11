// Sanskrit Devanagari and IAST Normalization & Transliteration Utilities

export interface SanskritToken {
  devanagari: string;
  iast: string;
  meaning?: string;
}

/**
 * Normalizes IAST diacritics into plain ASCII for fuzzy search matching.
 * e.g., "Ṛgvedaḥ" -> "rgvedah", "Śrīmadbhagavadgītā" -> "srimadbhagavadgita"
 */
export function normalizeIast(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[āâ]/g, 'a')
    .replace(/[īî]/g, 'i')
    .replace(/[ūû]/g, 'u')
    .replace(/[ṛṝ]/g, 'r')
    .replace(/[ḷḹ]/g, 'l')
    .replace(/[ēe]/g, 'e')
    .replace(/[ōo]/g, 'o')
    .replace(/[ṃṁ]/g, 'm')
    .replace(/[ḥ]/g, 'h')
    .replace(/[ṅñṇ]/g, 'n')
    .replace(/[ṭ]/g, 't')
    .replace(/[ḍ]/g, 'd')
    .replace(/[śṣ]/g, 's');
}

/**
 * Normalizes Devanagari text by removing cantillation marks, virama quirks, and formatting.
 */
export function normalizeDevanagari(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    // Remove Vedic svara accents (udatta, anudatta, svarita) for plain text matching
    .replace(/[\u0951\u0952\u0953\u0954]/g, '')
    .trim();
}

/**
 * Detects if a string contains Devanagari script.
 */
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Basic Harvard-Kyoto to IAST converter for search inputs like "dharma", "Atman", "krodha"
 */
export function hkToIast(hk: string): string {
  let res = hk;
  const mappings: [RegExp, string][] = [
    [/AA|A/g, 'ā'],
    [/II|I/g, 'ī'],
    [/UU|U/g, 'ū'],
    [/R\^i|R/g, 'ṛ'],
    [/L\^i/g, 'ḷ'],
    [/M/g, 'ṁ'],
    [/H/g, 'ḥ'],
    [/G/g, 'ṅ'],
    [/J/g, 'ñ'],
    [/T/g, 'ṭ'],
    [/D/g, 'ḍ'],
    [/N/g, 'ṇ'],
    [/z/g, 'ś'],
    [/S/g, 'ṣ']
  ];
  for (const [pattern, repl] of mappings) {
    res = res.replace(pattern, repl);
  }
  return res;
}
