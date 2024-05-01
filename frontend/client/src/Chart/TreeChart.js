import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './TreeChart.css';

const TreeChart = ({ treeData }) => {
  const ref = useRef();

  useEffect(() => {
    if (treeData) {
        console.log(treeData);
      const hierarchyData = buildHierarchy(treeData);
      if (hierarchyData) {
        drawTree(hierarchyData);
      }
    }
  }, [treeData]);

  const buildHierarchy = (flatData) => {
    const nodes = new Map();

    // First, create all nodes and add them to the map.
    flatData.forEach(item => {
        if (!nodes.has(item.child)) {
            nodes.set(item.child, { ...item, children: [] });
        }
    });

    // Now, link all nodes to their parents.
    let root = null;
    flatData.forEach(item => {
        if (item.parent) {
            if (!nodes.has(item.parent)) {
                nodes.set(item.parent, { child: item.parent, children: [] });
            }
            const parent = nodes.get(item.parent);
            const child = nodes.get(item.child);
            parent.children.push(child);
        } else {
            // This is potentially a root node as it has no parent.
            root = nodes.get(item.child);
        }
    });

    // In case there are multiple entries without a parent, we need to handle that:
    // If root is still null, we'll find the first node without a parent reference in the dataset.
    if (!root) {
        root = [...nodes.values()].find(node => !flatData.some(item => item.child === node.parent));
    }

    return root;
};

  const drawTree = (rootData) => {
    const margin = { top: 50, right: 120, bottom: 50, left: 120 };
    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('viewBox', [-margin.left, -margin.top, width + margin.left + margin.right, height + margin.top + margin.bottom])
      .style("max-width", "100%")
      .style("height", "auto");

    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().size([width, height]);  // Adjust dimensions for top-to-bottom layout
    treeLayout(root);

    g.selectAll(".link")
      .data(root.links())
      .join('path')
      .attr("class", "link")
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y))  // Adjust path for vertical layout
      .attr('stroke', '#ccc');

    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .join('g')
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)  // Adjust positioning for vertical layout
      .on('click', (event, d) => highlightPath(d, root, g));

    nodes.append('circle')
      .attr('r', 10)
      .attr('fill', '#fff')
      .attr('stroke', 'steelblue');

    nodes.append('text')
      .attr('dy', '0.35em')
      .attr('x', d => d.children ? -15 : 15)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.child);
  };

  const highlightPath = (node, root, g) => {
    const ancestors = node.ancestors();
    g.selectAll('.link')
      .style('stroke', d => ancestors.includes(d.target) ? 'red' : '#ccc');
    g.selectAll('.node circle')
      .style('fill', d => ancestors.includes(d) ? 'red' : '#fff');
  };

  return <svg ref={ref} className="tree-chart"></svg>;
};

export default TreeChart;
