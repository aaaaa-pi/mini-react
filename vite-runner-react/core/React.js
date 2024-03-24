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

let nextWorkOfUnit = null;
function workLoop(deadline){
    let shouldYield = false
    while(!shouldYield && nextWorkOfUnit){
        nextWorkOfUnit = performWorkUnit(nextWorkOfUnit)

        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function render(el,container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
}

function createDom (type) {
    return type === "TEXT_ELEMENT" 
        ? document.createTextNode("")
        : document.createElement(type)
}

function updateProps(dom,props){
    Object.keys(props).forEach(key => {
        if(key !== "children") {
            dom[key] = props[key]
        }
    })
}

function initChildren (fiber){
    const children = fiber.props.children
    let prevChild = null
    children.forEach((child,index) => {
        const nextFiber = {
            type: child.type,
            props: child.props,
            parent: fiber,
            child: null,
            sibling: null,
            dom: null
        }
        if(index === 0){
            fiber.child = nextFiber
        }else {
            prevChild.sibling = nextFiber
        }
        prevChild = nextFiber
    })
}

function performWorkUnit(fiber){
    if(!fiber.dom){
        // 1. 创建dom
        const dom = (fiber.dom = createDom(fiber.type))

        fiber.parent.dom.append(dom);
        // 2. 设置props
        updateProps(dom,fiber.props)
    }
    // 3. 转换链表 设置好指针
    initChildren(fiber)
    // 4. 返回下一个要执行的任务
    if(fiber.child){return fiber.child}

    if(fiber.sibling){return fiber.sibling}

    return fiber.parent?.sibling
}

const React = {
    createElement,
    render
}

export default React;