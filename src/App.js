import React from 'react'
// import BaseForm from './components/BaseForm'

import Simulator from './components/Simulator'

const App = () => {
  Number.prototype.round = function() {
    return Math.round(this * 1000.0) / 1000.0
  }

  return (
    <div>
{/*      <BaseForm />
*/}    
      <Simulator/>

    </div>
  )
}

export default App