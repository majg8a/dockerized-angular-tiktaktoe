import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home.component';
import { RoomAdminComponent } from './pages/room-admin.component';
import { RoomVisitorComponent } from './pages/room-visitor.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomService } from './@core/services/room.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { TableComponent } from './components/table.component';
import { ChatComponent } from './components/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomAdminComponent,
    RoomVisitorComponent,
    TableComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
