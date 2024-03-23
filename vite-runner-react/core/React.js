function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        },
    };
}

function createElement(type,props,...children){
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === "string" ? createTextNode(child) : child
            })
        },
    };
}

function render(el,container) {
    // 创建对应的元素
    const dom = 
        el.type === "TEXT_ELEMENT" 
        ? document.createTextNode("")
        : document.createElement(el.type)

    // 设置props
    Object.keys(el.props).forEach(key => {
        if(key !== "children"){
            dom[key] = el.props[key]
        }
    });

    // 额外处理一下children
    const children = el.props.children
    children.forEach(child => {
        render(child,dom)
    });

    // 添加到对应的父元素下面
    container.append(dom);
}

const React = {
    createElement,
    render
}

export default React;