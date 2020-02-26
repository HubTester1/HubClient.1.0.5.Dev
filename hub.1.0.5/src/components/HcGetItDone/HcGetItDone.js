
// ----- IMPORTS

import * as React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import {
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';

import HcGetItDoneData from './HcGetItDoneData';
import HcGetItDoneCommandBar from './components/HcGetItDoneCommandBar/HcGetItDoneCommandBar';
import HcGetItDoneViewByAlpha from './components/HcGetItDoneViewByAlpha/HcGetItDoneViewByAlpha';
import HcGetItDoneViewByGroup from './components/HcGetItDoneViewByGroup/HcGetItDoneViewByGroup';

import './HcGetItDone.sass';
import './HcGetItDoneSmall.sass';
import './HcGetItDoneMediumLarge.sass';

// ----- COMPONENT

export default class HcGetItDone extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showViewByAlpha: false,
			showViewByGroup: true,
			collapsible: true,
			listItemsAlphaArray: [],
			listItemsGroupedArray: [],
			listItemsGroupedSegmentedArray: [],
			listItemsToRenderAlphaArray: [],
			listItemsToRenderGroupedArray: [],
			queryError: false,
			ready: false,
		};
		this.handleClickViewByAlphaButton = this.handleClickViewByAlphaButton.bind(this);
		this.handleClickViewByGroupButton = this.handleClickViewByGroupButton.bind(this);
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
		this.returnHcGetItDoneBody = this.returnHcGetItDoneBody.bind(this);
	}
	componentDidMount() {
		HcGetItDoneData.ReturnAllGetItDoneData(this.props.uData)
			.then((allGetItDoneItemsData) => {
				this.setState(() => ({
					listItemsAlphaArray: allGetItDoneItemsData.allListItemsAlpha,
					listItemsGroupedArray: allGetItDoneItemsData.allListItemsGrouped,
					listItemsGroupedSegmentedArray: allGetItDoneItemsData.allListItemsGroupedSegmented,
					listItemsToRenderAlphaArray: allGetItDoneItemsData.allListItemsAlpha,
					listItemsToRenderGroupedArray: allGetItDoneItemsData.allListItemsGrouped,
					ready: true,
				}));
			})
			.catch((error) => {
				console.log('ReturnAllGetItDoneData error');
				console.log(error);
				this.setState(() => ({
					queryError: true,
					ready: true,
				}));
			});
	}
	handleClickViewByAlphaButton(e) {
		e.preventDefault();
		this.setState(() => ({
			showViewByAlpha: true,
			showViewByGroup: false,
		}));
	}
	handleClickViewByGroupButton(e) {
		e.preventDefault();
		this.setState(() => ({
			showViewByAlpha: false,
			showViewByGroup: true,
		}));
	}
	handleFilterTextChange(filterText) {
		// if there's no filterText
		if (!filterText || filterText.length < 2) {
			// set individual and grouped lists of items to render to base individual and grouped lists
			this.setState(() => ({
				collapsible: true,
				listItemsToRenderAlphaArray: this.state.listItemsAlphaArray,
				listItemsToRenderGroupedArray: this.state.listItemsGroupedArray,
			}));
		// if there's filterText
		} else {
			// get list of individual items to render by filtering base individual list
			const newListItemsToRenderAlphaArray = this.state.listItemsAlphaArray
				.filter(this.returnItemIncludesFilterTextCaseInsensitive(filterText));
			// set up container for groups of items to render
			const newlistItemsToRenderGroupedArray = [];
			// for each base group of items
			this.state.listItemsGroupedArray.forEach((groupValue, groupIndex) => {
				// if group name includes filterText
				if (groupValue.name.toLowerCase().includes(filterText.toLowerCase())) {
					// push the group to the groups container
					newlistItemsToRenderGroupedArray.push(groupValue);
				// if group name does not include filterText
				} else {
					// make deep copies of the whole group and of its items
					const groupCopy = JSON.parse(JSON.stringify(groupValue));
					const groupCopyOriginalItems = JSON.parse(JSON.stringify(groupCopy.items));
					// replace the group copy's items with a list of items by filtering the original items
					groupCopy.items =
						groupCopyOriginalItems
							.filter(this.returnItemIncludesFilterTextCaseInsensitive(filterText));
					// if there are still any items in the group
					if (groupCopy.items.length) {
						// push the group, with its filtered list of items, to the groups container
						newlistItemsToRenderGroupedArray.push(groupCopy);
					}
				}
			});
			// set individual and grouped lists of items to render to 
			// 		filtered individual and grouped lists
			this.setState(() => ({
				collapsible: false,
				listItemsToRenderAlphaArray: newListItemsToRenderAlphaArray,
				listItemsToRenderGroupedArray: newlistItemsToRenderGroupedArray,
			}));
		}
	}
	returnGroupNameIncludesFilterTextCaseInsensitive(filterText, groupName) {
		return groupName.toLowerCase().includes(filterText.toLowerCase());
	}
	returnItemIncludesFilterTextCaseInsensitive(filterText) {
		return item => 
			item.anchorText.toLowerCase().includes(filterText.toLowerCase()) || 
			(item.description && item.description.toLowerCase().includes(filterText.toLowerCase()));
	}
	returnHcGetItDoneBody(screenType) {
		// if this user has no roles property, then uData wasn't constructed properly and 
		// 		we won't risk exposing links to them inappropriately
		if (this.props.uData.roles) {
			return (
				<div id="hc-get-it-done-body">
					{/* <div className="section-notice section-notice__neutral">
						<p className="section-notice__text">
							Learn about&nbsp;
							<a 
								target="_blank" 
								rel="noopener noreferrer"
								href="https://bmos.sharepoint.com/SitePages/Get%20it%20Done%20Update,%20April%202019.aspx"
							>
								April 2019 updates to Get it Done
							</a>
							.
						</p>
					</div> */}
					<HcGetItDoneCommandBar
						handleClickViewByGroupButton={this.handleClickViewByGroupButton}
						handleClickViewByAlphaButton={this.handleClickViewByAlphaButton}
						handleFilterTextChange={this.handleFilterTextChange}
						screenType={screenType}
					/>
					{
						this.state.showViewByGroup && !this.state.collapsible &&

						<HcGetItDoneViewByGroup
							listItemsGroupedArray={this.state.listItemsToRenderGroupedArray}
						/>
					}
					{
						this.state.showViewByGroup && this.state.collapsible &&

						<HcGetItDoneViewByGroup
							listItemsGroupedArray={this.state.listItemsGroupedSegmentedArray}
						/>
					}
					{
						this.state.showViewByAlpha &&

						<HcGetItDoneViewByAlpha
							listItemsAlphaArray={this.state.listItemsToRenderAlphaArray}
						/>
					}
				</div>
			);
		}
		return (
			<div id="hc-get-it-done-body" />
		);
	}
	returnPlaceholder(screenType) {
		if (screenType === 'medium') {
			return (
				<div
					className="mos-placeholder-column-container hc-get-it-done-placeholder"
				>
					<RectShape className="mos-placeholder-column hc-get-it-done-placeholder-column" />
					<RectShape className="mos-placeholder-column hc-get-it-done-placeholder-column" />
				</div>
			);
		}
		return (
			<div
				className="mos-placeholder-column-container hc-get-it-done-placeholder"
			>
				<RectShape className="mos-placeholder-column hc-get-it-done-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-get-it-done-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-get-it-done-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-get-it-done-placeholder-column" />
			</div>
		);
	}
	render() {
		if (!this.state.queryError && this.props.screenType === 'small') {
			return (
				<AccordionItem
					id="hc-get-it-done"
					className="hc-get-it-done mos-react-component-root accordion__item"
					hideBodyClassName="accordion__item--hidden"
					name="hc-get-it-done"
				>
					<AccordionItemTitle
						className="hc-get-it-done__title accordion__title accordion__title--animated"
					>
						<h2 className="u-position-relative">
							<div className="accordion__title__text">Get it Done</div>
							<div className="accordion__arrow" role="presentation" />
						</h2>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-get-it-done__body accordion__body"
					>
						{this.returnHcGetItDoneBody(this.props.screenType)}
					</AccordionItemBody>
				</AccordionItem>
			);
		}
		if (
			!this.state.queryError && 
			(this.props.screenType === 'medium' || this.props.screenType === 'large')
		) {
			return (
				<div id="hc-get-it-done" className="mos-react-component-root" name="hc-get-it-done">
					<h2>Get it Done</h2>
					<ReactPlaceholder
						customPlaceholder={this.returnPlaceholder(this.props.screenType)}
						ready={this.state.ready}
						showLoadingAnimation
					>
						{this.returnHcGetItDoneBody(this.props.screenType)}
					</ReactPlaceholder>
				</div>
			);
		}
		return (
			<p id="hc-get-it-done-body">I can&apos;t show you this information right now.</p>
		);
	}
}
