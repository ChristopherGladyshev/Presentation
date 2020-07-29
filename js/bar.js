// based ready dom, initialize echarts instance 
var myChart = echarts.init(document.getElementById('main'), 'fresh-cut');
// Themes: azul, bee-inspired, blue, caravan, carp, cool, dark, dark-blue, dark-bold, dark-digerati, dark-fresh-cut, dark-mushroom, default, eduardo, forest, fresh-cut, fruit, gray, green, helianthus, infographic, inspired, jazz, london, macarons, macarons2, mint, red, red-velvet, roma, royal, sakura, shine, tech-blue, vintage

// Specify configurations and data graphs 
var option = {
    title: {
        text: 'Диаграмма по доходам',
        subtext: '',
    },
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['Google', 'Яндекс']
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
        }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
        },
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Google',
            type: 'bar',
            data: [24000, 22000, 13800, 104800, 25250, 9400, 15000, 500, 345000, 5000, 25100,],
            // markPoint: {
            //     data: [
            //         { type: 'max', name: 'Max' },
            //         { type: 'min', name: 'Min' }
            //     ]
            // },
            //   markLine: {
            //     data: [
            //         { type: 'average', name: 'Average Value' }
            //     ]
            // }
        },
        {
            name: 'Яндекс',
            type: 'bar',
            data: [18500, 210000, 37500, 3234000, 314700, 7500, 2000, 12000, 9600, 22000,],
            // markPoint: {
            //     data: [
            //         { name: 'Annual Maximum', value: 182.2, xAxis: 7, yAxis: 183 },
            //         { name: 'Minimum', value: 2.3, xAxis: 11, yAxis: 3 }
            //     ]
            // },
            // markLine: {
            //     data: [
            //         { type: 'average', name: 'Average Value' }
            //     ]
            // }
        }
    ]
};

// Use just the specified configurations and data charts. 
myChart.setOption(option);