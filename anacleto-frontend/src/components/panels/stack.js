import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { classNames } from "primereact/utils";

const Stack = ({children, ...props}) => {
	const [flex, setFlex] = useState(props.flex);
	const [direction, setDirection] = useState(props.direction);
	const [gap, setGap] = useState(props.gap);
	const [grow, setGrow] = useState(props.grow);
	const [className, setClassName] = useState(props.className);

	useEffect(() => {
		setFlex(props.flex);
		setDirection(props.direction);
		setGap(props.gap);
		setGrow(props.grow);
		setClassName(props.className);
	}, [
		props.flex,
		props.direction,
		props.gap,
		props.grow,
		props.className
	]);

	return (
		<div
			className={classNames(
				"anacleto-stack flex",
				(flex ? flex + "-" : ""),
				"flex-" + (direction || "row"),
				gap ? gap : "gap-3",
				{ "flex-grow-1": grow },
				className
			)}
		>
			{ children }
		</div>
	);
}

Stack.propTypes = {
	className: PropTypes.string,
	direction: PropTypes.oneOf(["row", "column"]),
	flex: PropTypes.oneOf(["1", "auto", "initial"]),
	gap: PropTypes.number,
	grow: PropTypes.oneOf(["1", "0"]),
	items: PropTypes.array
};
export default Stack;