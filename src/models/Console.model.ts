import mongoose from "mongoose";

export type ConsoleModel = mongoose.Document & {
  name: string;
  company: string;
  games: Game[];
};

export type Game = {
  name: string;
  consoles: ConsoleModel[];
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
