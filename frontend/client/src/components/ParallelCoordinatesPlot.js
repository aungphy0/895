import * as d3 from 'd3';
import AxisVertical from './AxisVertical';
import { useEffect, useState } from 'react';

const MARGIN = { top: 60, right: 40, bottom: 30, left: 250 };

const ParallelCoordinatePlot = ({data, width, height, FROM_VARIABLES, TO_VARIABLES, img, setImg }) => {



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


  const [imgUrl, setImgUrl] = useState();

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
    

                                                                    //(d) => {console.log("clicked",
    return <path key={i} d={d} stroke="skyblue" fill="none" onClick={(d) => { setImgUrl(series["name"]); setImg(imgUrl); console.log(imgUrl); }}
                                                                    //  data[d['target']['__reactFiber$apr8x9io4sm']['alternate']['index']]['name']}
    />;
  });

  // Compute Axes
  const allAxes = variables.map((variable, i) => {
    const yScale = yScales[variable];
    return (
      <g key={i} transform={"translate(" + xScale(variable) + ",0)"}>
        <AxisVertical yScale={yScale} pixelsPerTick={40} name={variable} />
      </g>
    );
  });

  return (
    <svg width={width} height={height}>
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

export default ParallelCoordinatePlot;