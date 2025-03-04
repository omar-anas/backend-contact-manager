// contacts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entity/contact.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { ContactsGateway } from 'src/gateways/contacts.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactsService,ContactsGateway],
  controllers: [ContactsController],
})
export class ContactsModule {}