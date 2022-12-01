import { Component, Inject, Injectable, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { AlertService, ConfirmService } from 'nmce';
import { Observable } from 'rxjs';

/**
 * Use HTML File API to load a local file, and define the description. Return UploadBrief.
 */
@Component({
	templateUrl: 'confirmUpload.component.html',
})
export class ConfirmUploadComponent {
	@Input()
	title: string;

	@Input()
	body: string;

	mimeType?: string;
	file?: File;
	name?: string;
	description?: string;
	fileSize?: number;

	files: File[] = [];

	acceptFilter = '';

	constructor(@Inject(MAT_DIALOG_DATA) data: { title: string, body: string, acceptFilter?: string },
		public dialogRef: MatDialogRef<ConfirmUploadComponent, UploadBrief>,
		private confirmService: ConfirmService,
		private alertService: AlertService,
	) {
		this.title = data.title;
		this.body = data.body;
		this.acceptFilter = data.acceptFilter ?? 'image/*,video/*,text/*,audio/*';
	}

	confirm(): void {
		if (!this.file) {
			console.warn('Why confirm? while file missing.');
			return;
		}

		if (this.mimeType) {
			this.dialogRef.close({ file: this.file, mimeType: this.mimeType, name: this.name, description: this.description });
		} else {
			this.confirmService.open(`Warning`, `File type of selected file ${this.file.name} is unrecognized. If you upload it then it may not be displayed in the future. Do you want to upload it?`).subscribe(
				data => {
					if (data) {
						this.dialogRef.close({ file: this.file, mimeType: this.mimeType, name: this.name, description: this.description });
					} else {
						this.cancel();
					}
				}
			);
		}
	}

	cancel(): void {
		this.dialogRef.close();
	}

	fileChangeListener($event: any) {
		const fileList: FileList = $event.target.files;
		if (fileList.length > 0) {
			this.file = fileList[0];
			this.mimeType = this.file.type; // if file.type is not good enough, this might help: https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
			this.name = this.file.name;
			this.fileSize = this.file.size;
		}
	}


	onSelect(event: NgxDropzoneChangeEvent) {
		console.log(event);
		const acceptedFiles = event.addedFiles.filter(d => d.type.indexOf('json') >= 9);
		if (acceptedFiles.length > 0) {
			this.files = [];
			this.file = acceptedFiles[0];
			this.files.push(this.file);
			this.mimeType = this.file.type; // if file.type is not good enough, this might help: https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
			this.name = this.file.name;
			this.fileSize = this.file.size;
		} else {
			this.alertService.warn('No JSON file selected.');
		}

	}

	onRemove(file: File) {
		console.log(file);
		//this.files.splice(this.files.indexOf(file), 1);
	}

}


@Injectable()
export class ConfirmUploadService {
	modalRef?: MatDialogRef<ConfirmUploadComponent>;

	constructor(private dialog: MatDialog) { }

	open(title: string, body: string, acceptFilter?: string): Observable<UploadBrief> {
		this.modalRef = this.dialog.open(ConfirmUploadComponent, { disableClose: true, data: { title: title, body: body, acceptFilter: acceptFilter } });
		console.debug('acceptFiltersssssss: ' + acceptFilter);
		//if (acceptFilter !== undefined) {
		//	this.modalRef.componentInstance.acceptFilter = acceptFilter;
		//	console.debug('acceptFilter: ' + acceptFilter);
		//}

		return this.modalRef.afterClosed();
	}

	openDefault(): Observable<UploadBrief> {
		return this.open(`Confirm Upload`, `Select a file to upload.`);
	}
}

export interface UploadBrief {
	file?: File;
	mimeType?: string;
	name?: string;
	description?: string;
}
