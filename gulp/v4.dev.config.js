
module.exports = {
	ReturnV4DevStylesSrcFolder: () => './hub.1.0.4/sass',
	ReturnV4DevStylesSrcFile: () => './hub.1.0.4/sass/partials/_mos.sass',
	ReturnV4DevStylesDistFolder: () => './hub.1.0.4/css',
	ReturnV4DevStylesDistFile: () => './hub.1.0.4/css/mos.css',
	ReturnV4DevSWFAPIFile: (apiToken) => {
		let SWFAPIFile = './hub.1.0.4/js/dev_mos-main';
		if (apiToken) {
			if (apiToken === 'long') {
				SWFAPIFile += '_long';
			}
			if (apiToken === 'medium') {
				SWFAPIFile += '_medium';
			}
		}
		SWFAPIFile += '.1.04.js';
		return SWFAPIFile;
	},	
	ReturnV4DevDistFolder: () => './hub.1.0.4',
	ReturnV4DevSPSaveAllOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubdev',
		notification: true,
		folder: 'DevCode4',
		flatten: false,
	}),
	ReturnV4DevSPSaveCSSOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubdev',
		notification: true,
		folder: 'DevCode4/css',
		flatten: false,
	}),
	ReturnV4DevSPSaveSWFAPIOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubdev',
		notification: true,
		folder: 'DevCode4/js',
		flatten: false,
	}),


};
