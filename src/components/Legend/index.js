import React from "react";
import * as d3 from 'd3'

class Legend extends React.Component {
    static defaultProps = {
        width: 400,
        colorLegend: null
    }

    shouldComponentUpdate = (nextProps)=> {
        if(this.props.colorLegend !== nextProps.colorLegend) return true
        return false
    }

    componentDidMount = () => {
        this.renderLegend()
    }

    renderLegend = ()=> {
        const {colorLegend, width} = this.props
        let legend = d3.select(this.refs.legend)
        legend.selectAll("*").remove()

        const verticalSpace =16
        const squareSize= 10
        console.log(Object.keys(colorLegend).length)
        const height = Object.keys(colorLegend).length*(verticalSpace)
        legend = legend.append("svg").attr("width", width).attr("height", height).attr("class", "legend")

        //Display colorlegend
        Object.keys(colorLegend).forEach((key, i) => {      
        
        legend.append("rect")
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("x",0)
        .attr("y", function () {
            return (i*verticalSpace)
        })
        .style("fill", function () { return colorLegend[key]})
        
        legend.append("text")
        .attr("x",30)
        .attr("y", function () {
            return squareSize + (i*verticalSpace)
        })
        .text(key)
        })
    }

    render= () => {
        this.props.colorLegend !=null && this.renderLegend()
        return(<div ref="legend"/>)
    }
}

export default Legend