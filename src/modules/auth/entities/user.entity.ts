import { ObjectType, Field } from "@nestjs/graphql";
import { BaseEntity } from "../../../common/abstracts/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Clinic } from "src/modules/clinic/entities/clinic.entity";

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  full_name: string;

  @Field(() => String)
  @Column({ nullable: true, type: "varchar", unique: true })
  email?: string;

  @Field(() => String)
  @Column({ nullable: true, type: "varchar", unique: true })
  phone_number?: string;

  @Field(() => String)
  @Column({ nullable: false, type: "varchar" })
  role: string;

  @Field(() => String)
  @Column({ nullable: true, type: "varchar" })
  avatar_url?: string;

  @Column({ nullable: true, type: "varchar", select: false })
  password?: string;

  @Column({ type: "boolean", default: false })
  is_verified_phone: boolean;

  @Column({ type: "boolean", default: false })
  is_verified_email: boolean;

  @Column({ type: "varchar", nullable: true })
  token: string;

  @OneToMany(() => Clinic, clinic => clinic.owner)
  clinics: Clinic[]
}
