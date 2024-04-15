import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './circle.css';

const CircleSankey = ({ images, classMap, modelData }) => {
    const svgRef = useRef(null);
    const [activeNode, setActiveNode] = useState(null);
    const [threshold, setThreshold] = useState(0.01);
    const [radiusImages, setRadiusImages] = useState(200);
    const [radiusClasses, setRadiusClasses] = useState(500);
    const [tooltip, setTooltip] = useState({ display: false, content: "", x: 0, y: 0 });

    useEffect(() => {
        const width = 1200;
        const height = 1200;
        const svg = d3.select(svgRef.current)
            .attr('class', 'circle-sankey-diagram')
            .attr('width', width)
            .attr('height', height)
            .html('');

        const { nodes, links } = createSankeyData(modelData, images, classMap, radiusImages, radiusClasses, width, height, threshold);

        const linkLayer = svg.append("g").attr("class", "links");
        const nodeLayer = svg.append("g").attr("class", "nodes");

        linkLayer.selectAll("path")
            .data(links)
            .enter().append("path")
            .attr("d", d => `M${d.source.x},${d.source.y} Q${width / 2},${height / 2} ${d.target.x},${d.target.y}`)
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", 2);

        nodeLayer.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", d => d.type === 'image' ? "navy" : "red")
            .on("click", (event, d) => {
                setActiveNode(d);
            })
            .on("mouseover", function(event, d) {
                setTooltip({ display: true, content: d.name, x: event.pageX + 10, y: event.pageY + 10 });
                d3.select(this).transition().duration(200).attr("r", 10);
            })
            .on("mouseout", function(event, d) {
                setTooltip({ display: false, content: "", x: 0, y: 0 });
                d3.select(this).transition().duration(200).attr("r", 5);
            });
    }, [images, classMap, modelData, threshold, radiusImages, radiusClasses]);

    return (
        <div>
            <div className="controls">
                <label>
                    Threshold:
                    <input type="range" min="0.01" max="1" step="0.01" value={threshold}
                        onChange={e => setThreshold(parseFloat(e.target.value))} />
                </label>
                <label>
                    Radius Images:
                    <input type="range" min="100" max="300" step="10" value={radiusImages}
                        onChange={e => setRadiusImages(parseInt(e.target.value))} />
                </label>
                <label>
                    Radius Classes:
                    <input type="range" min="400" max="600" step="10" value={radiusClasses}
                        onChange={e => setRadiusClasses(parseInt(e.target.value))} />
                </label>
                <label>
                    Dataset Folder:
                    <input type="text" placeholder="Enter dataset folder path" />
                </label>
                <label>
                    Model JSON File:
                    <input type="text" placeholder="Enter model JSON file path" />
                </label>
            </div>
            <svg ref={svgRef}></svg>
            {tooltip.display && 
                <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y, opacity: 1 }}>
                    {tooltip.content}
                </div>
            }
        </div>
    );
};



function createSankeyData(modelData, images, classMap, radiusImages, radiusClasses, width, height, threshold) {
    const nodes = [];
    const links = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Create image nodes
    modelData.forEach((data, index) => {
        const angle = (index / modelData.length) * 2 * Math.PI;
        nodes.push({
            name: data.name,
            x: centerX + radiusImages * Math.cos(angle),
            y: centerY + radiusImages * Math.sin(angle),
            type: 'image'
        });
    });

    // Create class nodes
    Object.keys(classMap).forEach((key, index) => {
        const angle = (index / Object.keys(classMap).length) * 2 * Math.PI;
        nodes.push({
            name: classMap[key].name,
            x: centerX + radiusClasses * Math.cos(angle),
            y: centerY + radiusClasses * Math.sin(angle),
            type: 'class'
        });
    });

    // Create links with threshold filtering
    modelData.forEach(data => {
        const imageNode = nodes.find(n => n.name === data.name);
        data.probabilities.forEach((prob, index) => {
            if (prob <= threshold) return;
            const classNode = nodes.find(n => n.name === classMap[index + 1]?.name);
            if (!classNode) return;
            links.push({
                source: imageNode,
                target: classNode,
                value: prob
            });
        });
    });

    return { nodes, links };
}

export default CircleSankey;
