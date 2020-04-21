import React from "react";
import * as d3 from 'd3'
import * as topojson from 'topojson'
import * as utils from "../../utils/consts";

class StateMap extends React.Component {
    geoData="/constituencies.json"
    
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
        const constituencies = this.state.countryData 
        const {electionData, colorLegend}=this.props
        
        let statePartyMap = utils.processElectionDataMajorityParty(electionData)
        statePartyMap = utils.getPartyLegendState(colorLegend, statePartyMap)
        
    //Adding tooltip
        const tooltipDiv = d3.select("body")
            .append("div")
            .attr("class", "tooltip")				
            .style("opacity", 0);

  
        const projection = d3.geoMercator().scale(1150).center([82.9629, 23.5937]).translate([width/2, height/2])      
        const path = d3.geoPath(projection)
        const svg = d3.select(this.refs.map)
        const g = svg.append("g")
        let states = new Set()
        let constituencs= new Set()
        constituencies.forEach(state => {
            states.add(state.properties.st_name) 
            constituencs.add(state.properties.pc_name)
        })
        states = Array.from(states)
        constituencs = Array.from(constituencs)
        let statescsv= utils.getStates(electionData)
        let constscsv = utils.getConstituencies(electionData)
        constituencies.forEach(state => {
            this.renderState(statePartyMap, g, state, path, tooltipDiv, this.colorState)
        })
    }

         

    //Individual state component.
    renderState = (colorlegend, g,state, path, div, colorFunc)=> {
        let name = utils.getStateName(state.properties.st_nm)

        //State area and color
        g.append("path").datum(state).attr("d", path)
        .attr("fill", "red").style("opacity","0.8")
        .style("stroke", "#000000")
        .style("stroke-width", "1px")
        .on("mouseover", function (d) {
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html( "<br/>"  + d.close)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	

        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0)	
            })
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
        this.setState({countryData: data.features})
    } 
    

    onClickState = (name) => {
        alert(name)
    }

    render() {
        const { width, height } = this.props
        this.state.countryData!=null && this.renderMap()
        return (
            <svg ref="map" width={width} height={height} />
            )
        }
    }
    
    export default StateMap
    