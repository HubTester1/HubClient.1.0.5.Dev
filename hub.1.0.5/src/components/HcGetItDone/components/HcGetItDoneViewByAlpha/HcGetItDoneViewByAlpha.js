
/* eslint-disable  react/prefer-stateless-function */

// ----- IMPORTS

import * as React from 'react';
import HcGetItDoneLinkListItem from '../HcGetItDoneLinkListItem/HcGetItDoneLinkListItem';

// ----- COMPONENT

export default class HcGetItDoneViewByAlpha extends React.Component {
	render() {
		return (
			<div>
				{
					this.props.listItemsAlphaArray[0] &&
					
					<div id="hc-get-it-done-view-by-alpha" className="mos-react-component-root">
						<ul>
							{this.props.listItemsAlphaArray.map((listItemValue, listItemIndex) => (
								<HcGetItDoneLinkListItem
									key={listItemValue.key}
									listItemId={listItemValue.key}
									listItemContent={listItemValue}
								/>
							))}
						</ul>
					</div>
				}
				{
					!this.props.listItemsAlphaArray[0] &&

					<div className="banner">
						<p className="banner__text">Sorry, I can&apos;t find any items to show you.</p>
					</div>
				}
			</div>
		);
	}
}
