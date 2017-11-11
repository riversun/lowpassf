var LowpassFilter = require('../../src/LowpassFilter');
console.log = function (s) {
    document.write(s + "<br>");
}
var filter = new LowpassFilter();

//Set average logic from (  filter.LinearWeightAverage/ filter.SimpleAverage)
filter.setLogic(filter.LinearWeightAverage);
//filter.setLogic(filter.SimpleAverage);

var data = [100, 100, 200, 200, 300, 300]
var i;
var sampleRange = 20;
console.log("Prepare data...");
for (i = 0; i < data.length; i++) {
    console.log("data[" + i + "]=" + data[i]);
}

console.log("");
console.log("Start filtering...");

//Specify how many items to buffer
filter.setSamplingRange(sampleRange);


for (i = 0; i < data.length; i++) {

    //put current value
    filter.putValue(data[i]);

    //get current "filtered" value
    //Get the latest calculated moving average of the values putted so far
    var filteredValue = filter.getFilteredValue();

    var logStr = "data[" + i + "]=" + data[i]
        + " added. current filtered val is "
        + filteredValue;

    console.log(logStr);

}