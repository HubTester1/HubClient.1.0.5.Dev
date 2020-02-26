
module.exports = {
	ReturnV5StageSrcFolder: () => './hub.1.0.5/src',
	ReturnV5StageDistFolder: () => './hub.1.0.5/dist',
	ReturnV5SPSaveStageOptions: () => ({
		siteUrl: 'https://bmos.sharepoint.com/sites/hubdev',
		notification: true,
		folder: 'StageCode5',
		flatten: false,
	}),
};
