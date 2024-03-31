import React from './core/React.js'

let count = 10
let props = {id: "11111"}
function Counter() {
    function handleClick(){
        count ++
        props = {}
        React.update()
    }
    return (
        <div {...props}>
            count: {count}
            <button onClick={handleClick}>click</button>
        </div>
        )
  }

const App = (
    <div id="app">
        <div>111</div>
        <span>span</span>
        <span>span</span>
        <Counter></Counter>
        <div>
            <span>span2</span>
            <Counter></Counter>
        </div>
        <div>1234</div>
        <div>1234567</div>
        <div>1234567</div>
        <span>span</span>
        <div>
            <div>222111</div>
            <div>111</div>
            <div>222</div>
            <div>
                <div>222111</div>
                <div>111</div>
                <div>222</div>
                <div>333
                    <div>444</div>
                </div>
            </div>
        </div>
    </div>
)

export default App;