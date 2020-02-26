
// ----- IMPORTS

import * as React from 'react';
import { animateScroll as scroll } from 'react-scroll';

import BrandHorizontal from './BrandHorizontal';

// ----- COMPONENT

export default class BrandHorizontalH1Link extends React.Component {
	constructor(props) {
		super(props);
		this.scrollToHome = this.scrollToHome.bind(this);
	}
	scrollToHome(e) {
		e.preventDefault();
		scroll.scrollToTop();
	}
	render() {
		return (
			<div className="brand">
				<h1 className="brand__link__header">
					<span className="brand__link__header__text">The Hub</span>
					<button
						className="brand__link__header__image"
						onClick={this.scrollToHome}
					>
						<BrandHorizontal />
					</button>
				</h1>
			</div>
		);
	}
}
