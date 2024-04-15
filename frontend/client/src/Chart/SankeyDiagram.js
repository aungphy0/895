import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import './chart.css';

const SankeyDiagram = ({ images, classMap, modelData }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!modelData || !images || !classMap) {
            console.error("Data is missing:");
            console.log({modelData, images, classMap});
            return;
        }

        const width = 1200;
        const height = 800;
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .html(''); // Clear the SVG to prevent duplication

        const { nodes, links } = createSankeyData(modelData, images, classMap);

        const sankeyGenerator = sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .extent([[1, 1], [width - 1, height - 5]]);

        const graph = sankeyGenerator({
            nodes: nodes.map(d => ({ ...d })),
            links: links.map(d => ({ ...d }))
        });

        svg.append("g")
            .selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke-width", d => Math.max(1, d.width))
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-opacity", 0.5);

        svg.append("g")
            .selectAll("rect")
            .data(graph.nodes)
            .enter().append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", sankeyGenerator.nodeWidth())
            .attr("fill", "navy");

        svg.append("g")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("x", d => (d.x0 + d.x1) / 2)
            .attr("y", d => (d.y0 + d.y1) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => d.name);

    }, [modelData, images, classMap]); // Ensure these dependencies are correct

    return <svg ref={svgRef}></svg>;
};

function createSankeyData(modelData, images, classMap) {
    const nodes = [];
    const links = [];

    modelData.forEach(data => {
        const imageName = data.name;
        const imageClass = images[imageName];
        // Construct the image node name, including its mapped class for clarity
        const imageNode = findOrCreateNode(nodes, imageName + " (" + (classMap[imageClass]?.name || "Unknown") + ")");

        data.probabilities.forEach((prob, index) => {
            // Filter out very small probabilities; adjust this threshold as needed
            if (prob <= 1e-2) return;

            // Ensure class data exists for the given index (1-based index adjustment)
            const classInfo = classMap[index + 1];
            if (!classInfo) return;  // Skip if no class data available

            const classNode = findOrCreateNode(nodes, classInfo.name + " (Class " + (index + 1) + ")");
            links.push({
                source: imageNode.index,
                target: classNode.index,
                value: prob
            });
        });
    });

    return { nodes, links };
}

function findOrCreateNode(nodes, name) {
    let node = nodes.find(n => n.name === name);
    if (!node) {
        node = { name, index: nodes.length };
        nodes.push(node);
    }
    return node;
}




export default SankeyDiagram;
