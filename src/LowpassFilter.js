/*
 *  Copyright (c) 2010-2017 Tom Misawa(riversun.org@gmail.com)
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *  copy of this software and associated documentation files (the "Software"),
 *  to deal in the Software without restriction, including without limitation
 *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *  DEALINGS IN THE SOFTWARE.
 *  
 */
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