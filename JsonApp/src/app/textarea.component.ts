import { AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

/**
 * @title Dialog Overview
 */
@Component({
	templateUrl: 'textarea.component.html',
})
export class TextareaComponent {
	data?: string;

	constructor(public dialogRef: MatDialogRef<TextareaComponent>) { }

	useText() {
		if (this.data) {
			this.dialogRef.close(this.data);
		}
	}
}

@Injectable()
export class TextareaDialogService {
	constructor(private dialog: MatDialog) { }

	open(): Observable<string> {
		const modalRef = this.dialog.open(TextareaComponent, {
			autoFocus: true,
		});

		return modalRef.afterClosed();
	}

}
