
// ----- IMPORTS

import * as React from 'react';
import HcStaffLookupData from './HcStaffLookupData';
import HcStaffLookupPicker from './components/HcStaffLookupPicker/HcStaffLookupPicker';
import HcStaffLookupPersonaCard from './components/HcStaffLookupPersonaCard/HcStaffLookupPersonaCard';
import MOSUtilities from '../../services/MOSUtilities';

import './HcStaffLookup.sass';
import './HcStaffLookupSmall.sass';
import './HcStaffLookupMediumLarge.sass';

// ----- COMPONENT

export default class HcStaffLookup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			personas: [],
		};
		this.setSelectedPersonasFromPeoplePickerData = 
			this.setSelectedPersonasFromPeoplePickerData.bind(this);
	}
	setSelectedPersonasFromPeoplePickerData(peoplePickerData) {
		// if there's at least one person in peoplePickerData
		if (peoplePickerData[0]) {
			// get a promise to get data for last person in peoplePickerData
			HcStaffLookupData.ReturnPersonaDataUsingPeoplePickerData(peoplePickerData)
			// if the promise is resolved
				.then((newPersonaData) => {
					// determine whether or not this new person's data is already in state personas
					let thisPersonaAlreadyInPersonas = false;
					this.state.personas.forEach((personaValue) => {
						if (personaValue.account === newPersonaData.account) {
							thisPersonaAlreadyInPersonas = true;
						}
					});
					// collect all known personas, including 
					// 		the new person's, if it isn't already in state personas
					const allKnownPersonas = !thisPersonaAlreadyInPersonas ?
						[newPersonaData, ...this.state.personas] :
						this.state.personas;
						// ensure that anyone deleted from the people picker doesn't
						// 		still show up in state personas array
						// set up container for all desired personas
					const allDesiredPersonas = [];
					// for each person in peoplePickerData
					peoplePickerData.forEach((pickedPerson) => {
						// extract the person's account
						const pickedPersonAccount = MOSUtilities.ReplaceAll('@mos.org', '', pickedPerson._user.Key
							.substr(pickedPerson._user.Key.lastIndexOf('|') + 1));
							// for each person in allKnownPersonas
						allKnownPersonas.forEach((knownPersona) => {
							// if this persona's account matches the picked person's account
							if (pickedPersonAccount === knownPersona.account) {
								// add this persona to allDesiredPersonas
								allDesiredPersonas.unshift(knownPersona);
							}
						});
					});
					this.setState(prevState => ({
						personas: allDesiredPersonas,
					}));
				});
		} else {
			this.setState(prevState => ({
				personas: [],
			}));
		}
	}
	render() {
		return (
			<div id="hc-staff-lookup" className="mos-react-component-root">
				{
					this.props.inHcHero &&

					<h2>Person Lookup</h2>
				}
				{
					this.props.inHcOrganization &&

					<h3>Person Lookup</h3>
				}
				<div id="hc-staff-lookup__picker-and-personas">
					<div id="picker">
						<HcStaffLookupPicker
							peopleOptions={this.state.peopleOptions}
							setSelectedPersonasFromPeoplePickerData={this.setSelectedPersonasFromPeoplePickerData}
							principalTypeUser
						/>
					</div>
					{
						this.state.personas[0] &&

						<div className="persona-cards">
							<h3 className="persona-cards__header">Staff Lookup Results</h3>
							<ul className="persona-cards__list">
								{
									this.state.personas[0] &&
									this.state.personas.map(personaValue => (
										<HcStaffLookupPersonaCard
											key={personaValue.key}
											personaId={personaValue.key}
											personaContent={personaValue}
										/>
									))
								}
							</ul>
						</div>
					}
				</div>
			</div>
		);
	}
}
