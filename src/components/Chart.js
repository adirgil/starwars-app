import React from "react";
import Bar from "./Bar";

function Chart({ width, height, data, title }) {
  const maxBarHeight = 0.7;
  const maxPopulation = Math.max.apply(
    Math,
    data.map((d) => d.value)
  );
  const valueToPixel = maxPopulation / (height * maxBarHeight);
  const widthForSingleBar = (width / data.length) * 0.8;

  const divStyle = {
    height: `${height}px`,
    backgroundColor: "#ffbf00",
    display: "flex",
    justifyContent: "space-around",
    width: `${width}px`,
    alignItems: "end",
    fontSize: "2vh",
  };
  return (
    <>
      <p className="legend">
        <span className="title">{title}</span>
        <span className="best-title">Highest {title}</span>
      </p>
      <div id="chart-div" style={divStyle}>
        {data.map((singleData, index) => {
          return (
            <Bar
              key={index}
              name={singleData.name}
              value={singleData.value}
              height={singleData.value / valueToPixel}
              width={widthForSingleBar}
              color={singleData.value === maxPopulation ? "purple" : "black"}
            />
          );
        })}
      </div>
    </>
  );
}
export default Chart;
