
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
import HcOrganizationTeamsDepartment from '../HcOrganizationTeamsDepartment/HcOrganizationTeamsDepartment';

// ----- COMPONENT

export default class HcOrganizationTeamsDivision extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<AccordionItem
				className="hc-organization__teams__division mos-react-component-root accordion__item"
				hideBodyClassName="accordion__item--hidden"
			>
				<li 
					id={`hc-organization__teams__division_${this.props.divisionId}`} 
				>
					<AccordionItemTitle
						className="hc-organization__teams__division-title accordion__title accordion__title--animated"
					>
						<h4 className="u-position-relative">
							<div className="accordion__title__text">{this.props.divisionContent.name}</div>
							<div className="accordion__arrow" role="presentation" />
						</h4>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-organization__teams__division-body accordion__body"
					>
						{
							this.props.divisionContent.orgChart &&

							<p>
								<a
									href={this.props.divisionContent.orgChart}
									target="_blank"
									className="hc-organization-teams-division-org-chart-link org-chart-link"
								>
									Organization Chart
								</a>
							</p>
						}
						{
							this.props.divisionContent.hubScreenToken && 

							<p>
								<a
									href={`https://bmos.sharepoint.com/SitePages/${this.props.divisionContent.hubScreenToken}.aspx`}
									target="_blank"
									className="hc-organization-teams-division-hub-team-link hub-team-link"
								>
									On The Hub
								</a>
							</p>
						}
						<Accordion
							className="hc-organization__teams__departments accordion"
							accordion={false}
						>
							<ul>
								{
									this.props.divisionContent.depts.map(departmentValue => (
										<HcOrganizationTeamsDepartment
											key={departmentValue.reactKey}
											departmentId={departmentValue.reactKey}
											departmentContent={departmentValue}
										/>
									))
								}
							</ul>
						</Accordion>
					</AccordionItemBody>
				</li>
			</AccordionItem>
		);
	}
}
