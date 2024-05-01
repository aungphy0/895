import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './chord.css'; // Assuming you have a CSS file for additional styles

const ChordChart = ({ images, predictedClasses }) => {
    const ref = useRef(null);

    useEffect(() => {
        d3.select(ref.current).selectAll("svg").remove(); // Clear existing SVG to avoid duplication

        if (!images || !predictedClasses) return;

        const { matrix, indexMap } = processData(images, predictedClasses);
        if (matrix) {
            drawChordChart(ref.current, matrix, indexMap);
        }
    }, [images, predictedClasses]);

    return <div ref={ref} className="chord-chart-container" />;
};

function processData(images, predictedClasses) {
    const indexMap = {};
    let idx = 0;

    Object.values(images).concat(Object.values(predictedClasses)).forEach(key => {
        if (!indexMap.hasOwnProperty(key)) {
            indexMap[key] = idx++;
        }
    });

    const matrix = Array.from({ length: idx }, () => Array.from({ length: idx }, () => 0));

    Object.keys(predictedClasses).forEach(image => {
        const trueIndex = indexMap[images[image]];
        const predictedIndex = indexMap[predictedClasses[image]];
        matrix[trueIndex][predictedIndex]++;
    });

    return { matrix, indexMap };
}

function drawChordChart(container, matrix, indexMap) {
    const width = 800;
    const height = 800;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const svg = d3.select(container).append("svg")
        .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
        .attr("class", "chord-chart");

    const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)(matrix);

    const group = svg.append("g")
        .selectAll("g")
        .data(chord.groups)
        .join("g");

    group.append("path")
        .attr("fill", d => d3.schemeTableau10[d.index % 10])
        .attr("stroke", d => d3.rgb(d3.schemeTableau10[d.index % 10]).darker())
        .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius));

    group.append("text")
        .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", "0.35em")
        .attr("transform", d => `
            rotate(${(d.angle * 180 / Math.PI - 90)})
            translate(${outerRadius + 5})
            ${d.angle > Math.PI ? "rotate(180)" : ""}
        `)
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => getKeyByValue(indexMap, d.index))
        .style("font-size", "10px");

    svg.append("g")
        .attr("fill-opacity", 0.67)
        .selectAll("path")
        .data(chord)
        .join("path")
        .attr("d", d3.ribbon().radius(innerRadius))
        .attr("fill", d => d3.schemeTableau10[d.target.index % 10])
        .attr("stroke", d => d3.rgb(d3.schemeTableau10[d.target.index % 10]).darker())
        .append("title")
        .text(d => `${getKeyByValue(indexMap, d.source.index)} → ${getKeyByValue(indexMap, d.target.index)}: ${d.source.value}`);
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export default ChordChart;
