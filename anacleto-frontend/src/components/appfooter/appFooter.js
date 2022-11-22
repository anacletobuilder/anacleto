import React from 'react';
import Logo from '../../img/anacleto.png';

export const AppFooter = (props) => {
	
	return (
		<div className="py-1 flex align-items-center justify-content-center">
			<img src={props.metadata && props.metadata.appLogo ? process.env.PUBLIC_URL + props.metadata.appLogo : Logo } alt="Logo" height="20" className="mr-2" />
			<span className="p-component text-600 font-medium line-height-3 ml-2">{props.metadata ? props.metadata.name || props.metadata.application : "Anacleto"}</span>
		</div>
	);
}