"use strict";

import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import _Console, { ConsoleModel } from "../models/Console.model";
import Game, { GameModel } from "../models/Game.model";

export interface GetConsoleInfoInRequest extends Request {
  console: ConsoleModel;
}

/**
 * GET /api/consoles
 * List of consoles.
 */
export let list = (req: Request, res: Response) => {
  _Console.find({}).exec((err, _console) => {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: err
      });
    }

    res.json(_console);
  });
};

/**
 * POST /api/consoles
 * create a new console in mongoDB.
 */
export let create = (req: Request, res: Response) => {
  const _console = new _Console(req.body);
  _console.save(err => {
    if (err) {
      return res.status(422).send({
        message: err
      });
    }
    res.json(_console);
  });
};

/**
 * GET /api/consoles/:consoleId
 * get all details of a console by Id.
 */
export const read = (req: GetConsoleInfoInRequest, res: Response) => {
  const _console = req.console ? req.console.toJSON() : {};

  res.json(_console);
};

/**
 * PUT /api/consoles/:consoleId
 * update name of a console by Id.
 */
export let update = (req: GetConsoleInfoInRequest, res: Response) => {
  const _console = req.console;

  _console.name = req.body.name;
  _console.company = req.body.company;

  _console.save(err => {
    if (err) {
      return res.status(422).send({
        message: err
      });
    }
    res.json(_console);
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
      return res.status(422).send({
        message: err
      });
    }
    res.json(_console);
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
    return res.status(400).send({
      message: "Console id is invalid"
    });
  }

  let query = _Console.findById(id);

  if (req.method === "GET") {
    query = query.populate({ path: "games", model: Game });
  }

  query.exec((err, _console: ConsoleModel) => {
    if (err) {
      return next(err);
    }
    if (!_console) {
      return res.status(404).send({
        message: "No satellite with that identifier has been found"
      });
    }
    req.console = _console;
    next();
  });
};
