
module.exports = {
	ReturnV2ProdStylesSrcFolder: () => './hub.1.0.2/sass',
	ReturnV2ProdStylesSrcFile: () => './hub.1.0.2/sass/partials/_mos.sass',
	ReturnV2ProdStylesDistFolder: () => './hub.1.0.2/css',
	ReturnV2ProdStylesDistFile: () => './hub.1.0.2/css/mos.css',
	ReturnV2ProdSWFAPIFile: () => './hub.1.0.2/js/mos-main.1.04.js',
	ReturnV2ProdDistFolder: () => './hub.1.0.2',
	ReturnV2ProdSPSaveAllOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code2',
		flatten: false,
	}),
	ReturnV2ProdSPSaveCSSOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code2/css',
		flatten: false,
	}),
	ReturnV2ProdSPSaveSWFAPIOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code2/js',
		flatten: false,
	}),
};
