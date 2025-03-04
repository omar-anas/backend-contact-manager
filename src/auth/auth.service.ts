import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor( @InjectRepository(User)
      private readonly userRepository: Repository<User>){}

  async login(username: string, password: string): Promise<{ data: any; message: string }> {
    try {
      
      
      const user = await this.userRepository.findOneBy({username})
      
      if(user?.password!=password){
         throw new NotFoundException(`Bad Cretintials`);
      }
      const { password: _, ...userWithoutPassword } = user;
      return { data:userWithoutPassword, message: 'Logged in successfully' }; 
    }  catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to retrieve contact');
    }
  }
}