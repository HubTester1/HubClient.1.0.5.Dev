
// ----- IMPORTS

import * as React from 'react';
import HcContextData from './HcContextData';
import MOSUtilities from '../../services/MOSUtilities';

// ----- COMPONENT

const HcContext = React.createContext();

export default class HcContextProvider extends React.Component {
	state = {};
	componentDidMount() {
		HcContextData.ReturnUData()
			.then((response) => {
				const accountBrief =
						MOSUtilities.ReplaceAll('i:0#.f\\|membership\\|', '', MOSUtilities.ReplaceAll('@mos.org', '', response.LoginName.toLowerCase()));
				this.setState(() => ({
					uData: {
						email: response.Email,
						account: accountBrief,
						displayName: response.Title,
					},
				}));
			})
			.catch((error) => {
				// 
			});
	}
	render() {
		return (
			<HcContext.Provider value="hereknae">
				{this.props.children}
			</HcContext.Provider>
		);
	}
}
