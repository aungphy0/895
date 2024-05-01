// FamilyTree.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const FamilyTree = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        d3.select(svgRef.current).selectAll('*').remove();

        const root = d3.stratify()
            .id(d => d.child)
            .parentId(d => d.parent)(data);

        const width = 800;
        const height = 600;
        const margin = { top: 40, right: 120, bottom: 20, left: 100 };

        const tree = d3.tree()
            .size([height, width - 160]);

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const treeData = tree(root);

        const link = svg.selectAll('.link')
            .data(treeData.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        const node = svg.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        node.append('circle')
            .attr('r', 10);

        node.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children ? -13 : 13)
            .style('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.child);
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default FamilyTree;
