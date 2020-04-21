import React from "react";
import * as utils from "../../utils/consts";
import * as d3 from 'd3'

import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, HorizontalBarSeries, Hint} from 'react-vis'

class CountryStackedBarChart extends React.Component {
    static defaultProps = {
        electionData: null,
    }

    state = {
        tooltipData: null,
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
            {this.state.tooltipData !=null && (<Hint value={this.state.tooltipData} align={{horizontal: 'right', vertical: 'top'}}>
                <div>{this.state.tooltipData.data.x}</div>
                </Hint>)}

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
            const div = d3.select(".tooltip")
            const series = [] 
            Object.keys(data).forEach(party=> {
                let partyColor= colorLegend[party]
                series.push(<BarSeries data={this.convertBarData(data[party])} color={partyColor} key ={party} 
                onValueMouseOver= { function (d, event) {    
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html( "<br/>"  + d.close)	
                        .style("left", (event.pageX) + "px")		
                        .style("top", (event.pageY - 28) + "px");	
                  }}
                onValueMouseOut={function(d) {
                div.transition().duration(500).style("opacity", 0)	
                     }}
                
                />)
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