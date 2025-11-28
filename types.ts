export interface Point {
  x: number;
  y: number;
}

export enum FireworkType {
  NORMAL = 'NORMAL',
  HEART = 'HEART',
}

export interface LoveNoteResponse {
  message: string;
  mood: string;
}
