var modalTitle;
var chartTypeState;

// 模态框获取的
var postModalData;

// 所有图表请求后暂存
var storageData = {
    drawLine: [],
    draw3DCylinderH: [],
    drawVerticalBar: [],
    drawArcRadar1: [],
    drawArcRadar2: [],
}

var colorLine = ['#FF3838', '#8124FF', '#45CE8D'];
var color3DCylinder = ['#FF3838', '#45CE8D', '#9000FF'];
var colorBarList = ['#FF3838', '#45CE8D', '#8124FF'];
var colorRadarList1 = new echarts.graphic.LinearGradient(0, 0, 1, 0,[{offset: 0, color: '#FF3838'},{offset: 1, color: '#C5AC8E'}]);
var colorRadarList2 = new echarts.graphic.LinearGradient(0, 0, 1, 0,[{offset: 0, color: '#CA4736'},{offset: 1, color: '#1FB494'}]);

$(function () {
    layui.use('form', function () {
        var form = layui.form;
        form.on('submit(compareDate)', function (data) {
            layer.msg(JSON.stringify(data.field));
            return false;
        });
        form.on('submit(compareType)', function (data) {
            layer.msg(JSON.stringify(data.field));
            return false;
        });
    });
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#pickDate1',
            theme: '#050732'
        });
        laydate.render({
            elem: '#pickDate2',
            theme: '#050732'
        });
    });
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;
        //触发事件
        var active = {
            setTop: function () {
                var that = this;
                layer.open({
                    type: 2,
                    title: ' ',
                    area: ['70%', '70%'],
                    shade: 0.3,
                    offset: ['15%', '15%'],
                    maxmin: true,
                    anim: 1,
                    content: '../pages/chartModal.html',
                    yes: function () {
                        $(that).click();
                    },
                    btn2: function () {
                        layer.closeAll();
                    },
                    zIndex: layer.zIndex,
                    success: function (layero) {
                        // 子页面弹出成功回调
                        layero.find('.layui-layer-title').text(modalTitle);
                    }
                });
            }
        };
        $('.chart-click').on('click', function () {
            modalTitle = $(this).text();
            chartTypeState = $(this).attr('data-chartType');
            postModalData = storageData[chartTypeState];
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });

    setTimeout(function () {
        // chart1
        $.ajax({
            type: "GET",
            data: "",
            dataType: 'json',
            url: "../test-json/line_3.json",
            success: function (res) {
                if (res.resultCode == 200) {
                    var xAxisData = [];
                    var sitemArr = [[], [], []];
                    var seriesData = []
                    res.result.seriesData.forEach(function (item, idx) {
                        xAxisData.push(item.date);
                        sitemArr[0].push(item.globalSituation);
                        sitemArr[1].push(item.usability);
                        sitemArr[2].push(item.stability);
                    });
                    res.result.legendData.forEach(function (item, idx) {
                        seriesData.push({
                            name: item,
                            type: 'line',
                            symbol: 'circle',
                            symbolSize: 4,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            label: {
                                normal: {
                                    show: false,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: colorLine[idx],
                                    borderWidth: 1

                                }
                            },
                            data: sitemArr[idx]
                        })
                    });
                    storageData.drawLine.push(res.result.legendData);
                    storageData.drawLine.push(xAxisData);
                    storageData.drawLine.push(seriesData);
                    initChartFun.drawLine('chart1', storageData.drawLine);
                };
            }
        });

        // chart2
        $.ajax({
            type: "GET",
            data: "",
            dataType: 'json',
            url: "../test-json/3dH_3.json",
            success: function (res) {
                if (res.resultCode == 200) {
                    res.result.seriesData.forEach(function (item, idx) {
                        item.color = color3DCylinder[idx];
                    });
                    storageData.draw3DCylinderH.push(res.result.seriesData);
                    initChartFun.draw3DCylinderH('chart2', storageData.draw3DCylinderH);
                };
            }
        });

        // chart3
        $.ajax({
            type: "GET",
            data: "",
            dataType: 'json',
            url: "../test-json/verticalBar_3.json",
            success: function (res) {
                if (res.resultCode == 200) {
                    var xAxisData = [];
                    var sitemArr = [[], [], []];
                    var seriesData = [];
                    res.result.seriesData.forEach(function (item) {
                        xAxisData.push(item[0]['date']);
                        sitemArr[0].push(item[0]['globalSituation']);
                        sitemArr[1].push(item[0]['usability']);
                        sitemArr[2].push(item[0]['stability']);
                    });
                    res.result.legendData.forEach(function (item, idx) {
                        seriesData.push({
                            name: item,
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: colorBarList[idx],
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#ccc',
                                            fontSize: 16
                                        }
                                    }
                                }
                            },
                            barWidth: 20,
                            data: sitemArr[idx]
                        })
                    });
                    storageData.drawVerticalBar.push(res.result.legendData);
                    storageData.drawVerticalBar.push(xAxisData);
                    storageData.drawVerticalBar.push(seriesData);
                    initChartFun.drawVerticalBar('chart3', storageData.drawVerticalBar);
                };
            }
        });

        // chart4
        $.ajax({
            type: "GET",
            data: "",
            dataType: 'json',
            url: "../test-json/arcRadar_3.json",
            success: function (res) {
                if (res.resultCode == 200) {
                    var indicator = [];
                    var seriesData = [];
                    res.result.seriesData.forEach(function (item) {
                        indicator.push({
                            text: item.title + ':' + item.value + '%',
                            max: 100
                        });
                        seriesData.push(item.value)
                    });
                    storageData.drawArcRadar1.push(indicator);
                    storageData.drawArcRadar1.push(seriesData);
                    storageData.drawArcRadar1.push(colorRadarList1);
                    initChartFun.drawArcRadar('chart4', storageData.drawArcRadar1);
                };
            }
        });

        // chart5
        $.ajax({
            type: "GET",
            data: "",
            dataType: 'json',
            url: "../test-json/arcRadar_3.json",
            success: function (res) {
                if (res.resultCode == 200) {
                    var indicator = [];
                    var seriesData = [];
                    res.result.seriesData.forEach(function (item) {
                        indicator.push({
                            text: item.title + ':' + item.value + '%',
                            max: 100
                        });
                        seriesData.push(item.value)
                    });
                    storageData.drawArcRadar2.push(indicator);
                    storageData.drawArcRadar2.push(seriesData);
                    storageData.drawArcRadar2.push(colorRadarList2);
                    initChartFun.drawArcRadar('chart5', storageData.drawArcRadar2);
                };
            }
        });
    }, 1000)
});
