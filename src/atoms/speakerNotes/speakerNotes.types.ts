export interface SpeakerNote {
  id: string;
  slideId: string;
  content: string; // Plain text
  order: number;
  spellCheckStatus?: 'pending' | 'checking' | 'checked' | 'error';
}
