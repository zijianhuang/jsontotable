export const environment = {
	production: true
};

interface Site_Config {
	dark?: boolean;
}

interface Site_Config {
	dark?: boolean;
}

interface AppConfigConstantsType {
	version: string;
	buildTime?: string; // for BUILD_TIME
}

declare const SITE_CONFIG: AppConfigConstantsType

interface AppConfigConstantsType extends Site_Config {
	version: string;
	buildTime?: string; // for BUILD_TIME
}

declare const BUILD_TIME: {
	/**
	 * Adjusted during build with build*.bat which inserts the variable to buildTime.js.
	 */
	buildTime?: string;
}

export const AppConfigConstants: AppConfigConstantsType = {
	version: '20230831.08', //alter this before build
	...(typeof SITE_CONFIG === 'undefined' ? {} : SITE_CONFIG),
	...(typeof BUILD_TIME === 'undefined' ? { buildTime: 'Unknown' } : BUILD_TIME),
}
