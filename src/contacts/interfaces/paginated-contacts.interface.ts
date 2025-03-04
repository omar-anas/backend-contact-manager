import { Contact } from "../entity/contact.entity";

export interface PaginatedContacts {
    data: Contact[];     
    page: number;       
    limit: number;         
    total: number;         
  }