
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
import HcOrganizationTeamsDepartmentMember from '../HcOrganizationTeamsDepartmentMember/HcOrganizationTeamsDepartmentMember';

// ----- COMPONENT

export default class HcOrganizationTeamsDepartment extends React.Component {
	render() {
		return (
			<AccordionItem
				className="hc-organization__teams__department mos-react-component-root accordion__item"
				hideBodyClassName="accordion__item--hidden"
			>
				<li id={`hc-organization__teams__department_${this.props.departmentId}`}>
					<AccordionItemTitle
						className="hc-organization__teams__department-title accordion__title accordion__title--animated"
					>
						<h5 className="u-position-relative">
							<div className="accordion__title__text">{this.props.departmentContent.name}</div>
							<div className="accordion__arrow" role="presentation" />
						</h5>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-organization__teams__department-body accordion__body"
					>
						{
							this.props.departmentContent.orgChart &&

							<p>
								<a
									href={this.props.departmentContent.orgChart}
									target="_blank"
									className="hc-organization__teams__department-org-chart-link org-chart-link"
								>
									Organization Chart
								</a>
							</p>
						}
						{
							this.props.departmentContent.hubScreenToken &&

							<p>
								<a
									href={`https://bmos.sharepoint.com/SitePages/${this.props.departmentContent.hubScreenToken}.aspx`}
									target="_blank"
									className="hc-organization-teams-department-hub-team-link hub-team-link"
								>
									On The Hub
								</a>
							</p>
						}
						<Accordion
							className="hc-organization__teams__department-members accordion"
							accordion={false}
						>
							<ul>
								{
									this.props.departmentContent.members.map(memberValue => (
										<HcOrganizationTeamsDepartmentMember
											key={memberValue.reactKey}
											memberId={memberValue.reactKey}
											memberContent={memberValue}
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
