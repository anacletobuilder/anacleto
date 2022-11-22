import React from 'react';
import { Image as PrimeImage } from 'primereact/image';
import { classNames } from "primereact/utils";


const Image = (props) => {
    const config = props.control;
    const defaultFunction = (e) => {};
    const onShow = config.onShow ? config.onShow : defaultFunction;
    const onHide = config.onHide ? config.onHide : defaultFunction;

    return <PrimeImage
        width={config.width}
        preview={config.preview}
        src={config.src}
        downloadable= {config.downloadable}
        imageStyle={config.imageStyle}
        imageClassName={classNames("w-full", config.fieldClassName)}
        onShow={(e)=> onShow(e)}
        onHide={(e)=> onHide(e)}
    />
}

export default Image;