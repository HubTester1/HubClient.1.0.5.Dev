
// ----- IMPORTS

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MediaQuery from 'react-responsive';
import { Accordion } from 'react-accessible-accordion';

import EnvironmentDetector from '../../services/EnvironmentDetector';
import MOSUtilities from '../../services/MOSUtilities';
import ScreenSizes from '../../services/ScreenSizes';
import HCContext from '../../services/HcContext';

import HcHeader from '../../components/HcHeader/HcHeader';
import HcHero from '../../components/HcHero/HcHero';
import HcGetItDone from '../../components/HcGetItDone/HcGetItDone';
import HcPushedItems from '../../components/HcPushedItems/HcPushedItems';
import HcMessages from '../../components/HcMessages/HcMessages';
import HcOrganization from '../../components/HcOrganization/HcOrganization';

// eslint-disable-next-line
import { initializeIcons } from '@uifabric/icons';

import './HcContainer.sass';

initializeIcons();

class HcContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSmallNav: false,
			apiIsAvailable: undefined,
			maintenanceModeThisUser: undefined,
			uData: {},
			contextReady: false,
		};
		this.handleHamburgerOrNavItemClick = this.handleHamburgerOrNavItemClick.bind(this);
	}
	componentDidMount() {
		HCContext.ReturnHCContext()
			.then((response) => {
				this.setState(() => ({
					uData: response.uData,
					apiIsAvailable: response.apiIsAvailable,
					maintenanceModeThisUser: response.maintenanceModeThisUser,
					contextReady: true,
				}));
				window.uData = response.uData;
				window.apiIsAvailable = response.apiIsAvailable;
				window.maintenanceModeThisUser = response.maintenanceModeThisUser;
				window.contextReady = true;
			})
			.catch((error) => {
				this.setState(() => ({
					uData: error.uData,
					apiIsAvailable: error.apiIsAvailable,
					maintenanceModeThisUser: error.maintenanceModeThisUser,
					contextReady: true,
				}));
				window.uData = error.uData;
				window.apiIsAvailable = error.apiIsAvailable;
				window.maintenanceModeThisUser = error.maintenanceModeThisUser;
				window.contextReady = true;
			});
	}
	handleHamburgerOrNavItemClick() {
		document.body.classList.toggle('showing-small-nav', !this.state.showSmallNav);
		this.setState(prevState => ({
			showSmallNav: !prevState.showSmallNav,
		}));
	}
	render() {
		if (
			this.state.contextReady &&
			this.state.apiIsAvailable &&
			!this.state.maintenanceModeThisUser
		) {
			document.body.classList.add('contains-hub-central');
			return (
				<div
					id="hc-container"
					className={`mos-react-component-root${this.state.showSmallNav ? ' showing-small-nav' : ''}`}
				>
					{/* <div
						id="hc-header-and-hero-container"
						className="hc-header-and-hero-container"
					>
						<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
							<HcHeader
								screenType="small"
								handleHamburgerOrNavItemClick={this.handleHamburgerOrNavItemClick}
							/>
							<HcHero
								screenType="small"
							/>
						</MediaQuery>
						<MediaQuery
							minWidth={ScreenSizes.ReturnMediumMin()}
							maxWidth={ScreenSizes.ReturnMediumMax()}
						>
							<HcHeader
								screenType="medium"
							/>
							<HcHero
								screenType="medium"
								uData={this.state.uData}
							/>
						</MediaQuery>
						<MediaQuery minWidth={ScreenSizes.ReturnLargeMin()}>
							<HcHeader
								screenType="large"
							/>
							<HcHero
								screenType="large"
								uData={this.state.uData}
							/>
						</MediaQuery>
					</div> */}


					<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
						<Accordion
							className="hc-sections-container accordion"
							accordion={false}
							role="tablist"
						>
							{/* <HcPushedItems
								screenType="small"
							/>
							<HcGetItDone
								screenType="small"
								uData={this.state.uData}
							/>
							<HcOrganization
								screenType="small"
							/> */}
							<HcMessages
								uData={this.state.uData}
								allOrTop="all"
								screenType="small"
							/>
						</Accordion>
					</MediaQuery>
					<MediaQuery
						minWidth={ScreenSizes.ReturnMediumMin()}
						maxWidth={ScreenSizes.ReturnMediumMax()}
					>
						{/* <HcPushedItems
							screenType="medium"
						/>
						<HcGetItDone
							screenType="medium"
							uData={this.state.uData}
						/>
						<HcOrganization
							screenType="medium"
						/> */}
						<HcMessages
							uData={this.state.uData}
							allOrTop="all"
							screenType="medium"
						/>
					</MediaQuery>
					<MediaQuery minWidth={ScreenSizes.ReturnLargeMin()}>
						{/* <HcPushedItems
							screenType="large"
						/>
						<HcGetItDone
							screenType="large"
							uData={this.state.uData}
						/>
						<HcOrganization
							screenType="large"
						/> */}
						<HcMessages
							uData={this.state.uData}
							allOrTop="all"
							screenType="large"
						/>
					</MediaQuery>
					<footer>
						&copy; {MOSUtilities.ReturnFormattedDateTime({ incomingDateTimeString: 'nowLocal', incomingReturnFormat: 'YYYY' })} Museum of Science
					</footer>
				</div>
			);
		}
		return (<div />);
	}
}

