import { Injectable } from '@nestjs/common';
import { CreateClinicInput } from './dto/create-clinic.input';
import { UpdateClinicInput } from './dto/update-clinic.input';

@Injectable()
export class ClinicService {
  create(createClinicInput: CreateClinicInput) {
    return 'This action adds a new clinic';
  }

  findAll() {
    return `This action returns all clinic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinic`;
  }

  update(id: number, updateClinicInput: UpdateClinicInput) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
