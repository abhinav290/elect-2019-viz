import React from "react";
import * as utils from "../../utils/consts";
import * as d3 from 'd3'

class PieChart extends React.Component {
    static defaultProps = {
        electionData: null,
    }
    state= {
        stateKey: null,
    }
    componentDidMount= ()=> {
        this.renderChart()
    }
    render = () => {
        this.props.stateKey !=null && this.renderChart()
        return (<div ref="pieChart"></div>)
    }
    shouldComponentUpdate = (nextProps)=> {
        if(this.props.stateKey != nextProps.stateKey) return true
        return false
    }
    
    renderChart = () => {
        let {colorLegend, electionData, stateKey, width, height}  =this.props
        let data = utils.getPieData(electionData, 'Assam')
        // const colorFunc= this.colorBars
        height=300
        let dataArr=[]
        for (let stateName in data) dataArr.push({stateName, count: data[stateName]})
        
        
        d3.select(this.refs.pieChart).selectAll("*").remove()
        let svg = d3.select(this.refs.pieChart).append("svg").attr('width', width).attr('height', height)        
        
        let radius = Math.min(width, height) / 2
        let g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                
        let pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.count })
        
        let path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);
        
        let label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
        
        let arc = g.selectAll(".arc")
        .data(pie(dataArr))
        .enter().append("g")
        .attr("class", "arc");
        
        arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { 
            return colorLegend[d.data.stateName]})
        
        arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
 //       .attr("dy", "0.1em")
        .text(function(d) { return d.data.stateName })
        return null
    }
    
    colorBars = (stateVal) => {
        const {colorLegend, stateKey}  =this.props
        if(stateKey != null) {
            return colorLegend[stateKey]
        }
        return colorLegend[stateVal]        
    }
}

export default PieChart