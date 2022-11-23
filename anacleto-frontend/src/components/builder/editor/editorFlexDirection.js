import React from "react";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";

export const FLEX_ROW = 1;
export const FLEX_COLUMN = 2;
export const FLEX_ROW_REVERSE = 3;
export const FLEX_COLUMN_REVERSE = 4;

export const FLEX_DIRECTIONS = {
	[FLEX_ROW]: 			"flex-row",
	[FLEX_COLUMN]: 			"flex-column",
	[FLEX_ROW_REVERSE]: 	"flex-row-reverse",
	[FLEX_COLUMN_REVERSE]: 	"flex-column-reverse",
	"flex-row": 			FLEX_ROW,
	"flex-column": 			FLEX_COLUMN,
	"flex-row-reverse": 	FLEX_ROW_REVERSE,
	"flex-column-reverse": 	FLEX_COLUMN_REVERSE,
}
const EditorFlexDirection = (props) => {
	const handleClick = (direction) => {
		props.onChange(direction);
	}

	return <div className="flex flex-column xl:flex-row mx-auto gap-2 md:gap-4">
		{
			[FLEX_ROW, FLEX_COLUMN, FLEX_ROW_REVERSE, FLEX_COLUMN_REVERSE].map((fd) => (
				<div key={fd} className="flex flex-column flex-wrap justify-content-between align-items-center cursor-pointer gap-4" onClick={() => handleClick(fd)}>
					<div className={classNames("flex gap-1 my-auto", FLEX_DIRECTIONS[fd])}>
						<Skeleton
							className={classNames("flex justify-content-center align-items-center p-2 transition-all", {"bg-primary": props.flexDirection === fd})}
							animation="none"
							width={fd % 2 !== 0 ? "2rem" : "4rem"}
							height={fd % 2 !== 0 ? "4rem" : "2rem"}
						>
							<span className={classNames("texl-xl font-bold transition-all", {"text-white": props.flexDirection === fd})}>1</span>
						</Skeleton>
						<Skeleton
							className={classNames("flex justify-content-center align-items-center p-2 transition-all", {"bg-primary": props.flexDirection === fd})}
							animation="none"
							width={fd % 2 !== 0 ? "2rem" : "4rem"}
							height={fd % 2 !== 0 ? "4rem" : "2rem"}
						>
							<span className={classNames("texl-xl font-bold transition-all", {"text-white": props.flexDirection === fd})}>2</span>
						</Skeleton>
						<Skeleton
							className={classNames("flex justify-content-center align-items-center p-2 transition-all", {"bg-primary": props.flexDirection === fd})}
							animation="none"
							width={fd % 2 !== 0 ? "2rem" : "4rem"}
							height={fd % 2 !== 0 ? "4rem" : "2rem"}
						>
							<span className={classNames("texl-xl font-bold transition-all", {"text-white": props.flexDirection === fd})}>3</span>
						</Skeleton>
					</div>
					<span className="font-bold text-center">{FLEX_DIRECTIONS[fd].split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" ")}</span>
				</div>
			))
		}
	</div>
}
export default EditorFlexDirection;