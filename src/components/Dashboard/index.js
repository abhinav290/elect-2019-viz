import React from "react";
import * as d3 from 'd3'
import {Paper, AppBar, Toolbar, Button, Typography, makeStyles, Menu, MenuItem, TextField} from '@material-ui/core'

import CountryMap from "../maps/CountryMap"
import VoteMap from "../maps/VoteMap"

import Legend from "../Legend";

import CountryStackedBarChart from "../CountryStackedBarChart";
import VotingChart from "../VotingChart";
import BubbleChart  from "../BubbleChart";
import {EXCEL_COLUMNS, getPartyLegend, getStateLegend, getStates}  from "../../utils/consts";
import { Autocomplete } from "@material-ui/lab";
import { lightBaseTheme, MuiThemeProvider } from "material-ui/styles";
import getMuiTheme from "material-ui/styles/getMuiTheme";

class DashboardContainer extends React.Component {
    electData="/LS_2.0.csv"

    state = {
        electionData: null,
        stateKey: null,
        tab: "Results"
    }
    componentDidMount= ()=> {
        this.loadData()
    }      
    
    updateStateKey = (state) => {
        this.setState({stateKey: state})
    }
    loadData = async ()=> {
        const electionData = await  d3.csv(this.electData).then(function(data) {
            return data
        })
        
        this.setState({
            electionData})
    }

    renderBubble = ()=> {
        let {electionData, stateKey} =this.state
        electionData= electionData.filter(row=> row[EXCEL_COLUMNS.STATE] === stateKey)
        let colorLegend = getPartyLegend(electionData)
        console.log(colorLegend)
        return (            
            <div className="row" >
                <div class="column">
                    <BubbleChart electionData={electionData} colorLegend={colorLegend} stateKey={stateKey}/>
                </div>
                <div className= "column">
                    <Legend colorLegend={colorLegend}/>
                </div>
            </div>
            )
    }
    
    renderComps = ()=> {
        let height=650
        let {electionData} =this.state
        let colorLegend = getPartyLegend(electionData.filter(row=> row[EXCEL_COLUMNS.WINNER] === "1"))
        return (<div>
            <div className="row">
                <div className="column"> 
                <Paper elevation={3}>
                    <CountryMap electionData={electionData} colorLegend={colorLegend} width="600" height={height} clickFunc={this.updateStateKey}/>
                </Paper>
                </div>
                <div className="column" >
                    <CountryStackedBarChart electionData={electionData} width="700" height={height} colorLegend={colorLegend}/>
                </div>
                <div className="column">
                    <Legend colorLegend={colorLegend} width="100" height={height}/>
                </div>
            </div>
            {this.state.stateKey && this.renderBubble()}
            </div>)
    }
    renderVoteComps = () => {
        let height=700
        let {electionData, stateKey} =this.state
        console.log(stateKey)
        let colorLegend = getStateLegend(electionData)
        return (
            <div className="row">
                <div className="column">
                    <Paper elevation={3}>
                    <VoteMap electionData={electionData} colorLegend={colorLegend} width="600" height={height} clickFunc={this.updateStateKey}/>
                    </Paper>
                </div>
                <div className="column" >
                    <Legend colorLegend={colorLegend} width="250" height={height}/>
                </div>
                <div className="column">
                    <VotingChart electionData={electionData} colorLegend={colorLegend} stateKey={stateKey}/>
                </div>
            </div>)
    }

    render = ()=>{ 
        return(<div>
            {this.state.electionData && this.renderNavBar()}
            <div className="row">
            </div>
            
            {(this.state.electionData && this.state.tab === "Results") && this.renderComps()} 
            {(this.state.electionData && this.state.tab === "Polls") && this.renderVoteComps()}
            </div>)

    }
    renderNavBar = ()=> {        
          
        const options= getStates(this.state.electionData)
        return (
          <div>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
            <AppBar position="fixed">
              <Toolbar>
                <Typography variant="h6" >
                    Indian General Election 2019
                </Typography>
                <Button color="inherit" onClick={()=> this.setState({tab: "Results", stateKey: null})}>Results</Button>
                <Button color="inherit" onClick={()=> this.setState({tab: "Polls", stateKey: null})}>Poll Statistics</Button>
                <Autocomplete
                  id="state-selector"
                    options={options}
                    value={this.state.stateKey}
                    style={{ width: 300 }}
                    onChange = {(elem, val)=>{
                        this.setState({stateKey: val})} }
                    renderInput={(params) => <TextField {...params} label="Filter by State" />
                    }
                    />
            </Toolbar>
            </AppBar>
            <Toolbar/>
            </MuiThemeProvider>
          </div>
        )
    }
}

export default DashboardContainer