import { ChangeDetectionStrategy, Component, Injectable, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { APP_DI_CONFIG, ViewerSettings } from './app-config';

@Component({
	selector: 'settings',
	templateUrl: 'settings.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
	get isSmallScreen() {
		return APP_DI_CONFIG.isSmallScreen;
	}


	@Input()
	showTitle = true;

	constructor(
	) {
		console.debug('ViewSettingsComponent created');
	}
	ngOnInit(): void {
	}

	close() {

	}

}

@Injectable()
export class ViewSettingsDialogService {
	constructor(private dialog: MatDialog) { }

	/**
	 * Display poem object in editor.
	 * @param data
	 */
	open(): Observable<void> {
		const modalRef = this.dialog.open(SettingsComponent, {
			disableClose: true,
			autoFocus: false,
			minWidth: '98vw',
			minHeight: '98vh',
			panelClass: 'dialog-full-content-height',
		});

		return modalRef.afterClosed();
	}

}
