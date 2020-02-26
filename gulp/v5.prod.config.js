
module.exports = {
	ReturnV5ProdSrcFolder: () => './hub.1.0.5/src',
	ReturnV5ProdDistFolder: () => './hub.1.0.5/dist',
	ReturnV5SPSaveProdOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubprod',
		notification: true,
		folder: 'Code5',
		flatten: false,
	}),
};
