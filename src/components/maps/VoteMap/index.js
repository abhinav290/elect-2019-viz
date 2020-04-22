import React from "react";
import * as d3 from 'd3'
import * as topojson from 'topojson'
import * as utils from "../../../utils/consts";

class VotingMap extends React.Component {
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
    shouldComponentUpdate = (nextProps, nextState)=> {
        if(this.state.countryData !== nextState.countryData) return true
        return false
    }


    renderMap = () => {    
        const { width, height } = this.props
        const states = this.state.countryData 
        const {electionData, colorLegend}=this.props
        
        let stateVotingMap = utils.stateVoting(electionData)
        
    //Adding tooltip
        const tooltipDiv = d3.select(".tooltip")
        tooltipDiv.selectAll("*").remove()  
        const projection = d3.geoMercator().scale(1150).center([82.9629, 23.5937]).translate([width/2, height/2])      
        const path = d3.geoPath(projection)
        const svg = d3.select(this.refs.map)
        svg.selectAll("*").remove()
        const g = svg.append("g")
        const radCalc = d3.scaleSqrt().domain([40,90]).range([10,25])

        states.forEach(state => {
            this.renderState(g, state, path, tooltipDiv)
            this.renderBubble(colorLegend, stateVotingMap, g, state, path, radCalc)

        })
        states.forEach(state => {
            this.renderStateLabel(g, state, path)
        })
    }

         

    //Individual state component.
    renderState = ( g, state, path, div)=> {
        //State area and color
        const name = utils.getStateName(state.properties.st_nm)
        g.append("path").datum(state).attr("d", path)
        .attr("fill", "blue").style("opacity","0.2")
        .style("stroke", "#000000")
        .style("stroke-width", "1px")
        .on("click", () => this.onClickState(name))
        .on("mouseover", function (d) {
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html( "<br/>"  + name)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	

        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0)	
            })
    }

    renderStateLabel = ( g, state, path)=> {
        let name = utils.getStateName(state.properties.st_nm)
    
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

     renderBubble = (colorLegend, stateVotingMap, g, state, path, radCalc)=> {
        let name = utils.getStateName(state.properties.st_nm)

        g.append("circle").datum(state)
        .attr("class", "bubble")
        .attr("fill", colorLegend[name]).style("opacity","0.8")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("r", function(d) {
            let perc = (stateVotingMap[name]['VOTES']/stateVotingMap[name]['TOTAL_ELECTORS'])*100
            return radCalc(perc)
            
        })     }

    //Load the geojson to display map.
    loadData = async ()=> {
        const data = await  d3.json(this.geoData).then(function(data) {
            return data
        })
        this.setState({countryData: topojson.feature(data, data.objects.Indian_States).features})
    } 
    

    onClickState = (name) => {
        this.props.clickFunc(name)
    }

    render() {
        const { width, height } = this.props
        this.state.countryData!=null && this.renderMap()
        return (
            <svg ref="map" width={width} height={height} />
            )
        }
    }
    
    export default VotingMap
    