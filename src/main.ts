import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //#region Config
  const localPort = 3001;
  const port = process.env.PORT || localPort;
  const origin = port === localPort ? "*" : "producesbeepop";
  //#endregion

  console.log(port);

  app.enableCors({ origin });
  await app.listen(port);
}
bootstrap();
