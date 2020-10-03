import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ApiToken {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Token: string;

  @Column("tinyint")
  Provider: number;

  @Column()
  Expired: boolean;

  @Column("datetime")
  ExpirationDate: Date;

  IsExpired(): boolean {
    return this.ExpirationDate.getTime() <= Date.now();
  }
}
