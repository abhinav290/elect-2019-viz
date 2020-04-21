import React from "react";
import * as d3 from 'd3'
import {EXCEL_COLUMNS, getPartyLegend, getStateLegend}  from "../../utils/consts";

import CountryMap from "../maps/CountryMap"
import VoteMap from "../maps/VoteMap"
import CountryStackedBarChart from "../CountryStackedBarChart";
import Legend from "../Legend";
import VotingChart from "../VotingChart";
import BubbleChart  from "../BubbleChart";

class DashboardContainer extends React.Component {
    electData="/LS_2.0.csv"

    state = {
        electionData: null,
        stateKey: null
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
            <div class="row">
                <div class="column"> 
                    <CountryMap electionData={electionData} colorLegend={colorLegend} width="600" height={height} clickFunc={this.updateStateKey}/>
                </div>
                <div class="column" >
                    <CountryStackedBarChart electionData={electionData} width="700" height={height} colorLegend={colorLegend}/>
                </div>
                <div class="column">
                    <Legend colorLegend={colorLegend} width="100" height={height}/>
                </div>
            </div>
            {this.state.stateKey && this.renderBubble()}
            </div>)
    }
    renderVoteComps = () => {
        let height=700
        let {electionData, stateKey} =this.state
        let colorLegend = getStateLegend(electionData)
        return (
            <div className="row">
                <div className="column"> 
                    <VoteMap electionData={electionData} colorLegend={colorLegend} width="650" height={height} clickFunc={this.updateStateKey}/>
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
        let {electionData, stateKey} =this.state
        return(<div>
            <div className="row">
                Indian General Election 2019
            </div>
            {this.state.electionData && this.renderComps()}
            </div>)

    }
             
}

export default DashboardContainer