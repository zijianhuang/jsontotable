import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent, WIPComponent } from 'nmce';

const routes: Routes = [

	{ path: 'wip', component: WIPComponent },
	{ path: '**', component: NotFoundComponent }, // This must be the last

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
