
// ----- IMPORTS

import * as React from 'react';

import './Hamburger.sass';

// ----- COMPONENT

const Hamburger = props => (
	<div className="hamburger">
		<button
			className="hamburger__button"
			type="button"
			onClick={props.handleHamburgerOrNavItemClick}
		>
			<span className="hamburger__lines">
				<span className="hamburger__lines__contents" />
			</span>
		</button>
	</div>
);


export default Hamburger;
