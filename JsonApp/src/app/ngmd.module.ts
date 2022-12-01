import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material/core'; //MD tutorial site use this.
import {
	MatLegacyAutocompleteModule as MatAutocompleteModule
} from '@angular/material/legacy-autocomplete';
import {
	MatBadgeModule
} from '@angular/material/badge';
import {
	MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import {
	MatLegacyButtonModule as MatButtonModule
} from '@angular/material/legacy-button';
import {
	MatButtonToggleModule
} from '@angular/material/button-toggle';
import {
	MatLegacyCardModule as MatCardModule
} from '@angular/material/legacy-card';
import {
	MatLegacyCheckboxModule as MatCheckboxModule
} from '@angular/material/legacy-checkbox';
import {
	MatLegacyChipsModule as MatChipsModule
} from '@angular/material/legacy-chips';
import {
	MatDatepickerModule
} from '@angular/material/datepicker';
import {
	MatLegacyDialogModule as MatDialogModule
} from '@angular/material/legacy-dialog';
import {
	MatExpansionModule
} from '@angular/material/expansion';
import {
	MatGridListModule
} from '@angular/material/grid-list';
import {
	MatIconModule
} from '@angular/material/icon';
import {
	MatLegacyInputModule as MatInputModule
} from '@angular/material/legacy-input';
import {
	MatLegacyListModule as MatListModule
} from '@angular/material/legacy-list';
import {
	MatLegacyMenuModule as MatMenuModule
} from '@angular/material/legacy-menu';
import {
	MatLegacyPaginatorModule as MatPaginatorModule
} from '@angular/material/legacy-paginator';
import {
	MatLegacyProgressBarModule as MatProgressBarModule
} from '@angular/material/legacy-progress-bar';
import {
	MatLegacyProgressSpinnerModule as MatProgressSpinnerModule
} from '@angular/material/legacy-progress-spinner';
import {
	MatLegacyRadioModule as MatRadioModule
} from '@angular/material/legacy-radio';
import {
	MatLegacySelectModule as MatSelectModule
} from '@angular/material/legacy-select';
import {

	MatSidenavModule
} from '@angular/material/sidenav';
import {
	MatLegacySliderModule as MatSliderModule
} from '@angular/material/legacy-slider';
import {
	MatLegacySnackBarModule as MatSnackBarModule
} from '@angular/material/legacy-snack-bar';
import {
	MatSortModule
} from '@angular/material/sort';
import {
	MatStepperModule
} from '@angular/material/stepper';
import {
	MatLegacyTableModule as MatTableModule
} from '@angular/material/legacy-table';
import { CdkTableModule } from '@angular/cdk/table';
import {
	MatLegacyTabsModule as MatTabsModule
} from '@angular/material/legacy-tabs';
import {
	MatToolbarModule
} from '@angular/material/toolbar';
import {
	MatLegacyTooltipModule as MatTooltipModule
} from '@angular/material/legacy-tooltip';



@NgModule({
	exports: [
		CdkTableModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatBadgeModule,
		MatChipsModule,
		//MatCoreModule,
		MatDatepickerModule,
		MatDialogModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		//MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatBottomSheetModule,

		LayoutModule,
		MatStepperModule,
		ScrollingModule,
	],
	providers: [
		//{ provide: MAT_DIALOG_DATA, useValue: {} },
		//{ provide: MatDialogRef, useValue: {} }

		//{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' },By default, the MAT_DATE_LOCALE injection token will use the existing LOCALE_ID locale code from @angular/core.
		//If you want to override it, you can provide a new value for the MAT_DATE_LOCALE token

		// The adapter has to be provided to each lazy module which imports this module.
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, strict: true } },
		//the moment setting here works only for person.component, not invoiceBulkBill.component in which I have to declare providers there, more exactly, in dateInput Component.
		//`MomentDateAdapter` and`MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
		// `MatMomentDateModule` in your applications root module.

	]
})
export class NGMDModule { }
