
// ----- IMPORTS

import * as React from 'react';
import {
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';

import './HcCalendarsSchedules.sass';
import './HcCalendarsSchedulesMediumLarge.sass';
import './HcCalendarsSchedulesSmall.sass';

// ----- COMPONENT

export default class HcCalendarsSchedules extends React.Component {
	constructor(props) {
		super(props);
		this.returnCalendarsSchedulesListItems = this.returnCalendarsSchedulesListItems.bind(this);
	}
	returnCalendarsSchedulesListItems() {
		return (
			<ul id="hc-calendars-and-schedules__list-items">
				<li>
					<a href="/sites/mwec/SitePages/Museum-wide%20Event%20Calendar.aspx" target="_blank">
						Museumwide Event Calendar
					</a>
				</li>
				<li>
					<a href="/sites/wpc-cafe/SitePages/Riverview Café.aspx" target="_blank">
						Riverview Caf&eacute;
					</a>
				</li>
				<li>
					<a href="/sites/pt/SitePages/Product%20Timeline.aspx" target="_blank">
						Product Timeline
					</a>
				</li>
			</ul>
		);
	}
	render() {
		if (this.props.screenType === 'small') {
			return (
				<AccordionItem
					id="hc-calendars-and-schedules"
					className="hc-calendars-and-schedules mos-react-component-root accordion__item"
					hideBodyClassName="accordion__item--hidden"
					name="hc-calendars-and-schedules"
				>
					<AccordionItemTitle
						className="hc-calendars-and-schedules__title accordion__title accordion__title--animated"
					>
						<h2 className="u-position-relative">
							<div className="accordion__title__text">Calendars & Schedules</div>
							<div className="accordion__arrow" role="presentation" />
						</h2>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-calendars-and-schedules__body accordion__body"
					>
						{this.returnCalendarsSchedulesListItems()}
					</AccordionItemBody>
				</AccordionItem>
			);
		}
		return (
			<div id="hc-calendars-and-schedules" className="mos-react-component-root" name="hc-calendars-and-schedules">
				<h2>Calendars & Schedules</h2>
				{this.returnCalendarsSchedulesListItems()}
			</div>
		);
	}
}