// eslint-disable-next-line no-console
console.log('hc m2');
const screenShower = setInterval(ShowScreen, 500);
if (EnvironmentDetector.ReturnIsHCScreen()) {
	document.querySelector('head title').textContent = 'The Hub - Home';
	ReactDOM.render(<HcContainer />, document.getElementById('hub-central-mount-point'));
} else {
	window.uData = {};
	window.apiIsAvailable = undefined;
	window.maintenanceModeThisUser = undefined;
	window.contextReady = false;

	HCContext.ReturnHCContext()
		.then((response) => {
			window.uData = response.uData;
			window.apiIsAvailable = response.apiIsAvailable;
			window.maintenanceModeThisUser = response.maintenanceModeThisUser;
			window.contextReady = true;
		})
		.catch((error) => {
			window.uData = error.uData;
			window.apiIsAvailable = error.apiIsAvailable;
			window.maintenanceModeThisUser = error.maintenanceModeThisUser;
			window.contextReady = true;
		});
}
function ConfigAndShowNesoUnavailableScreen() {
	document.getElementById('overlays-screen-container').className = 'screen-container visible';
	document.getElementById('neso-is-unavailable').className = 'overlay-screen visible';
	document.getElementsByTagName('body')[0].classList.add('neso-is-unavailable');
}
function ShowMaintenanceModeScreen() {
	document.getElementById('overlays-screen-container').className = 'screen-container visible';
	document.getElementById('maintenance-mode').className = 'overlay-screen visible';
	document.getElementsByTagName('body')[0].classList.add('is-in-maintenance-mode');
}

