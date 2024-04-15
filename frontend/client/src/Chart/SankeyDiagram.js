import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import './chart.css';

const SankeyDiagram = ({ images, classMap, modelData }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const width = 1200;
        const height = 800; // Adjusted height to a more standard value
        const svg = d3.select(svgRef.current)
            .attr('class', 'sankey-diagram')
            .attr('width', width)
            .attr('height', height)
            .html('');

        const { nodes, links } = createSankeyData(modelData, images, classMap);

        const sankeyGenerator = sankey()
            .nodeWidth(36)
            .nodePadding(20) // Adjusted node padding for better spacing
            .extent([[1, 1], [width - 1, height - 1]]); // Adjusted extent to fit within SVG

        const graph = sankeyGenerator({
            nodes: nodes.map(d => ({ ...d })),
            links: links.map(d => ({ ...d }))
        });

        // Draw links
        svg.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke-width", d => Math.max(1, d.width))
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-opacity", 0.5)
            .on("click", (event, clickedLink) => {
                console.log("Clicked link:", clickedLink);
            })
            .classed("link", true);

        // Draw nodes
        const node = svg.append("g")
            .selectAll("rect")
            .data(graph.nodes)
            .enter().append("rect")
            .attr("class", "node")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", sankeyGenerator.nodeWidth())
            .attr("fill", "navy")
            .on("click", (event, clickedNode) => {
                console.log("Clicked node:", clickedNode.name);
            });

        // Add node titles
        svg.append("g")
            .attr("class", "node-titles")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("x", d => (d.x0 + d.x1) / 2)
            .attr("y", d => (d.y0 + d.y1) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => d.name)
            .attr("class", "node-title")
            .style("pointer-events", "none"); // Prevent text from capturing click events

    }, [modelData, images, classMap]);

    return <svg ref={svgRef}></svg>;
};

function createSankeyData(modelData, images, classMap) {
    const nodes = [];
    const links = [];

    modelData.forEach(data => {
        const imageName = data.name;
        const imageClass = images[imageName];
        const imageNode = findOrCreateNode(nodes, imageName);

        data.probabilities.forEach((prob, index) => {
            if (prob <= 1e-2) return;

            const classInfo = classMap[index + 1];
            if (!classInfo) return;

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
