import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { MusicModule } from "./modules/music/music.module";
import { CommonModule } from "./modules/common/common.module";
import { IntegrationModule } from "./modules/integration/integration.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./db.sqlite3",
      autoLoadEntities: true,
      migrations: ["dist/**/*migrations/*.js"],
      cli: {
        migrationsDir: "src/migrations",
      },
    }),

    CommonModule,
    MusicModule,
    IntegrationModule,
  ],
})
export class AppModule {}
