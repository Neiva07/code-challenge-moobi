"use strict";

import async from "async";
import request from "request";
import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import Game, { GameModel } from "../models/Game.model";
import _Console, { ConsoleModel } from "../models/Console.model";
import * as yup from "yup";

export interface GetGameInfoInRequest extends Request {
  game: GameModel;
}

/**
 * GET /api/games
 * List of games.
 */
export let list = (req: Request, res: Response) => {
  Game.find().exec((err, games) => {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: err
      });
    }

    const data = games.map(formatMoobiGame);
    res.json(formatResponse(data));
  });
};

/**
 * POST /api/games
 * create a new game in mongoDB.
 */
export let create = (req: Request, res: Response) => {
  const game = new Game(req.body);
  game
    .save()
    .then(() =>
      _Console.findByIdAndUpdate(req.body.console_id, {
        $push: {
          games: game._id
        }
      })
    )
    .then(() => {
      res.json(
        formatResponse({
          id: game._id,
          name: req.body.name,
          console_id: req.body.console_id,
          console_name: req.body.console_name
        })
      );
    })
    .catch(err => {
      res.json(formatError(err));
    });
};

/**
 * GET /api/games/:gameId
 * get all details of a game by Id.
 */
export const read = (req: GetGameInfoInRequest, res: Response) => {
  const game = req.game ? req.game.toJSON() : {};

  const data = formatMoobiGame(game);
  res.json(formatResponse(data));
};

/**
 * PUT /api/games/:gameId
 * update name of a game by Id.
 */
export let update = (req: GetGameInfoInRequest, res: Response) => {
  const game = req.game;

  game.name = req.body.name;

  game.save(err => {
    if (err) {
      res.json(formatError(err));
    }
    const data = formatMoobiGame(game);
    res.json(formatResponse(data));
  });
};

/**
 * DELETE /api/games/:gameId
 * delete a game by Id.
 */
export let _delete = async (req: GetGameInfoInRequest, res: Response) => {
  const game = req.game;

  game
    .remove()
    .then(() =>
      _Console.findByIdAndUpdate(game.console_id, {
        $pull: { games: game._id }
      })
    )
    .then(() => {
      const data = formatMoobiGame(game);
      res.json(formatResponse(data));
    })
    .catch(err => {
      res.json(formatError(err));
    });
};

/**
 * middleware to get game by gameId
 */
export const gameByID = (
  req: GetGameInfoInRequest,
  res: Response,
  next: NextFunction,
  id: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json(formatError("Game id is invalid"));
  }

  let query = Game.findById(id);

  if (req.method === "GET") {
    query = query.populate({ path: "consoles", model: _Console });
  }

  query.exec((err, game: GameModel) => {
    if (err) {
      res.json(formatError(err));
    }
    if (!game) {
      res.json(formatError("No game with that identifier has been found"));
    }
    req.game = game;
    next();
  });
};

export type GameMoobi = {
  id: string;
  name: string;
  console_id: string;
  console_name: string;
};

export const formatMoobiGame = (game: GameModel) => {
  const { _id: id, name, console_id, console_name } = game;
  return { id, name, console_id, console_name };
};

const formatResponse = (data: GameMoobi | GameMoobi[]) => {
  return {
    success: true,
    data
  };
};

const formatError = (error: any) => {
  return {
    success: false,
    error
  };
};
