import React from "react"
import {Tooltip, Button, NumberInput, Form} from "carbon-components-react"

import './Counter.scss'

import * as d3 from 'd3'

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {add: 0}

        this.handleChange = this.handleChange.bind(this)
    }

    shouldComponentUpdate(nextProps) {
        return this.props.goal !== nextProps.goal || this.props.value !== nextProps.value
    }

    componentDidMount() {
        this.renderD3()
    }
    componentDidUpdate() {
        this.renderD3();
    }

    handleChange(e) {
        if (e && e.target.value)
            this.setState({add: e.target.value})
    }

    render() {
        const id = `${this.props.name}-add-value`;
        return (
            <div className="counter">
                <h1 className="bx--graph-header">{this.props.name}</h1>
                <div className="container">
                    <svg id={this.props.name}></svg>
                    <div className="text">
                        <p className="value" id={`${this.props.name}Value`}></p>
                        <p className="goal" id={`${this.props.name}Goal`}></p>
                    </div>
                        <Tooltip className="add-tool-tip" showIcon={false} direction="top" triggerText="Add">
                            <Form>
                                <NumberInput 
                                    id={id}
                                    min={0}
                                    max={500}
                                    onChange={this.handleChange}
                                    invalidText="Invalid Number"
                                />
                                <Button onClick={() => this.props.onAddClick(this.props.name, this.state.add)}>Add</Button>
                            </Form>
                        </Tooltip>
                </div>
            </div>
        )
    }

    renderD3() {
        // Based on this great Demo: http://bl.ocks.org/mbostock/5100636
        const tau = 2 * Math.PI;
        const radius = 70;
        const padding = 15;
        const boxSize = (radius + padding) * 2;
        const ratio = this.props.value / this.props.goal;

        let color = '#efc100';

        if (ratio > 1) {
            color = '#e0182d';
        }
        else if (ratio === 1) {
            color = '#5aa700';
        }
        else if (ratio > 0.5) {
            color = '#5aaafa'
        }

        const arc = d3.arc()
            .innerRadius(radius)
            .outerRadius(radius - 10)
            .startAngle(0);

        const svg = d3.select(`#${this.props.name}`)
            .attr('width', boxSize)
            .attr('height', boxSize);

        const g = svg
            .append('g')
            .attr('transform', `translate(${boxSize / 2}, ${boxSize / 2})`);

        // Background Arc
        g.append('path')
            .datum({ endAngle: tau })
            .style('fill', '#dfe3e6')
            .attr('d', arc)

        // Foreground Arc
        g.append('path')
            .datum({ endAngle: 0 })
            .style('fill', color)
            .transition()
            .attrTween('d', arcTween(ratio * tau));

        // Text Labels
        const valueText = d3.select(`#${this.props.name}Value`);
        const goalText = d3.select(`#${this.props.name}Goal`);
        valueText
            .style('opacity', 0)
            .transition()
            .style('opacity', 1)
            .text(`${this.props.value}g`);

        goalText
            .style('opacity', 0)
            .transition()
            .style('opacity', 1)
            .text(`/${this.props.goal}g`);

        // Animation function
        function arcTween(newAngle) {
            return function(d) {
                const interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d)
                }
            }
        }
    }
}

export default Counter