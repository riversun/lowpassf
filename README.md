# Overview
lowpassf is simple lowpass filter libary for javascipt/node.js.
It can be used to smooth real-time data including high frequency noises.

This library provides 2 ways.
- Simple moving average
- Weighted moving average

It is licensed under [MIT license](https://opensource.org/licenses/MIT).

# Usage

```javascript
  var filter = new LowpassFilter();
  //Set average logic from ( filter.LinearWeightAverage/filter.SimpleAverage)
  filter.setLogic(filter.LinearWeightAverage);
	var data = [100, 100, 200, 200, 300, 300]
	var i;
	for (i = 0; i < data.length; i++) {
			//put current value
			filter.putValue(data[i]);
			//Get the latest calculated moving average of the values putted so far
			var filteredValue=filter.getFilteredValue();
		console.log(filteredValue);
	}
```

# Examples

Here is a simple example.
https://riversun.github.io/lowpassf/


## Run on node.js

You can import [library](https://www.npmjs.com/package/lowpassf) with npm.

**Install**

```
npm install --save-dev lowpassf
```

**app.js**

```javascript
var LowpassFilter = require('lowpassf');

var filter = new LowpassFilter();
//Set average logic from ( filter.LinearWeightAverage/filter.SimpleAverage)
filter.setLogic(filter.LinearWeightAverage);


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
```

**run on node.js**

```shell
node app.js
```

```
Prepare data...
data[0]=100
data[1]=100
data[2]=200
data[3]=200
data[4]=300
data[5]=300
Start filtering...
data[0]=100 added. current filtered val is 100
data[1]=100 added. current filtered val is 100
data[2]=200 added. current filtered val is 150
data[3]=200 added. current filtered val is 170
data[4]=300 added. current filtered val is 213.33333333333334
data[5]=300 added. current filtered val is 238.0952380952381
```


## Run on browser

```html

<!DOCTYPE html>
<html lang="en">
<body>
<script src="src/LowpassFilter.js"></script>
<script>
    console.log = function (s) {
        document.write(s + "<br>");
    }
    var filter = new LowpassFilter();
		//Set average logic from ( filter.LinearWeightAverage/filter.SimpleAverage)
    filter.setLogic(filter.LinearWeightAverage);
    var data = [100, 100, 200, 200, 300, 300]
    var i;
    var sampleRange = 20;

    for (i = 0; i < data.length; i++) {
        console.log("data[" + i + "]=" + data[i]);
    }
    //Specify how many items to buffer
    filter.setSamplingRange(sampleRange);
    for (i = 0; i < data.length; i++) {
        //put current value
        filter.putValue(data[i]);
        //Get the latest calculated moving average of the values putted so far
        var filteredValue=filter.getFilteredValue();
        var logStr = "data[" + i + "]=" + data[i] + " added. current filtered val is " +filteredValue;
        console.log(logStr);
    }
</script>
</body>
</html>
```
