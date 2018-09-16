/**
 * API examples routes.
 */
import {
  read,
  list,
  create,
  update,
  _delete,
  consoleByID
} from "../controllers/Console.controller";

export default (app: any) => {
  app
    .route("/api/consoles")
    .get(list)
    .post(create);

  // Single program routes
  app
    .route("/api/consoles/:consoleId")
    .get(read)
    .put(update)
    .delete(_delete);

  // Finish by binding the console middleware
  app.param("consoleId", consoleByID);
};
