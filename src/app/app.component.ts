
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactService } from './services/contact.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from './models/contact';
import { ModeEnum } from './models/mode.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  
  ModeEnum = ModeEnum;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  paginatedContacts: Contact[] = [];
  mode = ModeEnum.NON;

  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;  // Number of contacts per page
  totalPages: number = 1;

  ngOnInit(): void {
    this.setContacts();
  }

  private setContacts() {
    this.contactService.getAllContacts().subscribe(
      (data) => {
        console.log('Data fetched:', data);
        this.contacts = data;
        this.filterContacts();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );    
  }

  filterContacts() {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(this.searchTerm.trim().toLowerCase()) ||
      contact.lastName.toLowerCase().includes(this.searchTerm.trim().toLowerCase()) ||
      contact.email.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredContacts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedContacts = this.filteredContacts.slice(startIndex, endIndex);
  }

  getPaginationDetails(): string {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(startIndex + this.itemsPerPage - 1, this.filteredContacts.length);
    return `Showing ${startIndex} - ${endIndex} of ${this.filteredContacts.length} records`;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  addNewContact() {
    this.mode = ModeEnum.ADD;
  }

  editContact(user: Contact) {
    this.mode = ModeEnum.EDIT;
    this.form.setValue(user);
  }

  saveContact() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.form.value as Contact;

    if (this.mode === ModeEnum.ADD) {
      user.id = 0;
      this.contactService.addContact(user).subscribe(
        (data) => {
          console.log('Data fetched:', data);                    
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      //this.contactService.updateUser(user);
      this.contactService.updateContact(user).subscribe(
        (data) => {
          console.log('Data fetched:', data);                    
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }

    this.cancel();
    setTimeout(() => {
      this.setContacts();      
    }, 1000);    
  }

  removeContacts(user: Contact) {
    //this.contactService.deleteContact(user);

    this.contactService.deleteContact(user).subscribe(
      (data: any) => {
        console.log('Data fetched:', data);                    
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );

    this.cancel();
    setTimeout(() => {
      this.setContacts();
    }, 1000);    
  }

  cancel() {
    this.form.reset();
    this.mode = ModeEnum.NON;
  }
}
