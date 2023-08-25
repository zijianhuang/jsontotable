import { AppConfigConstants } from "../environments/environment";

export class APP_DI_CONFIG {
	static readonly version: string = AppConfigConstants.version;

	static readonly buildTime = AppConfigConstants.buildTime;

	/**
	 * Initialized in app-root component, by injected DIALOG_ACTIONS_ALIGN, provided in app module.
	 */
	static DialogActionsAlign: 'start' | 'center' | 'end' = 'end';
}
