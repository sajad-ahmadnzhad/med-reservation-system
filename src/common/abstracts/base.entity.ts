import { Field } from "@nestjs/graphql";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ type: "time", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  createdAt: Date;

  @Column({ type: "time", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
