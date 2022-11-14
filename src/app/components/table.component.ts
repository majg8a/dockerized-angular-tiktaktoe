import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RoomService } from '../@core/services/room.service';

@Component({
  selector: 'app-table',
  template: `
    <div
      class="w-full bg-slate-100 rounded-3xl  grid-cols-3 grid-rows-3 h-full grid content-center justify-center p-4 relative overflow-hidden"
      *ngIf="{
        table: newTable$ | async,
        room: newRoom$ | async
      } as state"
    >
      <ng-container *ngFor="let row of state.table; index as i">
        <ng-container *ngFor="let col of row; index as j">
          <div
            [ngClass]="[
              'w-full',
              'text-9xl',
              ' text-center',
              i === 1 ? 'border-t-2' : '',
              i === 1 ? 'border-b-2' : '',
              j === 1 ? 'border-r-2' : '',
              j === 1 ? 'border-l-2' : '',
              'border-black',
              'hover:bg-slate-500',
              'transition-all',
              'grid',
              'content-center',
              'justify-center',
              col === state.room[this.player] ? 'text-green-800' : 'text-red-800'
            ]"
            (click)="handleSelect(state.room, i, j)"
          >
            {{ col }}
          </div>
        </ng-container>
      </ng-container>

      <div
        [ngClass]="[
          'absolute',
          'top-0',
          'w-full',
          'h-full',
          state.room?.winner
            ? state.room[this.player] === state.room?.winner
              ? 'bg-green-500'
              : state.room?.winner === 'tie'
              ? 'bg-yellow-500'
              : 'bg-red-500'
            : 'hidden',
          'opacity-90',
          'grid',
          'content-center',
          'justify-center'
        ]"
      >
        <button
          class="bg-slate-900 p-10 rounded-md whitespace-nowrap hover:bg-green-900 transition-all text-white"
          (click)="handleResetTable(state.room)"
        >
          Reset!
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class TableComponent {
  newTable$ = new BehaviorSubject<any>(null);

  newRoom$ = new BehaviorSubject<any>([]);

  @Input() set room(room: any) {
    this.newRoom$.next(room);
    this.newTable$.next(room?.table?.map((row: any) => Object.values(row)));
  }

  @Input() player = '';

  constructor(private roomService: RoomService) {}

  isVictory = (cells: any) => {
    let combs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let comb of combs) {
      if (
        cells[comb[0]] == cells[comb[1]] &&
        cells[comb[1]] == cells[comb[2]] &&
        cells[comb[0]] != null
      ) {
        return true;
      }
    }
    return false;
  };
  async handleSelect(room: any, i: any, j: any) {
    if (room[this.player] !== room?.currentTurn || room?.table[i][j]) {
      return;
    }

    room.table[i] = {
      ...room?.table[i],
      [j]: room[this.player],
    };

    const oneDimensionalTable = room?.table
      .map((row: any) => Object.values(row))
      .reduce((total: any[], current: any[]) => total.concat(current), []);

    const isPlayerWinner = this.isVictory(oneDimensionalTable);
    const isTie =
      oneDimensionalTable.filter((a: any) => a).length ===
        oneDimensionalTable.length && !isPlayerWinner;

    room = {
      ...room,
      table: [...room?.table],
      currentTurn: room?.currentTurn === 'x' ? 'o' : 'x',
      winner: isPlayerWinner ? room[this.player] : isTie ? 'tie' : null,

      adminScore:
        this.player === 'admin' && isPlayerWinner
          ? room?.adminScore + 1
          : room?.adminScore,
      visitorScore:
        this.player === 'visitor' && isPlayerWinner
          ? room?.visitorScore + 1
          : room?.visitorScore,
    };

    console.log(room);

    await this.roomService.handleModifyRoom(room);
  }

  handleResetTable = async (room: any) => {
    const currentPlayer =
      room?.winner && room[this.player] !== room?.currentTurn
        ? 'x'
        : room[this.player];
    const otherPlayer = this.player === 'admin' ? 'visitor' : 'admin';

    return await this.roomService.handleModifyRoom({
      ...room,
      winner: null,
      table: [...Array(3)].map(() => ({ 0: null, 1: null, 2: null })),
      currentTurn: 'x',
      [this.player]: currentPlayer,
      [otherPlayer]: currentPlayer === 'x' ? 'o' : 'x',
    });
  };
}
