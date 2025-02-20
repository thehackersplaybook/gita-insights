export interface GitaDataItem {
  ID: string;
  Chapter: number;
  Verse: number;
  Shloka: string;
  Transliteration: string;
  HinMeaning: string;
  EngMeaning: string;
  WordMeaning: string;
  context: string;
}

export type GitaDataCollection = GitaDataItem[];
