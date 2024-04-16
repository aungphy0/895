import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './chart.css'; // Ensure this CSS file properly styles the SVG

const ChordChart = ({ images, classMap, modelData }) => {
    const svgRef = useRef(null);
    const [tooltip, setTooltip] = useState({ display: false, content: "", x: 0, y: 0 });

    useEffect(() => {
        // Clear previous renderings
        d3.select(svgRef.current).selectAll("*").remove();

        const width = 800;
        const height = 600;
        const outerRadius = Math.min(width, height) * 0.5 - 40;
        const innerRadius = outerRadius - 30;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const matrix = buildMatrix(modelData, images, classMap);
        const chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending)
            (matrix);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon()
            .radius(innerRadius);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw arcs for each group
        const group = svg.append("g")
            .selectAll("g")
            .data(chord.groups)
            .enter().append("g");

        group.append("path")
            .style("fill", d => color(d.index))
            .style("stroke", d => d3.rgb(color(d.index)).darker().toString())
            .attr("d", arc);

        // Add labels to the arcs
        group.append("text")
            .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", "0.35em")
            .attr("transform", d => `
                rotate(${(d.angle * 180 / Math.PI - 90)})
                translate(${outerRadius + 10})
                ${d.angle > Math.PI ? "rotate(180)" : ""}
            `)
            .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
            .text(d => classMap[d.index + 1].name);

        // Draw ribbons
        svg.append("g")
            .selectAll("path")
            .data(chord)
            .enter().append("path")
            .attr("d", ribbon)
            .style("fill", d => color(d.target.index))
            .style("stroke", d => d3.rgb(color(d.target.index)).darker().toString());

    }, [images, classMap, modelData]);

    function buildMatrix(modelData, images, classMap) {
        const indexMap = new Map(Object.values(classMap).map((d, i) => [d.name, i]));
        const matrix = Array.from({ length: indexMap.size }, () => new Array(indexMap.size).fill(0));

        modelData.forEach(data => {
            const imageName = data.name;
            const trueClass = images[imageName];
            const trueClassIndex = indexMap.get(trueClass);
            const predictedClassIndex = data.probabilities.indexOf(Math.max(...data.probabilities));
            const predictedClass = classMap[predictedClassIndex + 1].name;
            const predictedClassIndexMapped = indexMap.get(predictedClass);

            if (trueClassIndex !== undefined && predictedClassIndexMapped !== undefined) {
                matrix[trueClassIndex][predictedClassIndexMapped]++;
            }
        });

        return matrix;
    }

    return (
        <div>
            <svg ref={svgRef}></svg>
            {tooltip.display && (
                <div className="tooltip" style={{ position: 'absolute', left: tooltip.x, top: tooltip.y, opacity: 1, pointerEvents: 'none', padding: '5px', backgroundColor: 'lightgrey', border: '1px solid black', borderRadius: '5px' }}>
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default ChordChart;
