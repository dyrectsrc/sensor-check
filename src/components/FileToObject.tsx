import { stringify } from "querystring";
import React, { useState } from "react";
import { std, mean, abs, forEach } from "mathjs";

const logFile = `reference 70.0 45.0 6
thermometer temp-1
2007-04-05T22:00 72.4
2007-04-05T22:01 76.0
2007-04-05T22:02 79.1
2007-04-05T22:03 75.6
2007-04-05T22:04 71.2
2007-04-05T22:05 71.4
2007-04-05T22:06 69.2
2007-04-05T22:07 65.2
2007-04-05T22:08 62.8
2007-04-05T22:09 61.4
2007-04-05T22:10 64.0
2007-04-05T22:11 67.5
2007-04-05T22:12 69.4
thermometer temp-2
2007-04-05T22:01 69.5
2007-04-05T22:02 70.1
2007-04-05T22:03 71.3
2007-04-05T22:04 71.5
2007-04-05T22:05 69.8
humidity hum-1
2007-04-05T22:04 45.2
2007-04-05T22:05 45.3
2007-04-05T22:06 45.1
humidity hum-2
2007-04-05T22:04 44.4
2007-04-05T22:05 43.9
2007-04-05T22:06 44.9
2007-04-05T22:07 43.8
2007-04-05T22:08 42.1
monoxide mon-1
2007-04-05T22:04 5
2007-04-05T22:05 7
2007-04-05T22:06 9
monoxide mon-2
2007-04-05T22:04 2
2007-04-05T22:05 4
2007-04-05T22:06 10
2007-04-05T22:07 8
2007-04-05T22:08 6`;

const FileToObject = () => {
  //Hold reference object
  let reference: { thermometer: string; humidity: string; monoxide: string };

  //Get standard deviation by passing array of numbers
  const stdDeviation = (arr: Array<number>) => {
    return std(arr);
  };

  //Get the average by passing an array of numbers
  const meanFromReadings = (arr: Array<number>) => {
    return mean(arr);
  };

  //Make array of objects from logfile
  const evaluateLogFile = (logContentStr: string) => {
    let textArray = logContentStr.split("\n");
    let textArrayObj: any = [];
    let currentIndex: number = 0;

    textArray.forEach((line: any, index) => {
      if (line.includes("reference")) {
        let referenceLine = line.split(" ");
        reference = {
          thermometer: referenceLine[1],
          humidity: referenceLine[2],
          monoxide: referenceLine[3],
        };
        console.log("reference", reference);
      }
      //Todo: Write function to get sensor name, type, and readings by passing in sensor type parameter.
      if (line.includes("thermometer")) {
        currentIndex = index;
        textArrayObj[index] = {
          name: line.match(/(?<=thermometer ).*/g)[0],
          type: "Thermometer",
          reference: reference.thermometer,
          readings: [],
        };
      }
      if (line.includes("humidity")) {
        currentIndex = index;
        textArrayObj[index] = {
          name: line.match(/(?<=humidity ).*/g)[0],
          type: "Humidity",
          reference: reference.humidity,
          readings: [],
        };
      }
      if (line.includes("monoxide")) {
        currentIndex = index;
        textArrayObj[index] = {
          name: line.match(/(?<=monoxide ).*/g)[0],
          type: "Monoxide",
          reference: reference.monoxide,
          readings: [],
        };
      }
      if (line.includes(line.match(/[0-9]+\.[0-9]/gm))) {
        textArrayObj[currentIndex].readings.push(
          parseFloat(line.match(/[0-9]+\.[0-9]/gm)[0])
        );
      }
      if (
        line.includes(line.match(/( [0-9]|10)/gm)) &&
        textArrayObj[currentIndex].type.includes("Monoxide")
      ) {
        textArrayObj[currentIndex].readings.push(
          line.match(/( [0-9]|10)$/gm)[0]
        );
      }
    });
    return textArrayObj;
  };

  //Make calculations and add sensor check properties to array of sensor objects.
  const sensorObjWithStatus = (arrayOfSensorObj: any) => {
    arrayOfSensorObj.map((sensor: any) => {
      if (sensor.type == "Thermometer") {
        sensor.mean = meanFromReadings(sensor.readings);
        sensor.std_deviation = stdDeviation(sensor.readings);
        if (
          sensor.std_deviation < 3 &&
          abs(meanFromReadings(sensor.readings) - sensor.reference) < 5
        ) {
          sensor.status = "Ultra Precise";
        } else if (
          sensor.std_deviation < 5 &&
          abs(meanFromReadings(sensor.readings) - sensor.reference) < 5
        ) {
          sensor.status = "Very Precise";
        } else {
          sensor.status = "Precise";
        }
      }
      if (sensor.type == "Humidity") {
        forEach(sensor.readings, function (value) {
          if (abs(value - sensor.reference) > 1) {
            sensor.status = "Discard";
          } else {
            sensor.status = "Keep";
          }
        });
      }
      if (sensor.type == "Monoxide") {
        forEach(sensor.readings, function (value) {
          if (
            abs(value - sensor.reference) > 3 ||
            abs(value - sensor.reference) < 3
          ) {
            sensor.status = "Discard";
          } else {
            sensor.status = "Keep";
          }
        });
      }
    });
    return arrayOfSensorObj;
  };
  let logArrayObj = evaluateLogFile(logFile);
  let sensorObj = sensorObjWithStatus(logArrayObj);

  return { sensorObj };
};

export default FileToObject;
