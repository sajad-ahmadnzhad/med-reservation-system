import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicResolver } from './clinic.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, User])],
  providers: [ClinicResolver, ClinicService],
})
export class ClinicModule { }
