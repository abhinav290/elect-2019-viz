import React from "react";
import {EXCEL_COLUMNS, getConstituencyData, getBarChartData, getBubbleChartData} from "../../utils/consts";
import * as d3 from 'd3'
import * as d3arr from 'd3-array'
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

class BubbleChart extends React.Component {
    static defaultProps = {
        electionData: null,
    }
    state= {
        stateKey: null,
        column: EXCEL_COLUMNS.CONSTITUENCY
    }
    componentDidMount= () => {
     this.renderGraph()
    }
    render = () => {            
        return (<div id="bubbleChart">
        {this.renderDropdown()}
        {this.renderGraph()}
        </div>)
    }
    renderGraph = ()=> {
        let  height=600
        const {electionData, colorLegend} = this.props
        const {column}= this.state
        const data = getBubbleChartData(electionData, column)
        function centroid(nodes) {
            let x = 0;
            let y = 0;
            let z = 0;
        
            for (const d of nodes) {
                let k = d.r ** 2;
                x += d.x * k;
                y += d.y * k;
                z += k;
            }
            return {x: x / z, y: y / z};
        }
        let width=1000
        let pack = () => d3.pack()
                .size([width, height])
                .padding(1)
                (d3.hierarchy(data)
                .sum(d => d.value))
                
                function forceCollide() {
                    const alpha = 0.4; // fixed for greater rigidity!
                    const padding1 = 1; // separation between same-color nodes
                    const padding2 = 25; // separation between different-color nodes
                    let nodes;
                    let maxRadius;
                    
                    function force() {
                        const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
                        for (const d of nodes) {
                            const r = d.r + maxRadius;
                            const nx1 = d.x - r, ny1 = d.y - r;
                            const nx2 = d.x + r, ny2 = d.y + r;
                            quadtree.visit((q, x1, y1, x2, y2) => {
                                if (!q.length) do {
                                    if (q.data !== d) {
                                        const r = d.r + q.data.r + (d.data.group === q.data.data.group ? padding1 : padding2);
                                        let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
                                        if (l < r) {
                                            l = (l - r) / l * alpha;
                                            d.x -= x *= l
                                            d.y -= y *= l;
                                            q.data.x += x
                                            q.data.y += y
                                        }
                                    }
                                } 
                                while(q = q.next)
                                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                            });
                        }
                    }
                    
                    force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);
                    
                    return force;
                }
                
                function forceCluster() {
                    const strength = 0.2;
                    let nodes;
                    
                    function force(alpha) {
                        const centroids = d3arr.rollup(nodes, centroid, d => d.data.group);
                        const l = alpha * strength;
                        for (const d of nodes) {
                            const {x: cx, y: cy} = centroids.get(d.data.group);
                            d.vx -= (d.x - cx) * l;
                            d.vy -= (d.y - cy) * l;
                        }
                    }
                    
                    force.initialize = _ => nodes = _;
                    
                    return force;
                }
                
                
                
                const nodes = pack().leaves();
                
                const simulation = d3.forceSimulation(nodes)
                .force("x", d3.forceX(width / 2).strength(0.01))
                .force("y", d3.forceY(height / 2).strength(0.01))
                .force("cluster", forceCluster())
                .force("collide", forceCollide());
                
                let svg = d3.select("#bubbleChart")
                let div= d3.select(".tooltip")
                svg.selectAll("*").remove()
                svg = svg.append("svg").attr("width", width).attr("height", height).style("background", "#d3d3d3")
                
                const node = svg.append("g")
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", d => {
                    return colorLegend[d.data[EXCEL_COLUMNS.PARTY]]
                })
                .style("opacity",0.9)
                .style("stroke", "black")
                .style("stroke-width",  d => d.data[EXCEL_COLUMNS.WINNER] === "1" ? "4px" : "0px")
                .on("mouseover", d => {
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div.html(this.generateTooltipText(d.data))	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
        
                })
                .on("mouseout", d => {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0)	
                    })
                .call(this.drag(simulation))

                node.transition()
                .delay((d, i) => Math.random() * 500)
                .duration(750)
                .attrTween("r", d => {
                    const i = d3.interpolate(0, d.r);
                    return t => d.r = i(t);
                });
                
                simulation.on("tick", () => {
                    node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
                });
                
                return null
            }
            
            drag = simulation => {
                
                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
                
                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }
                
                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
                
                return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
            }

            renderDropdown = ()=> {
                const attributes= [EXCEL_COLUMNS.CONSTITUENCY, EXCEL_COLUMNS.PARTY, EXCEL_COLUMNS.WINNER, EXCEL_COLUMNS.EDUCATION, EXCEL_COLUMNS.CATEGORY, EXCEL_COLUMNS.GENDER]
                return(
                    <Autocomplete
                    id="attribute-selector"
                      options={attributes}
                      value={this.state.column}
                      style={{ width: 300 }}
                      onChange = {(elem, val)=>{
                          this.setState({column: val})} }
                      renderInput={(params) => <TextField {...params} label="Select Attribute" />
                      }
                      />
                )
            }

            generateTooltipText= (data)=> {
                return `${data[EXCEL_COLUMNS.WINNER] === "1"?"<b>WINNER</b><br/>":""}
                <b>${EXCEL_COLUMNS.NAME}:</b> ${data[EXCEL_COLUMNS.NAME]} <br/>
                <b>${EXCEL_COLUMNS.PARTY}</b>: ${data[EXCEL_COLUMNS.PARTY]} <br/>
                <b>${EXCEL_COLUMNS.CONSTITUENCY}:</b> ${data[EXCEL_COLUMNS.CONSTITUENCY]} <br/>
                <b>${EXCEL_COLUMNS.STATE}:</b> ${data[EXCEL_COLUMNS.STATE]} <br/>
                <b>${EXCEL_COLUMNS.AGE}:</b> ${data[EXCEL_COLUMNS.AGE]} <br/>
                <b>${EXCEL_COLUMNS.CATEGORY}:</b> ${data[EXCEL_COLUMNS.CATEGORY]} <br/>
                <b>${EXCEL_COLUMNS.EDUCATION}:</b> ${data[EXCEL_COLUMNS.EDUCATION]} <br/>
                `
            }
        }
        export default BubbleChart