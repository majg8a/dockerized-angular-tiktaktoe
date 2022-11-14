import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, skipWhile, switchMap, tap } from 'rxjs';
import { RoomService } from '../@core/services/room.service';

@Component({
  selector: 'app-chat',
  template: ` <div
    class="w-full bg-slate-100 rounded-3xl   h-full p-4 relative"
    *ngIf="{ chat: chat$ | async } as state"
  >
    <div class="h-5/6 overflow-y-scroll">
      <ng-container *ngFor="let message of state.chat?.messages; index as i">
        <div
          [ngClass]="[
            'flex',
            message.player === player ? 'justify-end' : 'justify-start',
            'mb-4'
          ]"
        >
          <div
            [ngClass]="[
              message.player === player ? 'bg-green-600' : 'bg-yellow-600',
              'p-4',
              'text-xl',
              'text-white',
              'rounded-2xl'
            ]"
            [id]="i === state.chat.messages.length - 1 ? 'last' : ''"
          >
            {{ message.message }}
          </div>
        </div>
      </ng-container>
    </div>

    <form
      class="w-full p-4 gap-x-4 rounded-3xl flex"
      [formGroup]="form"
      (submit)="handleSend(state.chat)"
    >
      <input
        type="text"
        [ngClass]="['rounded-md', 'w-full', 'border-2', 'transition-all']"
        placeholder="mensaje"
        formControlName="message"
      />
      <button
        class="bg-green-500 pl-4 pr-4 pt-2 pb-2 rounded-md whitespace-nowrap hover:bg-green-900 transition-all"
        type="submit"
        [disabled]="form.invalid"
      >
        Enviar
      </button>
    </form>
  </div>`,
  styles: [],
})
export class ChatComponent {
  newId$ = new BehaviorSubject(null);

  chat$: Observable<any> = this.newId$.pipe(
    switchMap((id) => this.roomService.handleGetChat(id).pipe()),
    tap(() => {
      setTimeout(() => document.getElementById('last')?.scrollIntoView(), 500);
    })
  );

  @Input() player: any = null;
  @Input() set id(id: any) {
    this.newId$.next(id);
  }

  form = this.formBuilder.group({
    message: [null, Validators.required],
  });

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder
  ) {}

  async handleSend(chat: any) {
    chat.messages.push({ ...this.form.value, player: this.player });
    this.form.reset();
    await this.roomService.handleModifyChat(chat);
  }
}
