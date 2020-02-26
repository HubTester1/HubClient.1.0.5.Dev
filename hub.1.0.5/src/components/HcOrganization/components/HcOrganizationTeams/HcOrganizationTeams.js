
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */

// ----- IMPORTS

import * as React from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';

import HcOrganizationTeamsDivision from '../HcOrganizationTeamsDivision/HcOrganizationTeamsDivision';
import HcOrganizationTeamsOtherTeam from '../HcOrganizationTeamsOtherTeam/HcOrganizationTeamsOtherTeam';

// ----- COMPONENT

export default class HcOrganizationTeams extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (this.props.screenType === 'small') {
			return (
				<div id="hc-organization__teams" className="mos-react-component-root">
					<AccordionItem
						id="hc-organization__teams--divs-depts"
						className="hc-organization__teams--divs-depts accordion__item"
						hideBodyClassName="accordion__item--hidden"
					>
						<AccordionItemTitle
							className="hc-organization__teams--divs-depts__title accordion__title accordion__title--animated"
						>
							<h3 className="u-position-relative">
								<div className="accordion__title__text">Divisions, Departments, and Their Members</div>
								<div className="accordion__arrow" role="presentation" />
							</h3>
						</AccordionItemTitle>
						<AccordionItemBody
							className="hc-organization__body accordion__body"
						>
							<Accordion
								className="hc-organization__teams__divisions accordion"
								accordion={false}
							>
								<ul>
									{
										this.props.divDeptWTeamsArray.map(divisionValue => (
											<HcOrganizationTeamsDivision
												key={divisionValue.reactKey}
												divisionId={divisionValue.reactKey}
												divisionContent={divisionValue}
											/>
										))
									}

								</ul>
							</Accordion>
						</AccordionItemBody>
					</AccordionItem>
					<AccordionItem
						id="hc-organization__teams--other-teams"
						className="hc-organization__teams--other-teams accordion__item"
						hideBodyClassName="accordion__item--hidden"
					>
						<AccordionItemTitle
							className="hc-organization__teams--other-teams__title accordion__title accordion__title--animated"
						>
							<h3 className="u-position-relative">
								<div className="accordion__title__text">Other Teams</div>
								<div className="accordion__arrow" role="presentation" />
							</h3>
						</AccordionItemTitle>
						<AccordionItemBody
							className="hc-organization__body accordion__body"
						>
							<ul>
								{
									this.props.nonDivDeptTeamsArray.map(teamValue => (
										<HcOrganizationTeamsOtherTeam
											key={teamValue.reactKey}
											teamId={teamValue.reactKey}
											teamContent={teamValue}
										/>
									))
								}
							</ul>
						</AccordionItemBody>
					</AccordionItem>
				</div>
			);
		}
		return (
			<div id="hc-organization__teams" className="mos-react-component-root">
				<div id="hc-organization__teams--divs-depts">
					<h3>Divisions, Departments, and Their Members</h3>
					<Accordion
						className="hc-organization__teams__divisions accordion"
						accordion={false}
					>
						<ul>
							{
								this.props.divDeptWTeamsArray.map(divisionValue => (
									<HcOrganizationTeamsDivision
										key={divisionValue.reactKey}
										divisionId={divisionValue.reactKey}
										divisionContent={divisionValue}
									/>
								))
							}
					
						</ul>
					</Accordion>
				</div>
				<div id="hc-organization__teams--other-teams">
					<h3>Other Teams</h3>
					<ul>
						{
							this.props.nonDivDeptTeamsArray.map(teamValue => (
								<HcOrganizationTeamsOtherTeam
									key={teamValue.reactKey}
									teamId={teamValue.reactKey}
									teamContent={teamValue}
								/>
							))
						}
					</ul>
				</div>
			</div>
		);
	}
}
