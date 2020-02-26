
// ----- IMPORTS

import pnp, { Web } from 'sp-pnp-js';
import MOSUtilities from './MOSUtilities';
import HttpClient from './APIClient';


// ----- DATA

export default class User {
	static ReturnGSEConfig() {
		const gseConfigWeb = new Web('https://bmos.sharepoint.com/sites/hr-service-config');
		return gseConfigWeb.lists.getByTitle('SWFList').items
			.select('AllRequestData')
			.get();
	}
	static SetComponentGroupID() {
		// set component group ID
		if (window.mData && window.mData.axle && window.mData.axle === 1) {
			window.mData.componentGroupID = 1;
		}
		if (window.mData && window.mData.community && window.mData.community === 1) {
			window.mData.componentGroupID = 2;
		}
		if (window.mData && window.mData.swf && window.mData.swf === 1) {
			window.mData.componentGroupID = 3;
		}
		if (window.mData && window.mData.visualization && window.mData.visualization === 1) {
			window.mData.componentGroupID = 4;
		}
	}
	static ReturnComponentGroupAdminData() {
		// set component group ID
		this.SetComponentGroupID();
		// get and retrieve the data
		const gseComponentGroupLogWeb = new Web('https://bmos.sharepoint.com/sites/hubprod/');
		return gseComponentGroupLogWeb.lists.getByTitle('Component Group Log').items
			// .select('GroupAdminAccess')
			.select('GroupAdminAccess/Name')
			.expand('GroupAdminAccess')
			.filter(`ComponentGroupID eq '${window.mData.componentGroupID}'`)
			.get();
	}
	static ReturnThisUserIsComponentGroupAdmin() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the component group admin data
			this.ReturnComponentGroupAdminData()
				// if the promise was resolved with the data
				.then((result) => {
					const groupAdminAccess = []; 
					result[0].GroupAdminAccess.forEach((user) => {
						groupAdminAccess.push(user.Name);
					});
					resolve(groupAdminAccess);
				})
				// if the promise was rejected with an error
				.catch((error) => {
					reject(error);
				});
		});
	}


	static ReturnUData() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// collect data async from multiple sources
			const userDataQueryPromises = [
				pnp.sp.web.currentUser.get(),
				HttpClient
					.ReturnAPIData('https://neso.mos.org/activeDirectory/managers'),
				this.ReturnThisUserIsComponentGroupAdmin(),
				this.ReturnGSEConfig(),
				HttpClient
					.ReturnAPIData('https://neso.mos.org/activeDirectory/divDept/div/Human Resources & Volunteer Services'),
			];
			// wait for all queries to be completed
			Promise.all(userDataQueryPromises)
			// if the queries returned the data
				.then((resultsArray) => {
					// extract data from responses
					const uData = {
						email: resultsArray[0].Email,
						displayName: resultsArray[0].Title,
					};
					uData.account =
							MOSUtilities.ReplaceAll('i:0#.f\\|membership\\|', '', MOSUtilities.ReplaceAll('@mos.org', '', resultsArray[0].LoginName.toLowerCase()));
					uData.accountLong = resultsArray[0].LoginName.toLowerCase();
					uData.roles = [];
					// hard code some roles for service accounts
					if (uData.account === 'sp1') {
						uData.roles.push('pafAdmin');
						uData.roles.push('earAdmin');
						uData.roles.push('manager');
						uData.roles.push('gseManager');
					}
					if (uData.account === 'sp2') {
						uData.roles.push('pafAdmin');
						uData.roles.push('earAdmin');
					}
					if (uData.account === 'sp3') {
						uData.roles.push('manager');
						uData.roles.push('gseManager');
					}
					// handle normal accounts
					// for each manager returned
					resultsArray[1].forEach((manager) => {
						// if the manager's account is the current user's account
						if (manager.account === uData.account) {
							// push manager roles to uData
							uData.roles.push('manager');
							uData.roles.push('gseManager');
						}
					});
					// for each componentGrpAdmin returned
					resultsArray[2].forEach((componentGrpAdmin) => {
						if (componentGrpAdmin === uData.accountLong) {
							// push admin and componentGrpAdmin roles to uData
							uData.roles.push('admin');
							uData.roles.push('componentGrpAdmin');
						}
					});
					// extract GSE config data
					let gseConfigString = resultsArray[3][0].AllRequestData;
					// eslint-disable-next-line no-control-regex
					const regexOne = new RegExp('\r', 'g');
					// eslint-disable-next-line no-control-regex
					const regexTwo = new RegExp('\n', 'g');
					gseConfigString = gseConfigString.replace(regexOne, "'");
					gseConfigString = gseConfigString.replace(regexTwo, "'");
					const gseConfig = JSON.parse(gseConfigString);
					// for each hr admin returned
					gseConfig['HR-Admins'].forEach((gseHRAdmin) => {
						// if the hr admin's account is the current user's account
						if (gseHRAdmin.account === uData.accountLong) {
							// push gseHRAdmin role to uData
							uData.roles.push('gseHRAdmin');
						}
					});
					// for each job admin returned
					gseConfig['Job-Admins'].forEach((gseJobAdmin) => {
						// if the job admin's account is the current user's account
						if (gseJobAdmin.account === uData.accountLong) {
							// push gseJobAdmin role to uData
							uData.roles.push('gseJobAdmin');
						}
					});
					// for each hrvsMember returned
					resultsArray[4].forEach((hrvsMember) => {
						// if the hrvsMember's account is the current user's account
						if (hrvsMember.account === uData.account) {
							// push manager and hrvsMember roles to uData
							uData.roles.push('pafAdmin');
							uData.roles.push('earAdmin');
						}
					});
					// resolve this promise with the user data
					console.log('uData');
					console.log(uData);
					resolve(uData);
				})
			// if 1+ queries returned an error, reject this promise with the error
				.catch((error) => { reject(error); });
		});
	}
}
