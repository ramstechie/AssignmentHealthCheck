"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var luxon_1 = require("luxon");
// Read data from heartrate.json
var rawData = JSON.parse(fs.readFileSync('heartrate.json', 'utf8'));
// Process the data and calculate statistics
var outputData = [];
for (var _i = 0, rawData_1 = rawData; _i < rawData_1.length; _i++) {
    var measurement = rawData_1[_i];
    var bpm = measurement.beatsPerMinute;
    var startDateTime = luxon_1.DateTime.fromISO(measurement.timestamps.startTime);
    var endDateTime = luxon_1.DateTime.fromISO(measurement.timestamps.endTime);
    // Extract date
    var date = startDateTime.toISODate();
    // Calculate statistics
    var minBpm = Math.min.apply(Math, bpmValues);
    var maxBpm = Math.max.apply(Math, bpmValues);
    var medianBpm = calculateMedian(bpmValues);
    // Function to calculate median
    function calculateMedian(values) {
        var sortedValues = values.sort(function (a, b) { return a - b; });
        var length = sortedValues.length;
        if (length % 2 === 0) {
            var middle = length / 2;
            return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
        }
        else {
            var middle = Math.floor(length / 2);
            return sortedValues[middle];
        }
    }
    var latestDataTimestamp = measurement.timestamps.endTime;
    // Format the output
    var outputEntry = {
        date: date,
        min: minBpm,
        max: maxBpm,
        median: medianBpm,
        latestDataTimestamp: latestDataTimestamp,
    };
    outputData.push(outputEntry);
}
// Write the output to output.json
fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));
console.log('Output successfully written to output.json');
