import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModeEnum } from '../../models/mode.enum';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-add-edit-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-contact.component.html',
  styleUrls: ['./add-edit-contact.component.scss']
})
export class AddEditContactComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() mode: ModeEnum = ModeEnum.NON;
  @Input() contact: Contact | null = null;

  @Output() save = new EventEmitter<Contact>();
  @Output() cancel = new EventEmitter<void>();

  ModeEnum = ModeEnum;
  form = this.fb.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    if (this.contact) {
      this.form.setValue(this.contact);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.form.value as Contact;
    this.save.emit(user);
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }
}
