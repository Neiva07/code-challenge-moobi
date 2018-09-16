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

    res.json(games);
  });
};

const createGameValidation = yup.object().shape({
  name: yup.string().required(),
  consolesId: yup
    .array()
    .of(yup.string().required())
    .required()
});

/**
 * POST /api/games
 * create a new game in mongoDB.
 */
export let create = async (req: Request, res: Response) => {
  try {
    createGameValidation.validateSync(req.body);
    const { consolesId } = req.body;
    _Console
      .find({
        _id: { $in: consolesId }
      })
      .then(results => {
        if (results.length !== consolesId.length) {
          res.status(406).json({ err: "one or more console ids not found" });
        } else {
          const game = new Game({ name: req.body.name, consoles: consolesId });
          game
            .save()
            .then(() => {
              const promises = results.map((_console: ConsoleModel) => {
                return _console.update({
                  $push: {
                    games: game._id
                  }
                });
              });
              return Promise.all(promises);
            })
            .then(() => res.json(game))
            .catch(err => {
              res.status(406).json({ err: err.errmsg });
            });
        }
      })
      .catch(err => console.log(err));
  } catch (err) {
    res.status(406).json({ err: err.message });
  }
};

/**
 * GET /api/games/:gameId
 * get all details of a game by Id.
 */
export const read = (req: GetGameInfoInRequest, res: Response) => {
  const game = req.game ? req.game.toJSON() : {};

  res.json(game);
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
      return res.status(422).send({
        message: err
      });
    }
    res.json(game);
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
    .then(() => {
      const promises = game.consoles.map(consoleId => {
        return _Console.findByIdAndUpdate(consoleId, {
          $pull: { games: game._id }
        });
      });
      return Promise.all(promises);
    })
    .then(() => res.json(game))
    .catch(err => {
      return res.status(422).send({
        message: err
      });
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
    return res.status(400).send({
      message: "Game id is invalid"
    });
  }

  let query = Game.findById(id);

  if (req.method === "GET") {
    query = query.populate({ path: "consoles", model: _Console });
  }

  query.exec((err, game: GameModel) => {
    if (err) {
      return next(err);
    }
    if (!game) {
      return res.status(404).send({
        message: "No game with that identifier has been found"
      });
    }
    req.game = game;
    next();
  });
};
