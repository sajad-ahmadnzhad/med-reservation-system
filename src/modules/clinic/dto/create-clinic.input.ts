import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateClinicInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
