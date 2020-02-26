
// ----- IMPORTS

import * as React from 'react';

// ----- COMPONENT

const HcOrganizationTeamsOther = props => (
	<li id={`hc-organization-teams-other-team_${props.teamId}`} className="hc-organization-teams-other-team mos-react-component-root">
		<a
			className="hc-organization-teams-other-team-link"
			href={`https://bmos.sharepoint.com/SitePages/${props.teamContent.pageToken}.aspx`}
			target="_blank"
		>
			{props.teamContent.name}
		</a>
	</li>
); 

export default HcOrganizationTeamsOther;
