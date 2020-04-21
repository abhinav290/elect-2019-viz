import React from 'react';
import './App.css';
import DashboardContainer from './components/Dashboard';


function App() {
  return (
    <div className="App">
      <div className="tooltip" style={{opacity:0}}/>
      <DashboardContainer/>
        </div>
  );
}

export default App;
