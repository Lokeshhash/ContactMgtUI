import { Injectable, inject } from '@angular/core';
import { Contact } from '../models/contact';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);

  private readonly apiBaseUrl = "https://localhost:7244/api";
  private readonly contacts: Contact[] = [];

  
  getAllContacts() {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}/Contacts`);
  }

  addContact(user: Contact) {
    return this.http.post<Contact>(
      `${this.apiBaseUrl}/Contacts`,
      user
    );
  }

  updateContact(user: Contact) {
    return this.http.put<Contact>(
      `${this.apiBaseUrl}/Contacts/${user.id}`,
      user
    );
  }

  deleteContact(user: any) {
    return this.http.delete<Contact>(`${this.apiBaseUrl}/Contacts/${user.id}`);
  }

  // getAllUsers(): Contact[] {
  //   return this.contacts;
  // }

  // addUser(user: Contact) {
  //   user.id = this.contacts.length + 1;
  //   this.contacts.push(user);
  // }

  // updateUser(user: Contact) {
  //   const index = this.contacts.findIndex((u: Contact) => user.id === u.id);
  //   this.contacts[index] = user;
  // }

  // deleteUser(user: Contact) {
  //   this.contacts.splice(this.contacts.indexOf(user), 1);
  // }
}
