import mongoose from "mongoose";
import { GameModel } from "./Game.model";

export type ConsoleModel = mongoose.Document & {
  id: string;
  name: string;
  company: string;
  games: GameModel[];
};

const consoleSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    company: { type: String, required: true },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }]
  },
  { timestamps: true }
);

// export const Console: ConsoleType = mongoose.model<ConsoleType>('Console', consoleSchema);
const _Console = mongoose.model("Console", consoleSchema);
export default _Console;
