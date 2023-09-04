import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DIALOG_ACTIONS_ALIGN, NmceComponentsModule, Nmce_UI_ServicesModule } from 'nmce';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmUploadComponent, ConfirmUploadService } from './confirmUpload.component';
import { JsonTreeComponent } from './json-tree.component';
import { NGMDModule } from './ngmd.module';
import { TextareaComponent, TextareaDialogService } from './textarea.component';
import { TreeTableCdkComponent } from './tree-table-cdk.component';
import { TreeTableComponent } from './tree-table.component';
import { UpdateAppService } from './updateApp.service';

const routes: Routes = [

];

@NgModule({
	declarations: [
		AppComponent,
		JsonTreeComponent,
		TreeTableComponent,
		TreeTableCdkComponent,
		ConfirmUploadComponent,
		TextareaComponent,
	],
	imports: [
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			//registrationStrategy: 'registerWhenStable:30000'
			registrationStrategy: 'registerImmediately'
		}),
		NGMDModule,
		Nmce_UI_ServicesModule, NmceComponentsModule,
		NgxDropzoneModule,
	],

	providers: [ConfirmUploadService, TextareaDialogService,
		//nmce dialogs will use this.
		{
			provide: DIALOG_ACTIONS_ALIGN,
			useValue: 'end'
		},

		UpdateAppService,
		//ActivatedRoute,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
