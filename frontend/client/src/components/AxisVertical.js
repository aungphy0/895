import React, { useEffect, useState, useMemo } from "react";

const TICK_LENGTH = 3;

const AxisVertical = ({ yScale, pixelsPerTick, name }) => {
  const [classMap, setClassMap] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/classes")
      .then((response) => response.json())
      .then((data) => {
        const classes = data[0];
        const map = classes.reduce((acc, className, index) => {
          acc[index] = className; // Map each class name to its index
          return acc;
        }, {});
        setClassMap(map); // Set the classMap state with the constructed map
      })
      .catch((error) => console.error("Error fetching class names:", error));
  }, []);

  const range = yScale.range();
  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    return yScale.ticks(Math.floor(height / pixelsPerTick)).map(value => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale, pixelsPerTick, range]);

  return (
    <>
      <text
        x={0}
        y={-25}
        style={{ fontSize: "14px", textAnchor: "middle", fill: "black" }}
      >
        {name}
        {/* Tooltip displaying the class name */}
        <title>{classMap[name]}</title>
      </text>
      <line x1={0} x2={0} y1={range[0]} y2={range[1]} stroke="black" strokeWidth={0.5} />
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0,${yOffset})`} shapeRendering="crispEdges">
          <line x1={-TICK_LENGTH} x2={0} stroke="black" strokeWidth={0.5} />
          <text
            x={-10}
            dy="0.32em"
            style={{ fontSize: "10px", textAnchor: "end" }}
          >
            {value}
            {/* Optionally, you can also show tooltips for each tick value */}
            <title>{value}</title>
          </text>
        </g>
      ))}
    </>
  );
};

export default AxisVertical;
