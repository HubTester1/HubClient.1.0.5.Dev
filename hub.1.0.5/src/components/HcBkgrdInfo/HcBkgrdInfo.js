
// ----- IMPORTS

import * as React from 'react';
import Collapsible from '../Collapsible/Collapsible';

// ----- COMPONENT

export default props => (
	<div id="hc-background-info-container">
		<div id="hc-background-info">
			<Collapsible
				textCollapsed="About this background image"
				textExpanded="Hide info about this image"
				buttonClassName="hc-background-info__button"
				buttonPosition="afterContent"
			>
				<div id="hc-background-info__information">
					<h3>
						<a
							id="photo-source-link"
							href="https://unsplash.com/photos/LtnPejWDSAY"
							target="_blank"
							rel="noopener noreferrer"
						>
							Photo
						</a>
						&nbsp;by&nbsp;
						<a
							id="photographer-link"
							href="https://unsplash.com/@lightscape"
							target="_blank"
							rel="noopener noreferrer"
						>
							Lightscape
						</a>
					</h3>
					<p>
						&quot;Amazing light display from Mother Nature, very humbled and in awe to capture a multi-hued color Aurora at Tromso, Norway.&quot;
					</p>
				</div>
			</Collapsible>
		</div>
	</div>
);
