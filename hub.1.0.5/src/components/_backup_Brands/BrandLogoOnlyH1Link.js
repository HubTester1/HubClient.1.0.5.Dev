
// ----- IMPORTS

import * as React from 'react';

import BrandLogoOnly from './BrandLogoOnly';

// ----- COMPONENT

const BrandLogoOnlyH1Link = props => (
	<div className="brand">
		<a className="brand__link" href="/">
			<h1 className="brand__link__header">
				<span className="brand__link__header__text">The Hub</span>
				<span className="brand__link__header__image">
					<BrandLogoOnly />
				</span>
			</h1>
		</a>
	</div>
);

export default BrandLogoOnlyH1Link;
