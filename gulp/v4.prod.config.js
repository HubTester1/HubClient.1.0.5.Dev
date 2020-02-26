
module.exports = {
	ReturnV4ProdStylesSrcFolder: () => './hub.1.0.4/sass',
	ReturnV4ProdStylesSrcFile: () => './hub.1.0.4/sass/partials/_mos.sass',
	ReturnV4ProdStylesDistFolder: () => './hub.1.0.4/css',
	ReturnV4ProdStylesDistFile: () => './hub.1.0.4/css/mos.css',
	ReturnV4ProdSWFAPIFile: () => './hub.1.0.4/js/mos-main.1.04.js',
	ReturnV4ProdDistFolder: () => './hub.1.0.4',
	ReturnV4ProdSPSaveAllOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code4',
		flatten: false,
	}),
	ReturnV4ProdSPSaveCSSOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code4/css',
		flatten: false,
	}),
	ReturnV4ProdSPSaveSWFAPIOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code4/js',
		flatten: false,
	}),
};
