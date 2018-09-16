import loadConsoleRoutes from "./Console.route";
import loadGameRoutes from "./Game.route";

const loadRoutes = (app: any) => {
  loadGameRoutes(app);
  loadConsoleRoutes(app);
};

export default loadRoutes;
