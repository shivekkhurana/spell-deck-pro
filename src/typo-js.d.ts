declare module 'typo-js' {
  interface TypoSettings {
    platform?: string;
    dictionaryPath?: string;
    [key: string]: unknown;
  }

  class Typo {
    constructor(
      locale?: string,
      affData?: string | false | null,
      wordsData?: string | false | null,
      settings?: TypoSettings
    );
    check(word: string): boolean;
    suggest(word: string): string[];
  }

  export default Typo;
}
