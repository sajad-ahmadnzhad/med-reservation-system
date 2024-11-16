import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Role {
  @Field()
  @Column({ type: "varchar" })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: "text" })
  description?: string;
}
