(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./lib/LowpassFilter":2}],2:[function(require,module,exports){
module.exports = (function () {

        function LowpassFilter(params) {
            this.mSamplingRange = 0;
            this.mSamplingBuffer = [];
            this.mCurrentFilterVal = 0;
            this.mCurrentDataNumber = 0;
            this.setSamplingRange(20);
        }

        LowpassFilter.prototype.setSamplingRange = function (range) {
            var _this = this;
            _this.mSamplingRange = range;
            _this.mSamplingBuffer = new Array(_this.mSamplingRange);
        };

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

        LowpassFilter.prototype.getSampingBuffer = function () {
            var _this = this;
            return _this.mSamplingBuffer;
        };

        LowpassFilter.prototype.getSamplingRange = function () {
            var _this = this;
            return _this.mSamplingRange;
        };

        LowpassFilter.prototype.fillValue = function (val) {
            var _this = this;
            for (var i = 0; i < _this.mSamplingBuffer.length; i++) {
                _this.mSamplingBuffer[i] = val;
            }
        };

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

                if (false) {
                    // weight linearly
                    numerator += (range - n) * samplingBuffer[n];
                    denominator += (range - n);
                }

                if (true) {
                    //weight simply
                    numerator += samplingBuffer[n];
                    denominator = range;// (range - n);
                }
            }

            var currentOutputVal = numerator / denominator;

            return currentOutputVal;

        };

        return LowpassFilter;
    }()
);
},{}]},{},[1]);
