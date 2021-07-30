import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Clone from './clone'
import MarketPlace from './marketplace'
import Donate from './donate'

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {

      setLoading(false);

    }, 1000);

  },[loading])


    const loader = (
      <div className="load">
        <div id="space-loader"></div>
        <div id="loader"></div><br />
        <p style={{fontSize:'14px', color:'white'}}>Carregando...</p>
      </div>
    )
    const children = (
      <div style={{width:'520px', height:'520px'}}>
        <Switch>
            <Route path="/marketplace" component={(MarketPlace)} />
            <Route path="/donate" component={(Donate)} />
            <Route path="/" component={(Clone)} />
        </Switch>
      </div>
    )
    return (
      <div className="">
        {loading ? loader : children}
      </div>
    );
  }


export default App;