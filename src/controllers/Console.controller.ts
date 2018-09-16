"use strict";

import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import _Console, { ConsoleModel } from "../models/Console.model";
import Game from "../models/Game.model";
import { formatMoobiGame, GameMoobi } from "./Game.controller";

export interface GetConsoleInfoInRequest extends Request {
  console: ConsoleModel;
}

/**
 * GET /api/consoles
 * List of consoles.
 */
export let list = (req: Request, res: Response) => {
  _Console.find({}).exec((err, _consoles: ConsoleModel[]) => {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: err
      });
    }

    const data = _consoles.map(formatMoobiConsole);
    res.json(formatResponse(data));
  });
};

/**
 * POST /api/consoles
 * create a new console in mongoDB.
 */
export let create = (req: Request, res: Response) => {
  const _console = new _Console({
    name: req.body.name,
    company: req.body.company
  });

  _console.save(err => {
    if (err) {
      res.json(formatError(err));
    }

    res.json(
      formatResponse({
        name: req.body.name,
        company: req.body.company,
        id: _console._id
      })
    );
  });
};

/**
 * GET /api/consoles/:consoleId
 * get all details of a console by Id.
 */
export const read = (req: GetConsoleInfoInRequest, res: Response) => {
  const _console = req.console ? req.console.toJSON() : {};

  const data = formatMoobiConsole(_console);
  res.json({
    success: true,
    data: { ...data, games: _console.games.map(formatMoobiGame) }
  });
};

/**
 * PUT /api/consoles/:consoleId
 * update name of a console by Id.
 */
export let update = (req: GetConsoleInfoInRequest, res: Response) => {
  const _console = req.console;

  _console.name = req.body.name;
  _console.company = req.body.company;

  _console
    .save()
    .then(() => {
      const promises = _console.games.map(gameId =>
        Game.findByIdAndUpdate(gameId, {
          console_name: _console.name
        })
      );
      return Promise.all(promises);
    })
    .then(() => {
      const data = formatMoobiConsole(_console);
      res.json(formatResponse(data));
    })
    .catch(err => {
      res.json(formatError(err));
    });
};

/**
 * DELETE /api/consoles/:consoleId
 * delete a console by Id.
 */
export let _delete = (req: GetConsoleInfoInRequest, res: Response) => {
  const _console = req.console;

  _console.remove(err => {
    if (err) {
      res.json(formatError(err));
    }
    const data = formatMoobiConsole(_console);
    res.json(formatResponse(data));
  });
};

/**
 * middleware to get console by consoleId
 */
export const consoleByID = (
  req: GetConsoleInfoInRequest,
  res: Response,
  next: NextFunction,
  id: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json(formatError("Console id is invalid"));
  }

  let query = _Console.findById(id);

  if (req.method === "GET") {
    query = query.populate({ path: "games", model: Game });
  }

  query.exec((err, _console: ConsoleModel) => {
    if (err) {
      res.json(formatError(err));
    }
    if (!_console) {
      res.json(formatError("No console with that identifier has been found"));
    }
    req.console = _console;
    next();
  });
};

type ConsoleMoobi = {
  id: string;
  name: string;
  company: string;
};

const formatMoobiConsole = (_console: ConsoleModel) => {
  const { _id: id, name, company } = _console;
  return { id, name, company };
};

const formatResponse = (data: ConsoleMoobi | ConsoleMoobi[]) => {
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
