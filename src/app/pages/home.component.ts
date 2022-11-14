import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../@core/services/room.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="w-full  min-h-screen flex items-center justify-center">
      <form
        class="w-11/12 p-4 gap-x-4 bg-slate-100 rounded-3xl flex"
        [formGroup]="form"
        (submit)="handleSubmit(form.value)"
      >
        <input
          *ngIf="form.get('roomName') as roomName"
          type="text"
          [ngClass]="[
            'rounded-md',
            'w-full',
            roomName.valid ? 'border-green-400' : 'border-red-700',
            'border-2',
            'transition-all'
          ]"
          placeholder="Nombre unico"
          formControlName="roomName"
        />
        <button
          class="bg-green-500 pl-4 pr-4 pt-2 pb-2 rounded-md whitespace-nowrap hover:bg-green-900 transition-all"
        >
          crear tablero
        </button>
      </form>
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  form = this.formBuilder.group({
    roomName: [null, Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) {}
  async handleSubmit(formValue: any) {
    const [id] = await this.roomService.handleCreateRoom(formValue);
    this.router.navigate(['room-admin', id]);
  }
}
