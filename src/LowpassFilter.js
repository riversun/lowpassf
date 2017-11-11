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