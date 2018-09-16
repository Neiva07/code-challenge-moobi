/**
 * API examples routes.
 */
import {
  read,
  list,
  create,
  update,
  _delete,
  gameByID
} from "../controllers/Game.controller";

export default (app: any) => {
  app
    .route("/api/games")
    .get(list)
    .post(create);

  // // Single program routes
  app
    .route("/api/games/:gameId")
    .get(read)
    .put(update)
    .delete(_delete);

  // // Finish by binding the game middleware
  app.param("gameId", gameByID);
};
