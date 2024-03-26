import React from './core/React.js'

function Counter({ num }) {
    return <div>count: {num}</div>;
  }

const App = (
    <div id="app">
        <div>111</div>
        <span>span</span>
        <span>span</span>
        <Counter num={10}></Counter>
        <div>
            <span>span2</span>
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