function ShowScreen() {
	// if the context data has loaded
	if (window.contextReady) {
		// if neso is not available
		if (!window.apiIsAvailable) {
			ConfigAndShowNesoUnavailableScreen();
			// if component is in maintenance mode
		} else if (window.maintenanceModeThisUser) {
			ShowMaintenanceModeScreen();
		} else {
			// config screen
			document.getElementsByClassName('ms-siteicon-img')[0]
				.setAttribute('src', '/sites/hubprod/Asset%20Library/BrandHorizontal.svg');
			document.getElementsByClassName('ms-breadcrumb-top')[0].remove();
			if (window.uData.account && window.uData.account === 'jbaker') {
				document.getElementById('s4-ribbonrow').style.display = 'block';
				document.getElementById('s4-bodyContainer').style.paddingTop = '1rem';
			}
			if (window.uData.account && (window.uData.account === 'showe' || window.uData.account === 'shudson')) {
				// /sites/-dev-hc/Lists/Acc
				const ribbonForStan =
					document.querySelector('form[action^="/Lists/Accounting%20Whats%20New%20Hub"] div#s4-ribbonrow');
				if (ribbonForStan) {
					ribbonForStan.style.display = 'block';
				}
			}
			if (window.uData.account && (window.uData.account === 'acurtis')) {
				// /SitePages/VPN%20Remote%20Access%20Policy.aspx
				const ribbonForAllie =
					document.querySelector('form[action^="/SitePages/VPN%20Remote%20Access%20Policy.aspx"] div#s4-ribbonrow');
				if (ribbonForAllie) {
					ribbonForAllie.style.display = 'block';
				}
			}

			// hide loading and show other
			document.getElementById('overlays-screen-container').style.display = 'none';
			document.getElementById('s4-bodyContainer').className = 'visible';
			document.getElementById('hub-central-mount-point').className = 'visible';
		}
		// hide the loading screen
		document.getElementById('loading-screen').className = 'hidden';
		// don't keep executing this function
		clearInterval(screenShower);
	}
}


// TO DO - remove
(function RegisterJQueryPlugin($) {
	$.fn.RenderInPagePersonaSet = function (personaData) {
		let personaSet = '<div class="in-page-personas';

		if (typeof (personaData.classValues) !== 'undefined' && personaData.classValues != null) {
			personaSet += ` ${personaData.classValues}`;
		}

		personaSet += '">\n';

		if (typeof (personaData.title) !== 'undefined' && personaData.title != null) {
			personaSet += `<${personaData.title.tag}>${personaData.title.content}</${personaData.title.tag}>\n`;
		}

		$.each(personaData.people, (i, accountPart) => {
			personaSet += '<div class="in-page-persona">\n';

			const userProfileValues = {};

			$().SPServices({
				operation: 'GetUserProfileByName',
				async: false,
				AccountName: `i:0#.f|membership|${accountPart}@mos.org`,
				completefunc(xData, Status) {
					$(xData.responseXML).SPFilterNode('PropertyData').each(function () {
						userProfileValues[$(this).find('Name').text()] = $(this).find('Value').text();
					});
				},
			});

			personaSet += '	<span class="avatar-container"><span class="avatar"';
			if (userProfileValues.PictureURL !== '') {
				personaSet += ` style="background: #fff url('${userProfileValues.PictureURL}') no-repeat center center;background-size: cover"> \n`;
			} else {
				userProfileValues.firstInitial = userProfileValues.FirstName.slice(0, 1).toUpperCase();
				userProfileValues.lastInitial = userProfileValues.LastName.slice(0, 1).toUpperCase();
				personaSet += `><span class="avatar-initials">${userProfileValues.firstInitial}${userProfileValues.lastInitial}</span>`;
			}

			personaSet += '</span></span> \n' +
				'	<span class="name_title"> \n';
			if (typeof (userProfileValues.PreferredName) !== 'undefined' && userProfileValues.PreferredName !== '') {
				if (typeof (userProfileValues['SPS-PersonalSiteCapabilities']) !== 'undefined' && userProfileValues['SPS-PersonalSiteCapabilities'] !== '') {
					personaSet += `		<a class="profile" href="https://bmos-my.sharepoint.com/_layouts/15/me.aspx?u=${userProfileValues['msOnline-ObjectId']}" target="_blank">${userProfileValues.PreferredName}</a> \n`;
				} else {
					personaSet += `		<span class="name">${userProfileValues.PreferredName}</span> \n`;
				}
			}

			if (typeof (userProfileValues.Title) !== 'undefined' && userProfileValues.Title !== '') {
				personaSet += `		<span class="title">${userProfileValues.Title}</span> \n`;
			}

			personaSet += '	</span> \n' +
				'</div>\n';
		});

		personaSet += '</div>';

		$(`div#${personaData.destinationID}`).append(personaSet);
	};
}(jQuery));
