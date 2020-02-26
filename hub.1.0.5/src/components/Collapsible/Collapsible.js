
// ----- IMPORTS

import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import FadeIn from '../FadeIn/FadeIn';

// ----- COMPONENT

export default class Collapsible extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: true,
		};
		this.handleCollapsibleClick = this.handleCollapsibleClick.bind(this);
	}
	handleCollapsibleClick() {
		this.setState(prevState => ({
			collapsed: !prevState.collapsed,
		}));
	}
	render() {
		let iconNameThisState = '';
		// if collapsible is collapsed
		if (this.state.collapsed) {
			// if an icon name was supplied for this state
			if (this.props.iconNameCollapsed) {
				iconNameThisState = this.props.iconNameCollapsed;
			// if no icon name was supplied for this state
			} else {
				iconNameThisState = 'ChevronUp';
			}
		// if collapsible is expanded and an icon name was supplied for this state
		} else if (this.props.iconNameExpanded) {
			iconNameThisState = this.props.iconNameExpanded;
		// if collapsible is expanded and no icon name was supplied for this state
		} else {
			iconNameThisState = 'ChevronDown';
		}


		return (
			<div>
				{
					this.props.buttonPosition === 'beforeContent' &&
				
					<DefaultButton
						iconProps={{ iconName: iconNameThisState }}
						text={this.state.collapsed ? this.props.textCollapsed : this.props.textExpanded}
						className={`collapsible-section-button ${this.props.buttonClassName}`}
						onClick={this.handleCollapsibleClick}
						aria-expanded={!this.state.collapsed}
						data-action="disclosure"
					/>
				}
				<FadeIn
					in={!this.state.collapsed}
				>
					{this.props.children}
				</FadeIn>
				{
					this.props.buttonPosition === 'afterContent' &&

					<DefaultButton
						iconProps={{ iconName: iconNameThisState }}
						text={this.state.collapsed ? this.props.textCollapsed : this.props.textExpanded}
						className={`collapsible-section-button ${this.props.buttonClassName}`}
						onClick={this.handleCollapsibleClick}
						aria-expanded={!this.state.collapsed}
						data-action="disclosure"
					/>
				}
			</div>
		);
	}
}
