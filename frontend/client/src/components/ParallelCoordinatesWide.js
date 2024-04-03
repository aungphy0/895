import {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import AxisVerticalWide from './AxisVerticalWide';

const MARGIN = { top: 60, right: 40, bottom: 30, left: 250 };

const ParallelCoordinateWide = ({data, width, height, FROM_VARIABLES, TO_VARIABLES, START, END}) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  // const variables = Array.from({length: VARIABLES}, (_, index) => index); //Creates an array from 0 to VARIABLES
  const v = Array.from({length: TO_VARIABLES}, (_, index) => index);
  const variables = v.slice(FROM_VARIABLES, TO_VARIABLES + 1);

  // Compute a xScale: spread all Y axis along the chart width
  const xScale = d3
    .scalePoint()
    .range([0, boundsWidth])
    .domain(variables)
    .padding(0);

  // Compute the yScales: 1 scale per variable
  let yScales = {};
  variables.forEach((variable) => {
    yScales[variable] = d3
      .scaleLinear()
      .range([boundsHeight, 0])
      .domain([0, 1]);
  });

  // Compute lines
  const lineGenerator = d3.line();

  const allLines = data.map((series, i) => {
    const allCoordinates = variables.map((variable) => {
      const yScale = yScales[variable];
      const x = xScale(variable) ?? 0;
      const y = yScale(series["probabilities"][variable.toString()]);
      const coordinate = [x, y];
      return coordinate;
    });

    const d = lineGenerator(allCoordinates);

    if (!d) {
      return <></>;
    }

    return <path key={i} d={d} stroke="skyblue" fill="none" />;
  });

  // Compute Axes
  const allAxes = variables.map((variable, i) => {
    const yScale = yScales[variable];
    return (
      <g key={i} transform={"translate(" + xScale(variable) + ",0)"}>
        <AxisVerticalWide yScale={yScale} pixelsPerTick={40} name={variable} />
      </g>
    );
  });

  const svgRef = useRef(null);
  const [rectX, setRectX] = useState(MARGIN.left + START);

  useEffect( () => {
    
    
    const svg = d3.select(svgRef.current);

    const rectWidth = 31;
    const rectHeight = 80;
    // const rectX = 250 + START;
    const rectY = 50;

    svg.selectAll('#myRect').remove();

    svg.append('rect')
       .attr('id', 'myRect')
       .attr('y', rectY)
       .attr('width', rectWidth)
       .attr('height', rectHeight)
       .attr('fill', 'grey')
       .attr('opacity', 0.5)
       .attr('x', rectX);
    // svg.select('#myRect')
    //    .attr('x', rectX)

  }, [rectX]);

  const handleRangeChange = () => {
    setRectX(MARGIN.left + (START * 1.51));
    console.log(START);
  };

  
  return (
    <svg ref={svgRef} onClick={handleRangeChange} width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allLines}
        {allAxes}
      </g>
    </svg>
  );
}

export default ParallelCoordinateWide;


