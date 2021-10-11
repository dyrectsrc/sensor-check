import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import SensorsList from "./components/SensorList/SensorsList";
import { createSecureContext } from "tls";
import FileToObject from "./components/FileToObject";

function App() {
  const { sensorObj } = FileToObject();

  useEffect(() => {
    console.log(sensorObj);
  }, []);

  return (
    <div className="App">
      <h1>Status Of Sensors</h1>
      <SensorsList sensors={sensorObj} />
    </div>
  );
}

export default App;
