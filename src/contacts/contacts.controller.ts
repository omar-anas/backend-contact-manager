import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    NotFoundException,
    ParseIntPipe,
  } from '@nestjs/common';
  import { ContactsService } from './contacts.service';
  import { CreateContactDto, UpdateContactDto, LockContactDto,PaginationDto } from './dto/index';
  
  @Controller('contacts')
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    @Get()
async getContacts(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 5,
  @Query('name') name?: string,
  @Query('phone') phone?: string,
  @Query('address') address?: string,
){
  return this.contactsService.findAll(page, limit, name, phone, address);
}
  
    @Post()
    async create(@Body() createContactDto: CreateContactDto) {
      return this.contactsService.create(createContactDto);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      const contact = await this.contactsService.findOne(id);
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      return contact;
    }
  
    @Put(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateContactDto: UpdateContactDto,
    ) {
      return this.contactsService.update(id, updateContactDto);
    }
  
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
      return this.contactsService.delete(id);
    }
  
    @Put(':id/lock')
    async lockContact(
      @Param('id', ParseIntPipe) id: number,
      @Body() lockContactDto: LockContactDto,
    ) {
      return this.contactsService.lockContact(id, lockContactDto);
    }
  
    @Put(':id/unlock')
    async unlockContact(@Param('id', ParseIntPipe) id: number) {
      return this.contactsService.unlockContact(id);
    }
  }