export interface SpeakerNote {
  id: string;
  slideId: string;
  content: string; // Plain text
  order: number;
  spellCheckStatus?: 'idle' | 'checking' | 'checked' | 'error';
}
