import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entity/contact.entity';
import { CreateContactDto, UpdateContactDto, LockContactDto } from './dto';
import { ContactsGateway } from 'src/gateways/contacts.gateway';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    //private readonly contactsGateway: ContactsGateway,
  ) {}


  async findAll(
    page: number,
    limit: number,
    name?: string,
    phone?: string,
    address?: string,
  ): Promise<{ data: Contact[]; total: number }> {
    const query = this.contactRepository.createQueryBuilder('contact');
  
    if (name) {
      query.andWhere('contact.name LIKE :name', { name: `%${name}%` });
    }
    if (phone) {
      query.andWhere('contact.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (address) {
      query.andWhere('contact.address LIKE :address', { address: `%${address}%` });
    }
  
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  
    return { data, total };
  }



  async create(createContactDto: CreateContactDto,): Promise<{ data: Contact; message: string }> {
    try {
      const contact = this.contactRepository.create(createContactDto);
      const data = await this.contactRepository.save(contact);
      return { data, message: 'Contact created successfully' };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {  
        throw new ConflictException("Phone number already exists");
      }
      throw new InternalServerErrorException("Failed to create contact");
    }
  }


  async findOne(id: number): Promise<{ data: Contact; message: string }> {
    try {
      const data = await this.contactRepository.findOneBy({ id });
      if (!data) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      return { data, message: 'Contact retrieved successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to retrieve contact');
    }
  }


  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<{ data: Contact; message: string }> {
    try {
      const existingContact = await this.contactRepository.findOneBy({ id });
      if (!existingContact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      Object.assign(existingContact, updateContactDto);
      const data = await this.contactRepository.save(existingContact);
      return { data, message: 'Contact updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update contact');
    }
  }

 
  async delete(id: number): Promise<{ message: string }> {
    try {
      const existingContact = await this.contactRepository.findOneBy({ id });
      if (!existingContact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      await this.contactRepository.delete(id);
      return { message: 'Contact deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete contact');
    }
  }

 
  async lockContact(id: number,lockContactDto: LockContactDto): Promise<{ data: Contact; message: string }> {
    try {
      const existingContact = await this.contactRepository.findOneBy({ id });
      if (!existingContact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
  
     
      existingContact.isLocked = true;
      existingContact.lockedBy = lockContactDto.lockedBy;
      const data = await this.contactRepository.save(existingContact);

      //this.contactsGateway.handleLockContact({ id, lockedBy:lockContactDto.lockedBy });

      return { data, message: 'Contact locked successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to lock contact');
    }
  }
  
  async unlockContact(id: number): Promise<{ data: Contact; message: string }> {
    try {
      const existingContact = await this.contactRepository.findOneBy({ id });
      if (!existingContact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
  
      // Unlock the contact
      existingContact.isLocked = false;
      existingContact.lockedBy = null; 
      const data = await this.contactRepository.save(existingContact);

      //this.contactsGateway.handleUnlockContact({ id });
      
      return { data, message: 'Contact unlocked successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to unlock contact');
    }
  }
  
}