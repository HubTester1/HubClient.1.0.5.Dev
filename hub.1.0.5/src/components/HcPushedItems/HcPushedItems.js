
// ----- IMPORTS

import * as React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import {
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';
import HcPushedItemsData from './HcPushedItemsData';
import HcPushedItemsLink from './HcPushedItemsLink';

import './HcPushedItems.sass';
import './HcPushedItemsMediumLarge.sass';
import './HcPushedItemsSmall.sass';

// ----- COMPONENT

export default class HcPushedItems extends React.Component {
	state = {
		listItemsArray: [],
		ready: false,
	};

	componentDidMount() {
		HcPushedItemsData.ReturnAllPushedItemsData()
			.then((allPushedItemsData) => {
				this.setState(() => ({
					listItemsArray: allPushedItemsData,
					ready: true,
				}));
			});
	}
	returnPlaceholder(screenType) {
		if (screenType === 'medium') {
			return (
				<div
					className="mos-placeholder-column-container hc-pushed-items-placeholder"
				>
					<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
					<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
					<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
				</div>
			);
		}
		return (
			<div
				className="mos-placeholder-column-container hc-pushed-items-placeholder"
			>
				<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-pushed-items-placeholder-column" />
			</div>
		);
	}
	render() {
		if (this.props.screenType === 'small') {
			return (
				<AccordionItem
					id="hc-pushed-items"
					className="hc-pushed-items mos-react-component-root accordion__item"
					hideBodyClassName="accordion__item--hidden"
					name="hc-pushed-items"
				>
					<AccordionItemTitle
						className="hc-pushed-items__title accordion__title accordion__title--animated"
					>
						<h2 className="u-position-relative">
							<div className="accordion__title__text">Quick Hits</div>
							<div className="accordion__arrow" role="presentation" />
						</h2>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-pushed-items__body accordion__body"
					>
						<ul id="hc-pushed-items-list">
							{
								this.state.listItemsArray.map((listItemValue, listItemIndex) => (
									<HcPushedItemsLink
										key={listItemValue.key}
										listItemId={listItemValue.key}
										listItemContent={listItemValue}
									/>
								))
							}
						</ul>
					</AccordionItemBody>
				</AccordionItem>
			);
		}
		return (
			<div id="hc-pushed-items" className="mos-react-component-root" name="hc-pushed-items">
				<h2>Quick Hits</h2>
				<ReactPlaceholder
					customPlaceholder={this.returnPlaceholder(this.props.screenType)}
					ready={this.state.ready}
					showLoadingAnimation
				>
					<ul id="hc-pushed-items-list">
						{
							this.state.listItemsArray.map((listItemValue, listItemIndex) => (
								<HcPushedItemsLink
									key={listItemValue.key}
									listItemId={listItemValue.key}
									listItemContent={listItemValue}
								/>
							))
						}
					</ul>
				</ReactPlaceholder>
			</div>
		);
	}
}
