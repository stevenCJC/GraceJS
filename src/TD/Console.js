define([],
function () {


    //负责控制台输出的表现
    function Console(a) {
        this.flows = {};
    }


    Console.prototype = {

        constructor: Console,

        push: function (flow, point) {
            var flow = this.flows[flow] = this.flows[flow] || [];

            flow.push(point);

        },

        flush: function () {

        },

        refresh: function () {
            this.clear();
            this.flush();
        },

        clear: function () {

        },


    };





})