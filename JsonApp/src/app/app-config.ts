import { AppConfigConstants } from "../environments/environment";

export class APP_DI_CONFIG {
	static readonly version: string = AppConfigConstants.version;

	static readonly buildTime = AppConfigConstants.buildTime;

}
