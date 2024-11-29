import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicResolver } from './clinic.resolver';

@Module({
  providers: [ClinicResolver, ClinicService],
})
export class ClinicModule {}
