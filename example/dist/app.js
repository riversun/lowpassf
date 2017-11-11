(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../../src/LowpassFilter":2}],2:[function(require,module,exports){
var LowpassFilter = (function () {

        /**
         * Calculate Simple Moving Average
         * @param params
         * @constructor
         */
        function LowpassFilter(params) {
            this.mSamplingRange = 0;
            this.mSamplingBuffer = [];
            this.mCurrentFilterVal = 0;
            this.mCurrentDataNumber = 0;
            this.setSamplingRange(20);

            //set linear weight moving average logic as default
            this.calcLogic = this.LinearWeightAverage;
            //this.calcLogic = this.SimpleAverage;
        }

        LowpassFilter.prototype.setLogic = function (func) {
            var _this = this;
            _this.calcLogic = func;
        };

        LowpassFilter.prototype.LinearWeightAverage = function (numerator, range, n, samplingBuffer, denominator) {
            numerator += (range - n) * samplingBuffer[n];
            denominator += (range - n);
            return {numerator: numerator, denominator: denominator};
        };

        LowpassFilter.prototype.SimpleAverage = function (numerator, range, n, samplingBuffer, denominator) {
            numerator += samplingBuffer[n];
            denominator = range;
            return {numerator: numerator, denominator: denominator};
        };

        /**
         * Set sampling range(DEFAULT is 20)
         * @param range
         */
        LowpassFilter.prototype.setSamplingRange = function (range) {
            var _this = this;
            _this.mSamplingRange = range;
            _this.mSamplingBuffer = new Array(_this.mSamplingRange);
        };

        /**
         * Returns total count
         * @param range
         * @returns {number}
         */
        LowpassFilter.prototype.getTotalCount = function (range) {
            var _this = this;
            return _this.mCurrentDataNumber;
        };

        /**
         * Get the latest filtered(linear weighted) value
         *
         * @return
         */
        LowpassFilter.prototype.getFilteredValue = function () {
            var _this = this;
            var filteredVal = _this.mCurrentFilterVal;
            return filteredVal;
        };

        /**
         * Put the current value to filter
         *
         * @param val
         */
        LowpassFilter.prototype.putValue = function (val) {
            var _this = this;
            _this.mCurrentFilterVal = _this.filter(val, _this.mSamplingBuffer);
        };

        /**
         * Get raw buffer
         * @returns {Array}
         */
        LowpassFilter.prototype.getSampingBuffer = function () {
            var _this = this;
            return _this.mSamplingBuffer;
        };

        /**
         * Get sampling range you specified
         * @returns {number|*}
         */
        LowpassFilter.prototype.getSamplingRange = function () {
            var _this = this;
            return _this.mSamplingRange;
        };

        /**
         * Fill out buffer by specified value
         * @param val
         */
        LowpassFilter.prototype.fillValue = function (val) {
            var _this = this;
            for (var i = 0; i < _this.mSamplingBuffer.length; i++) {
                _this.mSamplingBuffer[i] = val;
            }
        };


        /**
         * Do filter
         * @param inputValue the latest(current) value
         * @param samplingBuffer
         * @returns {number}
         */
        LowpassFilter.prototype.filter = function (inputValue, samplingBuffer) {
            var _this = this;

            _this.mCurrentDataNumber++;

            var range = samplingBuffer.length;

            if (_this.mCurrentDataNumber < range) {
                range = _this.mCurrentDataNumber;
            }

            for (var i = (range - 1) - 1; i >= 0; i--) {
                // copy next element to prev element
                samplingBuffer[i + 1] = samplingBuffer[i];
            }

            // Add current value to last
            samplingBuffer[0] = inputValue;

            var numerator = 0;

            var denominator = 0;

            for (var n = 0; n < range; n++) {

                var result = _this.calcLogic(numerator, range, n, samplingBuffer, denominator);
                numerator = result.numerator;
                denominator = result.denominator;

            }

            var currentOutputVal = numerator / denominator;

            return currentOutputVal;

        };

        return LowpassFilter;
    }()
);

if (typeof(module) !== "undefined") {
    module.exports = LowpassFilter;
}
},{}]},{},[1]);
