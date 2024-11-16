import { ObjectType, Field } from "@nestjs/graphql";
import { BaseEntity } from "../../../common/abstracts/base.entity";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  full_name: string;

  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  email: string;

  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  phone_number: string;

  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  role: string;

  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  avatar_url: string;

  @Column({ nullable: true, type: "varchar", select: false })
  password?: string;
}
