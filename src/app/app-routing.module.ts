import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { RoomAdminComponent } from './pages/room-admin.component';
import { RoomVisitorComponent } from './pages/room-visitor.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'room-admin/:id',
    component: RoomAdminComponent,
  },
  {
    path: 'room-visitor/:id',
    component: RoomVisitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
