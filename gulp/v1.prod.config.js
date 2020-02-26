
module.exports = {
	ReturnV1ProdStylesSrcFolder: () => './hub.1.0.2/sass',
	ReturnV1ProdStylesSrcFile: () => './hub.1.0.2/sass/partials/_mos.sass',
	ReturnV1ProdStylesDistFolder: () => './hub.1.0.2/css',
	ReturnV1ProdStylesDistFile: () => './hub.1.0.2/css/mos.css',
	ReturnV1ProdSWFAPIFile: () => './hub.1.0.2/js/mos-main.1.04.js',
	ReturnV1ProdDistFolder: () => './hub.1.0.2',
	ReturnV1ProdSPSaveAllOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code2',
		flatten: false,
	}),
	ReturnV1ProdSPSaveCSSOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code2/css',
		flatten: false,
	}),
	ReturnV1ProdSPSaveSWFAPIOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code2/js',
		flatten: false,
	}),
};
