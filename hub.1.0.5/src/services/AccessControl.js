
// ----- IMPORTS

// import pnp, { Web } from 'sp-pnp-js';
// import MOSUtilities from './MOSUtilities';
// import HttpClient from './APIClient';


// ----- DATA

export default class AccessControl {
	static UserRolesAllowAccess(userRoles, restrictedToRoles, restrictedFromRoles) {
		// set flag indicating that access is not allowed
		let accessAllowed = false;
		// if access is restricted to at least one role and the user has at least one role to check
		if (userRoles && userRoles[0] && restrictedToRoles && restrictedToRoles[0]) {
			// for each role for which access is allowed
			restrictedToRoles.forEach((allowedRole) => {
				// for each of the user's role
				userRoles.forEach((userRole) => {
					// if this allowed role matches this user role
					if (allowedRole === userRole) {
						// set flag indicating that access is allowed
						accessAllowed = true;
						// if access is restricted from at least one role
						if (restrictedFromRoles && restrictedFromRoles[0]) {
							// for each role for which access is DISallowed
							restrictedFromRoles.forEach((disallowedRole) => {
								// for each of the user's role
								userRoles.forEach((userRoleAgain) => {
									// if this disallowed role matches this user role
									if (disallowedRole === userRoleAgain) {
										// revert flag to indicate that access is not allowed
										accessAllowed = false;
									}
								});
							});
						}
					}
				});
			});
		}
		return accessAllowed;
	}
}
