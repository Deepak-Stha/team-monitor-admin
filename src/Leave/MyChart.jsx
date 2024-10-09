import React, { useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import chart.js, using 'chart.js/auto' for the latest version

function MyChartComponent() {
    useEffect(() => {
        // Your Chart.js code here
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['', '', '', '', '', '', '', '', ''],
                datasets: [{
                    label: 'No of employees',
                    data: [20000, 18000, 15000, 14000, 12000, 8000, 10000, 11000, 13000],
                    backgroundColor: 'rgba(255, 170, 41, 1)',
                    borderWidth: 0,
                    barThickness: 23,
                    barPercentage: 0.8,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) { return value / 1000 + 'k'; }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
            plugins: [{
                id: 'customLabels',
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach(function(dataset, i) {
                        const meta = chart.getDatasetMeta(i);
                        meta.data.forEach(function(bar, index) {
                            // Assuming you have already imported images properly
                            const img = images[index];
                            const x = bar.x - 15;
                            const y = chart.chartArea.bottom + 10;
                            ctx.drawImage(img, x, y, 30, 30);
                        });
                    });
                }
            }]
        });

        // Optionally return a cleanup function if needed
        return () => {
            myChart.destroy();
        };
    }, []); // Ensure empty dependency array to run only once

    return (
        <div>
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    );
}

export default MyChartComponent;
