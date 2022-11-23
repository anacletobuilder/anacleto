import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
function ErrorPage(props) {
	const navigate = useNavigate();

	function goBack() {
		navigate(-1);
		window.location.reload(false);
	}
	function goHome() {
		navigate("/home");
		window.location.reload(false);
	}

	/*
    <button aria-label="Go Back" className="p-button p-component p-button-text mr-2" onClick={goBack}>
        <span className="p-button-icon p-c p-button-icon-left pi pi-arrow-left"></span>
        <span className="p-button-label p-c">Go Back</span>
        <span role="presentation" className="p-ink">
        </span>
    </button>
    */

	return (
		<div className="flex flex-column surface-section px-4 py-6 md:px-6 h-full w-full">
			<div
				className="text-center"
				style={{
					background:
						"radial-gradient(50% 109138% at 50% 50%, rgba(233, 30, 99, 0.1) 0%, rgba(254, 244, 247, 0) 100%)",
				}}
			>
				<span className="p-component bg-white text-pink-500 font-bold text-2xl inline-block px-3">
					{props.code || "404"}
				</span>
			</div>
			<div className="p-component mt-6 mb-5 font-bold text-6xl text-900 text-center">
				{props.title}
			</div>
			<div className="flex flex-auto p-component text-700 text-3xl mt-0 mb-6 text-center">
				{props.message}
			</div>
			{props.showHomeButton !== false && <div className="text-center">
				<button
					aria-label="Go to Home"
					className="p-button p-component"
					onClick={goHome}
				>
					<span className="p-button-icon p-c p-button-icon-left pi pi-home"></span>
					<span className="p-button-label p-c">Go to Home</span>
					<span role="presentation" className="p-ink"></span>
				</button>
			</div>}
		</div>
	);
}
ErrorPage.propTypes = {
	code: PropTypes.string,
	title: PropTypes.string,
	message: PropTypes.any,
}
export default ErrorPage;
