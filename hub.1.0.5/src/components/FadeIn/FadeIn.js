
// --- IMPORTS

import * as React from 'react';
import Transition from 'react-transition-group/Transition';

// --- COMPONENT

const duration = 300;

const defaultStyle = {
	transition: `opacity ${duration}ms ease-in-out, height ${duration}ms ease-in-out`,
	opacity: 0,
	height: '100%',
	display: 'none',
};

const transitionStyles = {
	entering: { opacity: 0, height: 0, display: 'block' },
	entered: { opacity: 1, height: '100%', display: 'block' },
};

export default ({ in: inProp, children }) => (
	<Transition in={inProp} timeout={duration}>
		{state => (
			<div
				aria-hidden={!inProp}
				style={{
					...defaultStyle,
					...transitionStyles[state],
				}}
			>
				{children}
			</div>
		)}
	</Transition>
);

