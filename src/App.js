import React from 'react';
import './App.css';
import DashboardContainer from './components/Dashboard';
import { MuiThemeProvider } from 'material-ui/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


function App() {
  return (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div className="App">
      <div className="tooltip" style={{opacity:0}}/>

      <DashboardContainer/>
        </div>
        </MuiThemeProvider>
  );
}

export default App;
