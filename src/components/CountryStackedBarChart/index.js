import React from "react";
import * as utils from "../../utils/consts";

import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, HorizontalBarSeries} from 'react-vis'

class CountryStackedBarChart extends React.Component {
    static defaultProps = {
        electionData: null,
    }


    
    renderBarChart = ()=> {
        return (
            <XYPlot label="Seats Won by Political Parties in each state."
            className="stacked-bar-chart"
            yType="ordinal"
            margin={{left: 250}}
            stackBy="x"
            width={this.props.width}
            height={this.props.height}
            >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            {this.renderBars()}
             </XYPlot>
            )
   
    }
    
    render = () => {
        return (
        <div>
            {this.renderBarChart()}
        </div>)
    }
        
        renderBars = () => {
            const {colorLegend, electionData}  =this.props
            const BarSeries = HorizontalBarSeries;  
            const data =utils.getBarChartData(electionData)
            const series = [] 
            Object.keys(data).forEach(party=> {
                let partyColor= colorLegend[party]
                series.push(<BarSeries data={this.convertBarData(data[party])} color={partyColor} key ={party} />)
                })
                return series   
        }
        
        convertBarData = (partyData)=> {
            let data=[]
            Object.keys(partyData).forEach(state=> {
                data.push({x: partyData[state], y: state, label: partyData[state]})
            })
            return data
        }
    }
    
    export default CountryStackedBarChart