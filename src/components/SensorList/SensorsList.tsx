import React from "react";
import "./SensorList.scss";

const SensorsList = (props: { sensors: any[] }) => {
  return (
    <div className="sensor-list-wrap">
      <h2>Sensor Check</h2>
      <div className="sensor-list">
        {props.sensors.map((sensor) => {
          return (
            <div className="sensor-card">
              <h3>Type: {sensor.type}</h3>
              <h4 className="name">Name: {sensor.name}</h4>
              <h3 className={sensor.status == "Discard" ? "discard" : "status"}>
                Status: {sensor.status}
              </h3>
              <h4>Reference: {sensor.reference}</h4>
              <p className="readings">
                <strong>Readings:</strong>
                <br /> {` ${sensor.readings} `}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorsList;
