import React from "react";
import * as d3 from 'd3'

class Legend extends React.Component {
    static defaultProps = {
        width: 200,
        height:700,
        colorLegend: null
    }

    shouldComponentUpdate = (nextProps)=> {
        if(this.props.colorLegend != nextProps.colorLegend) return true
        return false
    }

    componentDidMount = () => {
        this.renderLegend()
    }

    renderLegend = ()=> {
        const {colorLegend, width, height} = this.props
        let legend = d3.select(this.refs.legend)
        console.log(legend)
        legend.selectAll("*").remove()
        legend = legend.append("svg").attr("width", width).attr("height", height)
        const verticalSpace =18
        console.log('Render legend')



        //Display colorlegend
        Object.keys(colorLegend).forEach((key, i) => {      
        
        legend.append("rect")
        .attr("width", 13)
        .attr("height", 13)
        .attr("x",20)
        .attr("y", function () {
            return 40 + (i*verticalSpace)
        })
        .style("fill", function () { return colorLegend[key]})
        
        legend.append("text")
        .attr("x",50)
        .attr("y", function () {
            return 52 + (i*verticalSpace)
        })
        .text(key).style("color","white")
        })
    }

    render= () => {
        this.props.colorLegend !=null && this.renderLegend()
        return(<div ref="legend"/>)
    }
}

export default Legend