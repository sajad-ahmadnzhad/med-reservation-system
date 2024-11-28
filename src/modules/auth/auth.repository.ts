import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner
    );
  }

  findByPhone(phone_number: string): Promise<User | null> {
    return this.findOneBy({ phone_number });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
