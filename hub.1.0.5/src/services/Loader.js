
/* 
	We use this so that we can alter which files load (in some cases globally, in some cases
	according to a site's settings) without having to modify the SP master page for a site or 
	for all sites.
*/

// ---- GLOBAL VARS

const debugMode = true;
const date = new Date();
const timestamp = date.getTime();

if (debugMode) { console.log('using mos-loader m47'); }

// get portion of local site collection path that comes after "sites/"
let localSiteCollectionURL = '';
if (location.pathname.indexOf('sites/') !== -1) {
	const localSiteCollectionPathAfterSitesSlash = location.pathname.slice(7);
	// get portion of that that comes before the first slash
	const localSiteCollectionToken = localSiteCollectionPathAfterSitesSlash.substr(0, localSiteCollectionPathAfterSitesSlash.indexOf('/'));
	// formulate local site collection URL
	localSiteCollectionURL = `https://bmos.sharepoint.com/sites/${localSiteCollectionToken}/`;
} else {
	localSiteCollectionURL = 'https://bmos.sharepoint.com/';
}


// config base paths of file storage locations
const devCentrallyManagedFileBasePathBasePath = 'https://bmos.sharepoint.com/sites/hubdev/DevCode5/';
const stageCentrallyManagedFileBasePathBasePath = 'https://bmos.sharepoint.com/sites/hubdev/StageCode5/';
const prodCentrallyManagedFileBasePathBasePath = 'https://bmos.sharepoint.com/sites/hubprod/Code5/';
let centrallyManagedFileBasePathBasePath = prodCentrallyManagedFileBasePathBasePath;
// note: will determine whether or not the centrally managed dev or stage file base path should 
// 		be used instead, but can only do so after the site's local settings have been 
// 		loaded and parsed

// stylesheets
const stylesheetsToLoad = [
	{ centrallyManaged: 1, 						path: 'mos.1.0.5.Styles.css' },
];

// local settings
const settingsLoadingPromises = [];
const settingsToLoad = [
	// settings
	{ localSiteAssets: 1,		notCached: 1,		path: 'settings.js' },
	// { centrallyManaged: 1, js: 1, path: 'jquery.2.2.0.js' },
	// { centrallyManaged: 1, js: 1, path: 'jquery.SPServices.2014.02.min.js' },
];

// mos.1.0.5
const mosLoadingPromises = [];
const mosToLoad = [
	{ centrallyManaged: 1,	notCached: 1,		path: 'mos.1.0.5.App.js' },
];


function ReturnURLToLoad(file, mData) {
	let urlToLoad = '';

	if (typeof (file.centrallyManaged) !== 'undefined' && file.centrallyManaged === 1) {
		urlToLoad += centrallyManagedFileBasePathBasePath;
	}

	if (typeof (file.localSiteAssets) !== 'undefined' && file.localSiteAssets === 1) {
		urlToLoad += `${localSiteCollectionURL}SiteAssets/`;
	}

	if (typeof (file.path) !== 'undefined') {
		urlToLoad += file.path;
	}

	if (typeof (file.notCached) !== 'undefined' && file.notCached === 1) {
		urlToLoad += `?v=${timestamp}`;
	} else if (debugMode) {
		urlToLoad += `?v=${timestamp}`;
	}
	// console.log(urlToLoad);
	return urlToLoad;
}

function LoadCSSFiles(filesToLoad, callback) {
	filesToLoad.forEach((file) => {
		const urlToLoad = ReturnURLToLoad(file);
		const fileReference = document.createElement('link');
		const relAttribute = document.createAttribute('rel');
		const hrefAttribute = document.createAttribute('href');
		relAttribute.value = 'stylesheet';
		hrefAttribute.value = urlToLoad;
		fileReference.setAttributeNode(relAttribute);
		fileReference.setAttributeNode(hrefAttribute);
		document.getElementsByTagName('head')[0].appendChild(fileReference);
	});
	if (callback && typeof (callback) === 'function') {
		callback();
	}
}

function LoadJSFile(urlToLoad) {
	// return a new promise
	return new Promise((resolve, reject) => {
		const httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function EvalCode() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					eval(httpRequest.responseText);
					resolve({ error: false });
				} else {
					console.log(`__failed to load: ${urlToLoad}`);
					reject({ error: true, status: httpRequest.status });
				}
			}
		};
		httpRequest.open('GET', urlToLoad, true);
		httpRequest.send();
	});
}

function LoadJSFiles(filesToLoad, promiseTracker, mData, callback) {
	filesToLoad.forEach((file) => {
		const urlToLoad = ReturnURLToLoad(file, mData);
		promiseTracker.push(LoadJSFile(urlToLoad));
	});
	Promise.all(promiseTracker)
		.then((results) => {
			if (callback && typeof (callback) === 'function') {
				callback();
			}
		})
		.catch((error) => {
			console.log(`___failed to load: ${error.urlToLoad}`);
		});
}

function LoadFiles() {
	LoadJSFiles(settingsToLoad, settingsLoadingPromises, null, () => {
		const { mData } = window;
		console.log('looking at mData');
		if (typeof (mData) !== 'undefined' && mData.mosKey.indexOf('dev') !== -1) {
			console.log('found dev in mData');
			centrallyManagedFileBasePathBasePath = devCentrallyManagedFileBasePathBasePath;
		}
		if (typeof (mData) !== 'undefined' && mData.mosKey.indexOf('stage') !== -1) {
			console.log('found stage in mData');
			centrallyManagedFileBasePathBasePath = stageCentrallyManagedFileBasePathBasePath;
		}
		LoadCSSFiles(stylesheetsToLoad, () => {
			LoadJSFiles(mosToLoad, mosLoadingPromises, mData, () => {
				// TO DO - remove
				$.holdReady(false);
			});
		});
	});
}

(function SignifyContextNotReadyAndLoadFiles() {
	window.contextReady = false;
	LoadFiles();
}());
