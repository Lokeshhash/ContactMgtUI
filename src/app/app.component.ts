
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactService } from './services/contact.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from './models/contact';
import { ModeEnum } from './models/mode.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
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
    email: ['', Validators.required],
  });
  ModeEnum = ModeEnum;
  contacts!: Contact[];
  mode = ModeEnum.NON;

  ngOnInit(): void {
    this.setContacts();
  }

  private setContacts() {
    this.contactService.getAllContacts().subscribe(
      (data) => {
        console.log('Data fetched:', data);
        this.contacts = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );    
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
