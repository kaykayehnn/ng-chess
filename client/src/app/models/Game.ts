export interface Game {
  id: number;
  whitePlayerId: number;
  whitePlayerEmail: string;
  whitePlayerAvatarUrl: string;
  blackPlayerId: number;
  blackPlayerEmail: string;
  blackPlayerAvatarUrl: string;
  winner: 'b' | 'w' | 'd' | null;
  fen?: string;
  color?: 'b' | 'w';
}
