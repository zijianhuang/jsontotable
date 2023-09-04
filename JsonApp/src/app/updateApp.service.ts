import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertService, ConfirmService } from 'nmce';
import { APP_DI_CONFIG } from './app-config';

/**
 * Logout and cleanup
 */
@Injectable()
export class UpdateAppService {
	constructor(private confirmService: ConfirmService,
		private alertService: AlertService,
		private swUpdate: SwUpdate,
	) {
	}

	/**
	 * Logout and cleanup statuses. Called after launching the app.
	 */
	checkAvailable() {
		if (this.swUpdate.isEnabled) {
			this.swUpdate.versionUpdates.subscribe((versionEvent) => {
				console.info('versionEvent.type: ' + versionEvent.type);
				if (versionEvent.type === 'VERSION_DETECTED') {
					this.alertService.info('New FE version detected', true);
				} else if (versionEvent.type === 'VERSION_READY') {
					const msg = `New version of json2table app available to replace current ${APP_DI_CONFIG.version} / ${APP_DI_CONFIG.buildTime} of Json2Table`;
					console.debug(msg);
					window.location.reload(); //the msg will disappear from dev console.
				} else {
					console.debug('No updated version available.');
				}
			});
		}
	}

	/**
	 * Called after sign-in.
	 */
	checkUpdate() {
		this.swUpdate.checkForUpdate().then(
			(r) => {
				if (r) {
					this.checkAvailable();
				} else {
					this.alertService.info('No app update this time');
				}
			}
		);
	}
}


