import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { RoomService } from '../@core/services/room.service';

@Component({
  selector: 'app-room-visitor',
  template: `
    <div
      class="min-h-screen w-full flex flex-col p-4 gap-y-4"
      *ngIf="{
        room: room$ | async
      } as state"
    >
      <div
        class="bg-slate-100 w-full p-10 max-h-min justify-center rounded-3xl cursor-pointer text-center font-bold text-lg grid grid-cols-2"
      >
        <div class="w-full">
          player A
          {{ state.room?.adminScore }}
        </div>
        <div class="w-full">
          player B
          {{ state.room?.visitorScore }}
        </div>
      </div>

      <div
        class="bg-slate-100 w-full p-10 max-h-min grid justify-center rounded-3xl cursor-pointer text-center font-bold text-lg"
      >
        <div>Turn: {{ state.room?.currentTurn | uppercase }}</div>
        <div>player: {{ state.room?.visitor | uppercase }}</div>
      </div>

      <div
        class="grid lg:grid-cols-2 lg:grid-rows-1 grid-rows-2 h-screen gap-4"
      >
        <app-table [room]="state?.room" [player]="player"></app-table>
        <app-chat [player]="player" [id]="id"></app-chat>
      </div>
    </div>
  `,
  styles: [],
})
export class RoomVisitorComponent {
  player = 'visitor';
  id = this.route.snapshot.paramMap.get('id');

  room$: Observable<any> = this.roomService.handleGetRoom(this.id).pipe(
    tap((room) => {
      if (room.currentTurn !== room[this.player]) {
        return;
      }

      const message = `Es tu turno!  ${room[this.player]}`;

      alert(message);
    })
  );
  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute
  ) {}
}
