
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
import HcOrganizationTeamsMemberPersonaCard from '../HcOrganizationTeamsMemberPersonaCard/HcOrganizationTeamsMemberPersonaCard';

// ----- COMPONENT
export default class HcOrganizationTeamsDepartmentMember extends React.Component {
	render() {
		return (
			<AccordionItem
				className="hc-organization__teams__department-member mos-react-component-root accordion__item"
				hideBodyClassName="accordion__item--hidden"
			>
				<li id={`hc-organization__teams__department-member_${this.props.memberId}`}>
					<AccordionItemTitle
						className="hc-organization__teams__department-member-title accordion__title accordion__title--animated"
					>
						<h6 className="u-position-relative">
							<div className="accordion__title__text">{this.props.memberContent.displayName}</div>
							<div className="accordion__arrow" role="presentation" />
						</h6>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-organization__teams__department-member-body accordion__body"
					>
						<HcOrganizationTeamsMemberPersonaCard
							memberAccount={this.props.memberContent.account}
							memberContent={this.props.memberContent}
							personas={this.props.personas}
						/>
					</AccordionItemBody>
				</li>
			</AccordionItem>
		);
	}
}
