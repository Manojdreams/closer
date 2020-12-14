(function(window, document, $, undefined) {

    $(function() {
		
        var options = {
            chart: {
                height: 220,
                type: 'donut',
            },
			grid: {
				padding: {
					left: 0,
					right: 0
				}
			},
			dataLabels: {
				enabled: false,
			},
			plotOptions: {
				pie: {
					customScale: 1,
					offsetX: 0,
					offsetY: 0,
					donut: {
					//size: '75%',
				},
					offsetY: 20,
				},
				stroke: {
					colors: undefined
				}
			},
			colors:['#7467F0', '#FFA550', '#EA6061'],
            series: [55, 18, 27],
			labels: ['Completed', 'Pending', 'Cancel'],
			legend: {
				show: false
			}
        }

       var chart = new ApexCharts(
            document.querySelector("#chart1"),
            options
        );
        
        chart.render();
		
        var options = {
            chart: {
                height: 220,
                type: 'donut',
            },
			grid: {
				padding: {
					left: 0,
					right: 0
				}
			},
			dataLabels: {
				enabled: false,
			},
			plotOptions: {
				pie: {
					customScale: 1,
					donut: {
					//size: '75%',
				},
					offsetY: 20,
				},
				stroke: {
					colors: undefined
				}
			},
			colors:['#7467F0', '#FFA550', '#EA6061'],
            series: [55, 18, 27],
			labels: ['Completed', 'Pending', 'Cancel'],
			legend: {
				show: false
			}
        }

       var chart = new ApexCharts(
            document.querySelector("#chart2"),
            options
        );
        
        chart.render();
			
    });

})(window, document, window.jQuery);