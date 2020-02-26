
// ----- IMPORTS

import * as React from 'react';
import ReactPlaceholder from 'react-placeholder';
import {
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';

import HcOrganizationData from './HcOrganizationData';
import HcOrganizationCommandBar from './components/HcOrganizationCommandBar/HcOrganizationCommandBar';
import HcOrganizationTeams from './components/HcOrganizationTeams/HcOrganizationTeams';
import HcStaffLookup from '../HcStaffLookup/HcStaffLookup';
import HcOrganizationOtherContacts from './components/HcOrganizationOtherContacts/HcOrganizationOtherContacts';
import HcOrganizationMission from './components/HcOrganizationMission/HcOrganizationMission';

import './HcOrganization.sass';
import './HcOrganizationMediumLarge.sass';
import './HcOrganizationSmall.sass';

// ----- COMPONENT

export default class HcOrganization extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showTeams: true,
			showStaffLookup: false,
			showOtherContacts: false,
			showMission: false,
			divDeptWTeamsArray: [],
			nonDivDeptTeamsArray: [],
			otherContactsArray: [],
			queryError: false,
			ready: false,
		};
		this.handleClickShowTeams = this.handleClickShowTeams.bind(this);
		this.handleClickShowStaffLookup = this.handleClickShowStaffLookup.bind(this);
		this.handleClickOtherContacts = this.handleClickOtherContacts.bind(this);
		this.handleClickShowMission = this.handleClickShowMission.bind(this);
		this.returnHcOrganizationBody = this.returnHcOrganizationBody.bind(this);
	}
	componentDidMount() {
		HcOrganizationData.ReturnAllOrganizationData()
			.then((allOrganizationData) => {
				this.setState(() => ({
					divDeptWTeamsArray: allOrganizationData.divDeptWTeams,
					nonDivDeptTeamsArray: allOrganizationData.nonDivDeptTeams,
					otherContactsArray: allOrganizationData.otherContacts,
					ready: true,
				}));
			})
			.catch((error) => {
				this.setState(() => ({
					queryError: true,
					ready: true,
				}));
			});
	}
	handleClickShowTeams(e) {
		e.preventDefault();
		this.setState(() => ({
			showTeams: true,
			showStaffLookup: false,
			showOtherContacts: false,
			showMission: false,
		}));
	}
	handleClickShowStaffLookup(e) {
		e.preventDefault();
		this.setState(() => ({
			showTeams: false,
			showStaffLookup: true,
			showOtherContacts: false,
			showMission: false,
		}));
	}
	handleClickOtherContacts(e) {
		e.preventDefault();
		this.setState(() => ({
			showTeams: false,
			showStaffLookup: false,
			showOtherContacts: true,
			showMission: false,
		}));
	}
	handleClickShowMission(e) {
		e.preventDefault();
		this.setState(() => ({
			showTeams: false,
			showStaffLookup: false,
			showOtherContacts: false,
			showMission: true,
		}));
	}
	returnHcOrganizationBody() {
		return (
			<div id="hc-organization-body">
				<HcOrganizationCommandBar
					handleClickShowTeams={this.handleClickShowTeams}
					handleClickShowStaffLookup={this.handleClickShowStaffLookup}
					handleClickOtherContacts={this.handleClickOtherContacts}
					handleClickShowMission={this.handleClickShowMission}
					screenType={this.props.screenType}
				/>
				{
					this.state.showTeams &&

					<HcOrganizationTeams
						divDeptWTeamsArray={this.state.divDeptWTeamsArray}
						nonDivDeptTeamsArray={this.state.nonDivDeptTeamsArray}
						screenType={this.props.screenType}
					/>
				}
				{
					this.state.showStaffLookup &&

					<HcStaffLookup 
						inHcOrganization
					/>
				}
				{
					this.state.showOtherContacts &&

					<HcOrganizationOtherContacts
						otherContactsArray={this.state.otherContactsArray}
					/>
				}
				{
					this.state.showMission &&

					<HcOrganizationMission />
				}
			</div>
		);
	}
	returnPlaceholder() {
		return (
			<div
				className="mos-placeholder-rectangle-container hc-organization-placeholder"
			>
				<div
					className="mos-placeholder-rectangle hc-organization-placeholder-rectangle__teams--divs-depts"
				>
					<div
						className="mos-placeholder-rectangle hc-organization-placeholder-rectangle__filler"
					/>
				</div>
				<div 
					className="mos-placeholder-rectangle hc-organization-placeholder-rectangle__teams--other-teams"
				>
					<div
						className="mos-placeholder-rectangle hc-organization-placeholder-rectangle__filler"
					/>
				</div>
			</div>
		);
	}
	render() {
		if (this.props.screenType === 'small') {
			return (
				<AccordionItem
					id="hc-organization"
					className="hc-organization mos-react-component-root accordion__item"
					hideBodyClassName="accordion__item--hidden"
					name="hc-organization"
				>
					<AccordionItemTitle
						className="hc-organization__title accordion__title accordion__title--animated"
					>
						<h2 className="u-position-relative">
							<div className="accordion__title__text">Organization, Teams, & Staff</div>
							<div className="accordion__arrow" role="presentation" />
						</h2>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-organization__body accordion__body"
					>
						{this.returnHcOrganizationBody()}
					</AccordionItemBody>
				</AccordionItem>
			);
		}
		return (
			<div id="hc-organization" className="mos-react-component-root" name="hc-organization">
				<h2>Organization, Teams, & Staff</h2>
				<ReactPlaceholder
					customPlaceholder={this.returnPlaceholder()}
					ready={this.state.ready}
					showLoadingAnimation
				>
					{
						!this.state.queryError &&

						this.returnHcOrganizationBody()
					}
					{
						this.state.queryError &&

						<p id="hc-organization-body">I can&apos;t show you this information right now.</p>
					}
				</ReactPlaceholder>
			</div>
		);
	}
}
