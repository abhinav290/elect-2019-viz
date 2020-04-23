import React from "react";
import * as d3 from 'd3'
import { CardHeader } from "material-ui";

class BubbleLegend extends React.Component {
    static defaultProps = {
        width: 200,
        height:90,
        stroke: false,
    }

    componentDidMount = () => {
        this.renderLegend()
    }

    renderLegend = ()=> {
        let { width, height} = this.props
        if(this.props.stroke) height =180
        let legend = d3.select(this.refs.bubbleLegend)
        legend.selectAll("*").remove()
        legend = legend.append("svg").attr("width", width).attr("height", height)

        const size = d3.scaleSqrt().domain([1, 100]).range([1, 40])
        var valuesToShow = [10, 50, 100]
        var xCircle = 50
        var yCircle = 82

        var xLabel = 120
        legend
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("circle")
            .attr("cx", xCircle)
            .attr("cy", function(d){ return yCircle - size(d) } )
            .attr("r", function(d){ return size(d) })
            .style("fill", "none")
            .attr("stroke", "black")
        
        // Add legend: segments
        legend
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("line")
            .attr('x1', function(d){
                return xCircle + size(d) } )
            .attr('x2', xLabel)
            .attr('y1', function(d){ return yCircle - size(d) } )
            .attr('y2', function(d){ return yCircle - size(d) } )
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))
        
        // Add legend: labels
        legend
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("text")
            .attr('x', xLabel)
            .attr('y', function(d){ return yCircle - size(d) } )
            .text( function(d){ return d } )
            .style("font-size", 6)
            .attr('alignment-baseline', 'middle')
        this.props.stroke && this.renderWinnerCircles(legend)

    }
    renderWinnerCircles = (legend)=> {
        const size = 15
        const xCircle = 50
        const yCircle = 110
        const xLabel = 100

        legend.append("circle")
          .attr("cx", xCircle)
          .attr("cy", yCircle )
          .attr("r", size )
          .style("fill", "none")
          .attr("stroke", "black").attr("stroke-width", "4px")
        
        legend.append("text") 
          .attr("x", xLabel)
          .attr("y", yCircle + size/3)
          .text( 'Winner' )
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')          
 
 
        legend.append("circle")
          .attr("cx", xCircle)
          .attr("cy", yCircle + (size*3))
          .attr("r", size)
          .style("fill", "none")
          .attr("stroke", "black").attr("stroke-width", "1px")
      
          legend.append("text")
          .attr("x", xLabel)
          .attr("y", yCircle + (size*3) + size/3)
          .text( 'Participant' )
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')     
          return <CardHeader><b>Stroke Legend</b></CardHeader>     
    }

    render= () => {
        this.renderLegend()
        return(<div ref="bubbleLegend"/>)
    }
}

export default BubbleLegend