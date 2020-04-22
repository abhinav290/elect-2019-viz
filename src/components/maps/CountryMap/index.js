import React from "react";
import * as d3 from 'd3'
import * as topojson from 'topojson'
import {EXCEL_COLUMNS, getStateName, processElectionDataMajorityParty, getPartyLegendState } from "../../../utils/consts";

class CountryMap extends React.Component {
    geoData="/Indian_States.json"
    
    state = {
        countryData: null,
     }

     static defaultProps = {
         width: 800,
         height:600,
         electionData: null,
         colorLegend: null,
     }

    
     componentDidMount= ()=> {
        this.loadData()
    }


    renderMap = () => {    
        const { width, height } = this.props
        const states = this.state.countryData 
        const {electionData, colorLegend, clickFunc}=this.props
        
        let statePartyMap = processElectionDataMajorityParty(electionData)
        statePartyMap = getPartyLegendState(colorLegend, statePartyMap)
        
    //Adding tooltip
        const tooltipDiv = d3.select(".tooltip")
        tooltipDiv.selectAll("*").remove()
        const projection = d3.geoMercator().scale(1150).center([82.9629, 23.5937]).translate([width/2, height/2])      
        const path = d3.geoPath(projection)
        const svg = d3.select(this.refs.map)
        const g = svg.append("g")
        

        states.forEach(state => {
            this.renderState(statePartyMap, g, state, path, tooltipDiv, this.colorState, clickFunc)
        })
        states.forEach(state => {
            this.renderStateLabel(g, state, path)
        })
    }

         

    //Individual state component.
    renderState = (colorlegend, g,state, path, div, colorFunc, clickFunc)=> {
        let name =getStateName(state.properties.st_nm)
        let generateTooltipText = this.generateTooltipText

        //State area and color
        g.append("path").datum(state).attr("d", path)
        .attr("fill", colorFunc(colorlegend, name, 'color')).style("opacity","0.8")
        .style("stroke", "#000000")
        .style("stroke-width", "1px")
        .on("mouseover", function (d) {
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(generateTooltipText(name, colorlegend[name]))	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	

        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0)	
            })
        .on("click", ()=> clickFunc(name))
    }

    renderStateLabel = ( g, state, path)=> {
        let name = getStateName(state.properties.st_nm)
    
        //State name
        g.append("text").datum(state)
        .attr("class", "subunit-label")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", ".5em")
        .style("color","white")
        .style("text-transform", "uppercase")
        .text(name)
     }

    //Function to return the color.
    colorState = (colorlegend, name, property)=> {
        return colorlegend[name][property]
    }

    //Load the geojson to display map.
    loadData = async ()=> {
        const data = await  d3.json(this.geoData).then(function(data) {
            return data
        })
        this.setState({countryData: topojson.feature(data, data.objects.Indian_States).features})
    }

    generateTooltipText= (name, data)=> {
        return `
        <b>${EXCEL_COLUMNS.NAME}:</b> ${name} <br/>
        <b>${EXCEL_COLUMNS.PARTY}</b>: ${data.party} <br/>
        <b>SEATS WON:</b> ${data.count} <br/>

        `
    }

    render() {
        const { width, height } = this.props
        this.state.countryData!=null && this.renderMap()
        return (
            <svg ref="map" width={width} height={height} />
            )
        }
    }
    
    export default CountryMap
    