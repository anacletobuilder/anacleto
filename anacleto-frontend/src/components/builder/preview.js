import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MemoComponent from "../component";
import PropTypes from "prop-types";
import { PanelsContext, PANEL_STATUS_READY } from "../../contexts/panelsContext";
import { defaultMemoizeFunction } from "../../utils/utils";
import { classNames } from "primereact/utils";

const Preview = ({ id, context, panelContext, windowData, ...props }) => {
	const { updatePanelContext } = useContext(PanelsContext);
	const [contentRef, setContentRef] = useState(null);
	const mountNode = contentRef?.contentWindow?.document?.body;

	useEffect(() => {
		if(contentRef){
			if(!contentRef.contentDocument?.head) return;
			var iframeHead = contentRef.contentDocument.head;
			iframeHead.innerHTML = "";
			Array.from(contentRef.parentElement.ownerDocument.head.querySelectorAll('style')).map((s) => {
				iframeHead.appendChild(s.cloneNode(true));
			});

			contentRef.contentDocument.body.classList.add("p-4")
			contentRef.contentDocument.body.onresize = () => {
				let body = contentRef.contentDocument.body;
				let w = body.clientWidth;
				let breakpoint = (w < 768) ? 'xs' : ((w < 992) ? 'sm' : ((w < 1200) ? 'md' : 'lg'));
				body.querySelector("#previewWindowDimensions").innerHTML = `${body.clientWidth}px x ${body.clientHeight}px<br />Screen size: <b>${breakpoint}</b>`;
				
				contentRef.classList.add("pointer-events-none");
				clearTimeout(contentRef.contentDocument.resizeTimeout);
				contentRef.contentDocument.resizeTimeout = setTimeout(() => {
					contentRef.classList.remove("pointer-events-none");
				}, 500);
			}
			contentRef.contentDocument.body.onresize();
		}
	}, [contentRef]);
	
	const _setPreviewItems = (_items) => {
		let purgedItems = purgeOnClickEvent(_items);
		setPreviewItems((prev) => {
			return [
				...prev,
				...purgedItems
			]
		});
	}
	useEffect(() => {
		_setPreviewItems(props.components || []);
	}, [props.components]);
	
	useEffect(() => {
		updatePanelContext({
			id,
			setPreviewItems: _setPreviewItems,
		});
	}, []);
	
	
	const purgeOnClickEvent = (_items) => {
		return _items.map((i) => {
			delete i.events?.onClick;
			if(i.components){
				purgeOnClickEvent(i.components);
			}
			return i;
		});
	}

	const [previewItems, setPreviewItems] = useState(purgeOnClickEvent(props.components || []));
	
	if(panelContext._status !== PANEL_STATUS_READY) return;

	var portalChildren = <React.Fragment>
		<div id="previewWindowDimensions" className="fixed top-0 right-0 opacity-50 bg-white p-2 text-xs border-round-sm z-5"></div>
		{ previewItems && previewItems.map((i) => (
			<MemoComponent key={i.id} context={context} {...i} />
		))}
	</React.Fragment>;

	return (
		<iframe
			className={classNames("anacleto-preview border-round-3xl", props.className)}
			ref={setContentRef}
			style={{ border: "none" }}
		>
			{mountNode && createPortal(portalChildren, mountNode)}
		</iframe>
	);
};
const MemoPreview = React.memo(Preview, (prev, next) => {
	return defaultMemoizeFunction(Preview.propTypes, prev, next);
});
MemoPreview.displayName = "Preview";

Preview.propTypes = {
	id: PropTypes.string,
	context: PropTypes.object.isRequired,
	panelContext: PropTypes.object.isRequired,
	windowData: PropTypes.any,
	record: PropTypes.object,
	setRecord: PropTypes.func,
	components: PropTypes.array,
	className: PropTypes.string,
	setIsLoading: PropTypes.func,
	panelBaseMethods: PropTypes.object,
	title: PropTypes.string,
	showTitle: PropTypes.bool,
	events: PropTypes.object,
}
export default MemoPreview;