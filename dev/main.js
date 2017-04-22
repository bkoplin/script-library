/*jshint esversion: 6 */
var d3 = require('d3'),
    _ = require('lodash'),
    ko = require('knockout'),
    $ = require('jquery'),
    math = require('mathjs'),
    topojson = require('topojson-client'),
    numeral = require('numeral'),
    chroma = require('chroma-js'),
    us = window.us || {};
require('supergroup');
require('knockout-punches');
require('d3-textwrap');
require('jquery-awesome-cursor');
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
ko.punches.enableAll();
//A function that notifies its parent of a change:
ko.dirtyFlag = function (root, isInitiallyDirty) {
    var result = function () {},
        _initialState = ko.observable(ko.toJSON(root)),
        _isInitiallyDirty = ko.observable(isInitiallyDirty);
    result.isDirty = ko.computed(function () {
        return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
    });
    result.reset = function () {
        _initialState(ko.toJSON(root));
        _isInitiallyDirty(false);
    };
    return result;
};
//an observable that retrieves its value when first bound
ko.extenders.logChange = function (target, option) {
    target.subscribe(function (newValue) {
        var resultText = _.attempt(function (observable) {
            return ko.toJSON(observable, null, 2);
        }, newValue);
        if (_.isError(resultText)) console.log(option + ": ", ko.toJS(newValue));
        else console.log(option + ": " + resultText);
    });
    return target;
};
ko.observable.fn.toString = function () {
    var obsObj = this();
    var logObj = _.attempt(ko.toJSON(obsObj, null, 2));
    return "observable: " + _.isError(logObj) ? obsObj : ko.toJSON(obsObj, null, 2);
};
ko.computed.fn.toString = function () {
    var obsObj = this();
    var logObj = _.attempt(ko.toJSON(obsObj, null, 2));
    return "computed: " + _.isError(logObj) ? obsObj : ko.toJSON(obsObj, null, 2);
};
d3.json("https://d3js.org/us-10m.v1.json", function (error, us) {
    if (error) throw error;
    window.us = us;
});
module.exports = function () {
    return {
        us: us,
        chroma: chroma,
        numeral: numeral,
        topojson: topojson,
        math: math,
        $: $,
        ko: ko,
        _: _,
        d3: d3
    };
};
