
module.exports = {
	ReturnV5DevSrcFolder: () => './hub.1.0.5/src',
	ReturnV5DevDistFolder: () => './hub.1.0.5/dist',
	ReturnV5SPSaveDevOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubdev',
		notification: true,
		folder: 'DevCode5',
		flatten: false,
	}),
};
