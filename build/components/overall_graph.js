"use strict";

var overall_graph;
$(function () {
  overall_graph = new Chart(document.getElementById("overall_graph"), {
    "type": "line",
    "data": {
      "labels": [],
      "datasets": [{
        "label": "Cup history",
        "data": [],
        "fill": true,
        "borderColor": "rgb(75, 192, 192)",
        "lineTension": 0.2
      }]
    },
    "options": {}
  });
});