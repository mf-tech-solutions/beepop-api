import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as express from "express";
import * as functions from "firebase-functions";

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  return app.init();
};

createNestServer(server)
  .then(() => console.log("Nest initialized successfully."))
  .catch((err) => console.error("Nest had an error while initializing.", err));

export const api = functions.https.onRequest(server);
