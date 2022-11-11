export const environment = {
	production: true
};

interface AppConfigConstantsType {
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
	version: '20221111.08', //alter this before build
	...(typeof BUILD_TIME === 'undefined' ? { buildTime: 'Unknown' } : BUILD_TIME),
}
