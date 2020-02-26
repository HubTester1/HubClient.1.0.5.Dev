
// ----- IMPORTS

import * as React from 'react';
import HcStaffLookup from '../HcStaffLookup/HcStaffLookup';
// import HcPushedItems from '../../components/HcPushedItems/HcPushedItems';
import HcMessages from '../HcMessages/HcMessages';
import HcBkgrdInfo from '../HcBkgrdInfo/HcBkgrdInfo';


import './HcHero.sass';
import './HcHeroSmall.sass';
import './HcHeroMediumLarge.sass';

// ----- COMPONENT

const HcHero = props => (
	<div id="hero-container" className="mos-react-component-root">
		{
			(props.screenType === 'medium' || props.screenType === 'large') &&

			<div id="staff-lookup-and-background-info-and-top-messages">
				<div id="staff-lookup-and-background-info">
					<HcStaffLookup 
						inHcHero
					/>
					<HcBkgrdInfo />
				</div>
				<HcMessages
					uData={props.uData}
					allOrTop="top"
				/>
			</div>
		}
		{
			props.screenType === 'small' &&

			<div id="staff-lookup-and-background-info">
				<HcStaffLookup
					inHcHero
				/>
			</div>
		}
	</div>
);

export default HcHero;
