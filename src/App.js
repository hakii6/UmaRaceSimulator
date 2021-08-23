import React from 'react'
// import BaseForm from './components/BaseForm'

import RaceForm from './components/RaceForm'

const App = () => {
  Number.prototype.round = function() {
    return Math.round(this * 1000.0) / 1000.0
  }

  return (
    <div>
{/*      <BaseForm />
*/}    
      <RaceForm/>

    </div>
  )
}

export default App