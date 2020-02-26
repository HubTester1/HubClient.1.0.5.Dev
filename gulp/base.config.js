
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = {
	ReturnGulpSPSaveCredentials: () => 
		({
			username: process.env.spUser,
			password: process.env.spPassword,
		}),
	ReturnSWFSettingsFile: appToken => `./hub.1.0.4/swf/${appToken}/settings.js`,
	ReturnSWFImporterFile: appToken => `./hub.1.0.4/swf/${appToken}/wpc_importer.html`,
	ReturnSPSaveSWFSettingsOptions: appToken => ({
		siteUrl: `https://bmos.sharepoint.com/sites/${appToken}`,
		notification: true,
		folder: 'SiteAssets',
		flatten: false,
	}),
};
