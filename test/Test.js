var LowpassFilter = require('./lib/LowpassFilter');

//export the module
module.exports = LowpassFilter;

var lp = new LowpassFilter();

var data = [100, 100, 200, 200]
var sampleRange = 20;


lp.setSamplingRange(sampleRange);

for (var i = 0; i < data.length; i++) {

    lp.putValue(data[i]);
    console.log(data[i] + " added. current filtered val is " + lp.getFilteredValue());

}