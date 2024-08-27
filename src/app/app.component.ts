import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactService } from './services/contact.service';
import { CommonModule } from '@angular/common';
import { Contact } from './models/contact';
import { ModeEnum } from './models/mode.enum';
import { AddEditContactComponent } from './components/add-edit-contact/add-edit-contact.component';
import { FormsModule } from '@angular/forms';

declare const $: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AddEditContactComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private contactService = inject(ContactService);
  ModeEnum = ModeEnum;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  paginatedContacts: Contact[] = [];
  mode = ModeEnum.NON;
  currentContact: Contact | null = null;
  selectedContactForDelete: Contact | null = null;

  @ViewChild('AddEditModal') contactModal!: ElementRef;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  ngOnInit(): void {
    this.setContacts();
  }

  private setContacts() {
    this.contactService.getAllContacts().subscribe(
      (data) => {
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
    this.currentContact = null;
  }

  editContact(contact: Contact) {
    this.mode = ModeEnum.EDIT;
    this.currentContact = contact;
  }

  saveContact(contact: Contact) {
    console.log(this.contactModal); // Add this line to debug

    if (this.contactModal) {
      $(this.contactModal.nativeElement).modal('hide');
    } else {
      console.error('Modal element not found!');
    }
    
    if (this.mode === ModeEnum.ADD) {
      contact.id = 0;
      this.contactService.addContact(contact).subscribe(
        () => this.setContacts(),
        (error) => console.error('Error adding contact:', error)
      );
    } else {
      this.contactService.updateContact(contact).subscribe(
        () => this.setContacts(),
        (error) => console.error('Error updating contact:', error)
      );
    }
    this.cancel();    
        
    //$(this.contactModal.nativeElement).modal('hide');
  }

  openDeleteConfirmationDialog(contact: Contact) {
    this.selectedContactForDelete = contact;        
  }

  removeContact() {
    if(this.selectedContactForDelete){
      this.contactService.deleteContact(this.selectedContactForDelete).subscribe(
        () => this.setContacts(),
        (error) => console.error('Error deleting contact:', error)
      );
    }
  }

  cancel() {
    this.mode = ModeEnum.NON;
    this.currentContact = null;
  }
}
