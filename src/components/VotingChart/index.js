import React from "react";
import * as utils from "../../utils/consts";
import * as d3 from 'd3'

class VotingChart extends React.Component {
    static defaultProps = {
        electionData: null,
        
        
    }
    componentDidMount= ()=> {
        this.renderBars()
    }
    render = () => {
        this.props.stateKey !=null && this.renderBars()
        return (<div id="voteChart"></div>)
    }
    shouldComponentUpdate = (nextProps)=> {
        if(this.props.stateKey !== nextProps.stateKey) return true
        return false
    }
    
    renderBars = () => {
        const {electionData, stateKey}  =this.props
        let data = null
        const colorFunc= this.colorBars
        if(stateKey !=null) {
            data =utils.stateWiseVoting(electionData, stateKey )
        } else {
            data=utils.stateVoting(electionData)
        }

        let dataArr=[]       
        for (let stateName in data) dataArr.push({stateName, vote: data[stateName]})

        const margin = {top: 20, right: 40, bottom: 30, left: 120}
        let width=600
        let height = margin.top + margin.bottom +  (dataArr.length*18)
        
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        d3.select("#voteChart").selectAll("*").remove()
        let svg = d3.select("#voteChart").append("svg").attr("width", width).attr("height", height)
        let g =svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        

         // set the dimensions and margins of the graph
         width = width - margin.left - margin.right
         height = height - margin.top - margin.bottom
         
        // set the ranges
         let y = d3.scaleBand().range([height, 0]).padding(0.2)
         let x = d3.scaleLinear().range([0, width])
        
        // Scale the range of the data in the domains 
        x.domain([0, 100])        
        y.domain(Object.keys(data));
        
        // append the rectangles for the bar chart
        g.selectAll(".bar")
        .data(dataArr)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", function(d){
            return colorFunc(d.stateName)
        })
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function(d) { 
            return x(d.vote['VOTES']*100/d.vote['TOTAL_ELECTORS']) })
        .attr("y", function(d) { return y(d.stateName) })
        .attr("height", y.bandwidth())



        svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.stateName) + y.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return ((x(d.vote['VOTES']*100/d.vote['TOTAL_ELECTORS']))  + 5)
            })
            .text(function (d) {
                return (d.vote['VOTES']*100/d.vote['TOTAL_ELECTORS']).toFixed(2)})
        
        // add the x Axis
        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        
        // add the y Axis
        g.append("g")
        .call(d3.axisLeft(y))
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

export default VotingChart