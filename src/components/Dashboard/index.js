import React from "react";
import * as d3 from 'd3'
import { AppBar, Toolbar, Button, Typography, TextField} from '@material-ui/core'
import { Autocomplete } from "@material-ui/lab";

import CountryMap from "../maps/CountryMap"
import VoteMap from "../maps/VoteMap"
import Legend from "../Legend";
import CountryStackedBarChart from "../CountryStackedBarChart";
import VotingChart from "../VotingChart";
import BubbleChart  from "../BubbleChart";
import {EXCEL_COLUMNS, getPartyLegend, getStateLegend, getStates}  from "../../utils/consts";
import BubbleLegend from "../Legend/BubbleLegend";

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
        return <BubbleChart electionData={electionData} colorLegend={colorLegend} stateKey={stateKey}/>
    }
    
    renderComps = ()=> {
        let height=650
        let {electionData} =this.state
        let colorLegend = getPartyLegend(electionData.filter(row=> row[EXCEL_COLUMNS.WINNER] === "1"))
        return (<div>
            <div className="row">
                <div className="column"> 
                <h4>Visualization of winning party in every state</h4>
                    <CountryMap electionData={electionData} colorLegend={colorLegend} width="600" height={height} clickFunc={this.updateStateKey}/>
                </div>
                <div className="column" >
                <h4>Comparison of party wins in each state</h4>
                    <CountryStackedBarChart electionData={electionData} width="630" height={height} colorLegend={colorLegend}/>
                </div>
                <div className="column">
                <h4>Color Legend for Parties</h4>
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
                <h4>Visualization of winning party in every state</h4>
                    <VoteMap electionData={electionData} colorLegend={colorLegend} width="600" height={height} clickFunc={this.updateStateKey}/>
                </div>
                <div className="column" >
                    <div className="row">
                        <h4>Color Legend for States</h4>
                    </div>
                    <div className="row">
                        <Legend colorLegend={colorLegend} width="350" height={height}/>
                    </div>

                    <div className="row">
                        <h4>Size Legend for States</h4>
                    </div>
                    <div className="row">
                        <BubbleLegend/>
                    </div>
                </div>
                <div className="column">
                    <h4>
                        {this.state.stateKey ?`Comparision of Poll Percentage for each constituency in ${this.state.stateKey}` : "Comparision of Poll Percentage for each state"}</h4>
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
            <AppBar position="fixed">
              <Toolbar>
                <Typography variant="h4"  style={{flex:1}}>
                    Indian General Election 2019
                </Typography>
                <Button color="inherit" onClick={()=> this.setState({tab: "Results", stateKey: null})}>Results</Button>
                <Button color="inherit" onClick={()=> this.setState({tab: "Polls", stateKey: null})}>Poll Statistics</Button>
                <Autocomplete
                  id="state-selector"
                    options={options}
                    value={this.state.stateKey}
                    style={{ width: 300, marginLeft: "20px" }}
                    onChange = {(elem, val)=>{
                        this.setState({stateKey: val})} }
                    renderInput={(params) => <TextField {...params} label="Filter by State" />
                    }
                    />
            </Toolbar>
            </AppBar>
            <Toolbar/>
          </div>
        )
    }
}

export default DashboardContainer