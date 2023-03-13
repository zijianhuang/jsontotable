import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { ConfirmUploadComponent, ConfirmUploadService } from './confirmUpload.component';
import { NGMDModule } from './ngmd.module';
import { TreeTableComponent } from './tree-table.component';
import { Nmce_UI_ServicesModule, NmceComponentsModule } from 'nmce';
import { TreeTableCdkComponent } from './tree-table-cdk.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { JsonTreeComponent } from './json-tree.component';
import { TextareaComponent, TextareaDialogService } from './textarea.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';

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
		HttpClientModule,
		ServiceWorkerModule.register(document.baseURI + 'ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			//registrationStrategy: 'registerWhenStable:30000'
			registrationStrategy: 'registerImmediately'
		}),
		NGMDModule,
		FlexLayoutModule,
		Nmce_UI_ServicesModule, NmceComponentsModule,
		NgxDropzoneModule,
	],
	providers: [ConfirmUploadService, TextareaDialogService,],
	bootstrap: [AppComponent]
})
export class AppModule { }
