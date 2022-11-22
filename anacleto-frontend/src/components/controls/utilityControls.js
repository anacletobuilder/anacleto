export function getClassNames(configuration) {
    let classNameLst = [];
    if (configuration.className) {
        classNameLst = configuration.className.split(" ");
    }

    
    const pushProperty = (el) => {
        if (configuration[el]) {
            classNameLst.push(configuration[el])
        }
    }

    const layoutProps = ["display","overflow","position","top","right","bottom","left","zIndex"];
    const flexBoxProps = ["flexDirection","flexWrap","flex","flexGrow","flexShrink","order","justifyContent","alignContent","alignItems","alignSelf"]
    const sizingProps = ["width","height","minWidth","maxWidth","minHeight","maxHeight"];
    const spacingProps = ["padding","margin"];
    const borderProps = ["borderRadius","borderWidth","borderStyle","borderColor"];
    const bgProps = ["bgColor","bgRepeat","bgSize","bgPosition"];
    const typographyProps = ["fontSize","fontWeight","fontStyle","textColor","textAlign","textDecoration",
    "textOverflow","textTransform","lineHeight","whitespace","listStyleType"];
    const effectsProps = ["elevation","opacity"];
    const transformProps = ["translate","transformOrigin","rotate"];
    const interactivityProps = ["appearance","cursor","outline","pointerEvents","userSelect"];
    const colOffsetProps = ["col-offset-0","col-offset-1","col-offset-2","col-offset-3","col-offset-4","col-offset-5","col-offset-6","col-offset-7","col-offset-8","col-offset-9","col-offset-10","col-offset-11","col-offset-12"]
    const colProps = ["col","col-fixed","col-1","col-2","col-3","col-4","col-5","col-6","col-7","col-8","col-9","col-10","col-11","col-12"];
    const gridProps = ["grid","grid-nogutter"];

    flexBoxProps.map((el) => pushProperty(el));
    layoutProps.map((el) => pushProperty(el));
    sizingProps.map((el) => pushProperty(el));
    spacingProps.map((el) => pushProperty(el));
    borderProps.map((el) => pushProperty(el));
    bgProps.map((el) => pushProperty(el));
    typographyProps.map((el) => pushProperty(el));
    effectsProps.map((el) => pushProperty(el));
    transformProps.map((el) => pushProperty(el));
    interactivityProps.map((el) => pushProperty(el));
    colOffsetProps.map((el) => pushProperty(el));
    colProps.map((el) => pushProperty(el));
    gridProps.map((el) => pushProperty(el));


    
    
    return classNameLst.join(" ");
}