'use strict';

var weekly_graph;
$(function () {
    weekly_graph = new Chart(document.getElementById("weekly_graph").getContext('2d'), {
        type: 'bar',
        data: {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [{
                label: 'Water amount per day (mL)',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: ['rgba(255, 0, 0, 0.4)', 'rgba(255, 206, 86, 0.4)', 'rgba(232, 117, 255, 0.4)', 'rgba(145, 210, 7, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(120, 0, 255, 0.4)'],
                borderColor: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});