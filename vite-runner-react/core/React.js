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

function performWorkUnit(work){
    if(!work.dom){
        // 1. 创建dom
        const dom = (work.dom = 
            work.type === "TEXT_ELEMENT" 
            ? document.createTextNode("")
            : document.createElement(work.type)
        )
        
        work.parent.dom.append(dom)
        // 2. 设置props
        Object.keys(work.props).forEach(key => {
            if(key !== "children") {
                dom[key] = work.props[key]
            }
        })
    }
    // 3. 转换链表 设置好指针
    const children = work.props.children
    let prevChild = null
    children.forEach((child,index) => {
        const nextWork = {
            type: child.type,
            props: child.props,
            parent: work,
            child: null,
            sibling: null,
            dom: null
        }
        if(index === 0){
            work.child = nextWork
        }else {
            prevChild.sibling = nextWork
        }
        prevChild = nextWork
    })
    // 4. 返回下一个要执行的任务
    if(work.child){return work.child}

    if(work.sibling){return work.sibling}

    return work.parent?.sibling
}

const React = {
    createElement,
    render
}

export default React;