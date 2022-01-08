import React from "react";

function Bar({ height, name, value, color, width }) {
  const divStyle = {
    height: `${height}px`,
    width: `${width}px`,
    backgroundColor: `${color}`,
  };

  const numberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className="bar-div">
      <label>{numberWithCommas(value)}</label>
      <div style={divStyle}></div>
      <label>{name}</label>
    </div>
  );
}
export default Bar;
