import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private readonly afs: AngularFirestore) {}

  handleCreateRoom = ({ roomName }: { roomName: String }) => {
    const id = this.afs.createId();
    return Promise.all([
      this.afs
        .collection('tictactoeRooms')
        .doc(id)
        .set({
          roomName,
          id,
          table: [...Array(3)].map(() => ({ 0: null, 1: null, 2: null })),
          currentTurn: 'x',
          admin: 'x',
          visitor: 'o',
          adminScore: 0,
          visitorScore: 0,
        })
        .then(() => id),
      this.afs.collection('tictactoeRoomMessages').doc(id).set({
        messages: [],
        id: id,
      }),
    ]);
  };

  handleGetRoom = (id: any) =>
    this.afs.collection('tictactoeRooms').doc(id).valueChanges();

  handleModifyRoom = (room: any) =>
    this.afs
      .collection('tictactoeRooms')
      .doc(room.id)
      .set({
        ...room,
      });

  handleGetChat = (id: any) =>
    this.afs.collection('tictactoeRoomMessages').doc(id).valueChanges();

  handleModifyChat = (chat: any) =>
    this.afs
      .collection('tictactoeRoomMessages')
      .doc(chat.id)
      .set({
        ...chat,
      });
}
