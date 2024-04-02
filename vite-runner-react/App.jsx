import React from './core/React.js'

let showBar = false;
function Counter() {
  const foo = <div>foo</div>
  const bar = <p>bar</p>

  function handleShowBar() {
    showBar = !showBar;
    React.update()
  }

  return (
    <div>
      Counter
      <div>{showBar ? bar : foo}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

const App = (
    <div id="app">
        <div>111</div>
        <span>span</span>
        <span>span</span>
        <Counter></Counter>
    </div>
)

export default App;