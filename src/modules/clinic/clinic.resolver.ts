import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClinicService } from './clinic.service';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicInput } from './dto/create-clinic.input';
import { UpdateClinicInput } from './dto/update-clinic.input';

@Resolver(() => Clinic)
export class ClinicResolver {
  constructor(private readonly clinicService: ClinicService) {}

  @Mutation(() => Clinic)
  createClinic(@Args('createClinicInput') createClinicInput: CreateClinicInput) {
    return this.clinicService.create(createClinicInput);
  }

  @Query(() => [Clinic], { name: 'clinic' })
  findAll() {
    return this.clinicService.findAll();
  }

  @Query(() => Clinic, { name: 'clinic' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.clinicService.findOne(id);
  }

  @Mutation(() => Clinic)
  updateClinic(@Args('updateClinicInput') updateClinicInput: UpdateClinicInput) {
    return this.clinicService.update(updateClinicInput.id, updateClinicInput);
  }

  @Mutation(() => Clinic)
  removeClinic(@Args('id', { type: () => Int }) id: number) {
    return this.clinicService.remove(id);
  }
}
