import dotenv from "dotenv";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./src/util/secrets";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

afterAll(() => {
  const mongoUrl = MONGODB_URI;
  (<any>mongoose).Promise = bluebird;
  mongoose
    .connect(
      mongoUrl,
      { useMongoClient: true }
    )
    .then(connection => {
      connection.db.dropDatabase();
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
    .catch(err => {
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      // process.exit();
    });
});
