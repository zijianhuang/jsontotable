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

@NgModule({
	declarations: [
		AppComponent,
		JsonTreeComponent,
		TreeTableComponent,
		TreeTableCdkComponent,
		ConfirmUploadComponent,
	],
	imports: [
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
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
	],
	providers: [ConfirmUploadService],
	bootstrap: [AppComponent]
})
export class AppModule { }
