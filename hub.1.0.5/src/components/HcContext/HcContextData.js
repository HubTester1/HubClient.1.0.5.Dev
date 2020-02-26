
// ----- IMPORTS

import pnp from 'sp-pnp-js';

// ----- DATA

export default class HcContainerData {
	static ReturnUData() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			resolve(pnp.sp.web.currentUser.get());
		}));
	}
}
