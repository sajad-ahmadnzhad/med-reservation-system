import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column } from 'typeorm';

@ObjectType()
export class Clinic extends BaseEntity {
  @Field(() => String)
  @Column({ type: "varchar", nullable: false, length: 500 })
  name: string

  @Field(() => String)
  @Column({ type: "text", nullable: true })
  description: string

  @Field(() => String)
  @Column({ type: "text", nullable: true })
  address: string

  @Field(() => String)
  @Column({ type: "varchar", nullable: true })
  postal_code: string

  @Field(() => String)
  @Column({ type: "varchar", nullable: true })
  phone: string

  @Field()
  @Column({ type: "point", nullable: true })
  location: { longitude: number, latitude: number }

  @Field(() => String)
  @Column({ type: "enum", enum: ["active", 'inactive', 'pending'], default: "pending" })
  status: string

  @Field(() => String)
  @Column({ type: "varchar", nullable: true })
  image_url: string

  @Field(() => String)
  @Column({ type: "json", nullable: true })
  working_hours: { [key: string]: string }

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  subscriptionStartDate: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndDate: Date;
}
