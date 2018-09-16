import mongoose from "mongoose";

export type GameModel = mongoose.Document & {
  name: string;
  consoles: Console[];
};

export type Console = {
  name: string;
  company: string;
  games: GameModel[];
};

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    consoles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Console" }]
  },
  { timestamps: true }
);

// export const Game: GameType = mongoose.model<GameType>('Game', gameSchema);
const Game = mongoose.model("Game", gameSchema);
export default Game;
