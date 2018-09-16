import mongoose from "mongoose";

export type GameModel = mongoose.Document & {
  id: string;
  name: string;
  console_name: string;
  console_id: string;
};

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    console_name: { type: String, required: true },
    console_id: { type: String, required: true }
  },
  { timestamps: true }
);

// export const Game: GameType = mongoose.model<GameType>('Game', gameSchema);
const Game = mongoose.model("Game", gameSchema);
export default Game;
