import React, { useState } from "react";
import axios from "axios";
import "./Home.css";
import Chart from "../components/Chart";

function Home() {
  const [bestVehicle, setBestVehicle] = useState({});
  const [planetsPopulation, setPlanetsPopulation] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [chartLoader, setChartLoader] = useState(false);

  const getAllPlanetsAndPopulationForChart = async () => {
    const planets = await axios.get(`https://swapi.dev/api/planets`);
    let data = planets.data;
    let allPlanets = [];
    do {
      allPlanets = [...allPlanets, ...data.results];
      const nextPage = data.next;
      let res = await axios.get(`${nextPage}`);
      data = res.data;
      if (!data.next) {
        allPlanets = [...allPlanets, ...data.results];
      }
    } while (data.next);
    const filterByPlanets = allPlanets.filter((planet) =>
      ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"].includes(planet.name)
    );
    const getOnlyPopulationAndNames = filterByPlanets.map((planet) => {
      return { name: planet.name, value: parseInt(planet.population) };
    });
    setPlanetsPopulation(getOnlyPopulationAndNames);
    setChartLoader(false);
  };

  const getBestVehicleAndPlanets = async () => {
    setTableLoader(true);
    setChartLoader(true);
    const vehicles = await axios.get(`https://swapi.dev/api/vehicles`);
    let data = vehicles.data;
    let allVehicles = [];
    do {
      allVehicles = [...allVehicles, ...data.results];
      const nextPage = data.next;
      let res = await axios.get(`${nextPage}`);
      data = res.data;
      if (!data.next) {
        allVehicles = [...allVehicles, ...data.results];
      }
    } while (data.next);

    const vehiclesWithPilots = allVehicles.filter(
      (vehicle) => vehicle.pilots.length
    );
    let max = 0;
    let bestVehicle = {};
    for (const vehicle of vehiclesWithPilots) {
      let sum = 0;
      vehicle.planetsNamesStringForTable = "";
      vehicle.pilotsNamesStringForTable = "";
      for (const pilot of vehicle.pilots) {
        let pilotData = await axios.get(`${pilot}`);
        if (pilotData.data && pilotData.data.homeworld) {
          let planet = await axios.get(`${pilotData.data.homeworld}`);
          const planetData = planet.data;
          if (planetData && planetData.population) {
            sum += parseInt(planetData.population);
            vehicle.planetsNamesStringForTable = `${vehicle.planetsNamesStringForTable} ${planetData.name} : ${planetData.population}`;
            vehicle.pilotsNamesStringForTable = `${vehicle.pilotsNamesStringForTable} ${pilotData.data.name}`;
          }
        }
      }
      if (sum > max) {
        max = sum;
        bestVehicle = vehicle;
      }
    }
    setBestVehicle(bestVehicle);
    setTableLoader(false);
    getAllPlanetsAndPopulationForChart();
  };

  const renderTable = () => {
    if (tableLoader) {
      return <div className="loader">Loading...</div>;
    }

    return (
      <table className="styled-table">
        <tbody>
          <tr className="active-row">
            <td>Vehicle name with largest sum</td>
            <td>{bestVehicle.name || "-----"}</td>
          </tr>
          <tr>
            <td>Related home planets and their respective population</td>
            <td>{bestVehicle.planetsNamesStringForTable || "-----"}</td>
          </tr>
          <tr>
            <td>Related pilot names</td>
            <td>{bestVehicle.pilotsNamesStringForTable || "-----"}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderChart = () => {
    if (chartLoader) {
      return <div className="loader">Loading...</div>;
    }
    //data To send to the chart
    const chartHeight = 400;
    const chartWidth = 500;
    const title = "Population";
    return (
      <Chart
        height={chartHeight}
        width={chartWidth}
        data={planetsPopulation}
        title={title}
      />
    );
  };

  return (
    <div id="home">
      <button className="button-20" onClick={getBestVehicleAndPlanets}>
        Get the vehicle with the most popoultion for its pilots homeplanets and
        data for Chart
      </button>
      {renderTable()}
      {renderChart()}
    </div>
  );
}
export default Home;
