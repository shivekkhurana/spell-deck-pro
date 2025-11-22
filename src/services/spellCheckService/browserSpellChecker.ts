import Typo from 'typo-js';

let dict: Typo | null = null;

async function loadDict() {
  if (dict) return dict;

  const aff = await fetch(
    'https://unpkg.com/typo-js@1.3.1/dictionaries/en_US/en_US.aff'
  ).then((r) => r.text());
  const dic = await fetch(
    'https://unpkg.com/typo-js@1.3.1/dictionaries/en_US/en_US.dic'
  ).then((r) => r.text());

  dict = new Typo('en_US', aff, dic, { platform: 'browser' });
  return dict;
}

/**
 * Returns true if ANY word in the sentence is misspelled.
 */
export async function hasErrors(sentence: string): Promise<boolean> {
  const d = await loadDict();

  const words = sentence
    .split(/\s+/)
    .map((w) => w.replace(/[.,!?;:()"]/g, '').trim())
    .filter(Boolean);

  for (const w of words) {
    if (!d.check(w)) return true;
  }

  return false;
}
