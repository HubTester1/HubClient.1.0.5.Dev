
/* eslint-disable  react/prefer-stateless-function */

// ----- IMPORTS

import * as React from 'react';
import HcGetItDoneGroup from '../HcGetItDoneGroup/HcGetItDoneGroup';

// ----- COMPONENT

export default class HcGetItDoneViewByGroup extends React.Component {
	render() {
		return (
			<div>
				{
					this.props.listItemsGroupedArray[0] &&

					<div id="hc-get-it-done-view-by-group" className="mos-react-component-root">
						{
							this.props.listItemsGroupedArray.map(groupValue => (
								<HcGetItDoneGroup
									key={groupValue.key}
									groupId={groupValue.key}
									groupContent={groupValue}
									uData={this.props.uData}
								/>
							))
						}
					</div>
				}
				{
					!this.props.listItemsGroupedArray[0] &&

					<div className="banner">
						<p className="banner__text">Sorry, I can&apos;t find any items to show you.</p>
					</div>
				}
			</div>
		);
	}
}
