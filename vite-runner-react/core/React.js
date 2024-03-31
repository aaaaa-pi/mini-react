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
                const isTextNode = typeof child === "string" || typeof child === "number"
                return isTextNode ? createTextNode(child) : child
            })
        },
    };
}

function render(el,container) {
    wipRoot = {
        dom: container,
        props: {
            children: [el]
        }
    }

    nextWorkOfUnit = wipRoot
}

let nextWorkOfUnit = null;
let wipRoot = null;
let currentRoot = null;
function workLoop(deadline){
    let shouldYield = false
    while(!shouldYield && nextWorkOfUnit){
        nextWorkOfUnit = performWorkUnit(nextWorkOfUnit)

        shouldYield = deadline.timeRemaining() < 1
    }
    if(!nextWorkOfUnit && wipRoot){
        commitRoot()
    }
    requestIdleCallback(workLoop)
}

function commitRoot(){
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function commitWork(fiber) {
    if(!fiber)return 
    
    let fiberParent = fiber.parent
    while(!fiberParent.dom){
        fiberParent = fiberParent.parent
    }

    if(fiber.effectTag === "update"){
        updateProps(fiber.dom,fiber.props,fiber.alternate?.props)
    }else if(fiber.effectTag === "placement"){
        if(fiber.dom){
            fiberParent.dom.append(fiber.dom)
        }
    }
    
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function createDom (type) {
    return type === "TEXT_ELEMENT" 
        ? document.createTextNode("")
        : document.createElement(type)
}

function update() {
    wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot
    }

    nextWorkOfUnit = wipRoot
}

function updateProps(dom,newProps,prevProps){
    // 1. old 有,new 没有： 删除操作
    Object.keys(prevProps).forEach(key => {
        if(key !== "children"){
            if(!(key in newProps)){
                dom.removeAttribute(key)
            }
        }
    })

    // 2. new 有， old 没有 添加
    // 3. new 有， old 有  修改
    Object.keys(newProps).forEach(key => {
        if(key !== "children") {
            if(newProps[key] !== prevProps[key]){
                if(key.startsWith("on")){
                    const eventType = key.slice(2).toLowerCase()

                    dom.removeEventListener(eventType,prevProps[key])
                    dom.addEventListener(eventType,newProps[key])
                }else {
                    dom[key] = newProps[key]
                }
            }
        }
    })
}

function reconcileChildren (fiber,children){
    let oldFiber = fiber.alternate?.child
    let prevChild = null
    children.forEach((child,index) => {
        const isSameType = oldFiber && oldFiber.type === child.type

        let nextFiber;
        if(isSameType){
            nextFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                child: null,
                sibling: null,
                dom: oldFiber.dom,
                effectTag: "update",
                alternate: oldFiber
            }
        }else {
            nextFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                child: null,
                sibling: null,
                dom: null,
                effectTag: "placement"
            }
        }

        if(oldFiber){
            oldFiber = oldFiber.sibling
        }

        if(index === 0){
            fiber.child = nextFiber
        }else {
            prevChild.sibling = nextFiber
        }
        prevChild = nextFiber
    })
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)]

    reconcileChildren(fiber,children)
}

function updateHostComponent(fiber){
    if(!fiber.dom){
        // 1. 创建dom
        const dom = (fiber.dom = createDom(fiber.type))

        // 2. 设置props
        updateProps(dom,fiber.props,{})
    }

    const children = fiber.props.children
    // 3. 转换链表 设置好指针
    reconcileChildren(fiber,children)
}

function performWorkUnit(fiber){
    const isFunctionComponent = typeof fiber.type === "function"

    if(isFunctionComponent){
        updateFunctionComponent(fiber)
    }else {
        updateHostComponent(fiber)
    }

    // 4. 返回下一个要执行的任务
    if(fiber.child){return fiber.child}

    let nextFiber = fiber;
    while(nextFiber){
        if(nextFiber.sibling)return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
}

requestIdleCallback(workLoop)

const React = {
    createElement,
    render,
    update
}

export default React;