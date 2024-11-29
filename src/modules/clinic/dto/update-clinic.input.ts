import { CreateClinicInput } from './create-clinic.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClinicInput extends PartialType(CreateClinicInput) {
  @Field(() => Int)
  id: number;
}
