
/* eslint-disable  react/prefer-stateless-function */

// ----- IMPORTS

import * as React from 'react';
import HcGetItDoneLinkListItem from '../HcGetItDoneLinkListItem/HcGetItDoneLinkListItem';
import HcGetItDoneLinkDiv from '../HcGetItDoneLinkDiv/HcGetItDoneLinkDiv';
import Collapsible from '../../../Collapsible/Collapsible';


// ----- COMPONENT

export default class HcGetItDoneViewByGroup extends React.Component {
	render() {
		return (
			<div id={`hc-get-it-done-group_${this.props.groupId}`} className="hc-get-it-done-group mos-react-component-root">
				<h3>{this.props.groupContent.name}</h3>
				{
					this.props.groupContent.items.prominent &&

					<ul>
						{
							this.props.groupContent.items.prominent.map(itemValue => (
								<HcGetItDoneLinkListItem
									key={itemValue.key}
									listItemId={itemValue.key}
									listItemContent={itemValue}
								/>
							))
						}
						<Collapsible
							textCollapsed={`Show more ${this.props.groupContent.name} items`}
							textExpanded={`Hide some ${this.props.groupContent.name} items`}
							iconNameCollapsed="ChevronDown"
							iconNameExpanded="ChevronUp"
							buttonClassName="hc-get-it-done-group__collapsible-button"
							buttonPosition="afterContent"
						>
							<div id="hc-get-it-done-group__collapsed-items">
								{
									this.props.groupContent.items.collapsed.map(itemValue => (
										<HcGetItDoneLinkListItem
											key={itemValue.key}
											listItemId={itemValue.key}
											listItemContent={itemValue}
										/>
									))
								}
							</div>
						</Collapsible>
					</ul>
				}
				{
					this.props.groupContent.items[1] && 

					<ul>
						{
							this.props.groupContent.items.map(itemValue => (
								<HcGetItDoneLinkListItem
									key={itemValue.key}
									listItemId={itemValue.key}
									listItemContent={itemValue}
								/>
							))
						}
					</ul>
				}
				{
					this.props.groupContent.items[0] && !this.props.groupContent.items[1] &&

					<HcGetItDoneLinkDiv
						key={this.props.groupContent.items[0].key}
						listItemId={this.props.groupContent.items[0].key}
						listItemContent={this.props.groupContent.items[0]}

					/>
				}
			</div>
		);
	}
}
