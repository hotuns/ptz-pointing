import { FC, memo, useEffect } from "react";
import * as echarts from 'echarts';
import 'echarts/lib/component/dataZoomInside';
const EchartTemperature: FC<{
    echart: any[];
    method: number
}> = memo(({echart, method}) => {
    let chart: any = null;

    const getChartData = (data: any[], value: number) => {
        const _data = JSON.parse(JSON.stringify(data));
        return _data.filter((item: any) => item[2] === value);
    }

    const initChart = () => {
        if(!chart){
            chart = echarts.init(document.getElementById('echart-temperature') as HTMLDivElement);
        }
         // 初始化echarts实例
        // 绘制图表
        const option = {
            title: {
                text: '温度（m/s）：',
                textStyle: {
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: 12,
                },
                padding: 10,
            },
        tooltip:{
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
            },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '20px',
            top: '12%',
            containLabel: true
          },
          
        xAxis: {
            type: 'time',
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1, //这里是坐标轴的宽度,可以去掉
                }
            },
            // min: todayStart,
            // max: todayEnd,
            // interval: 1000 * 60 * 60,
        },
        dataZoom: [
            {
                showDetail: true,
                type: 'inside', // 内置于坐标系中
                xAxisIndex: 0, // 指定关联x轴
                start: 0, // 初始范围的起始百分比
                end: 100 // 初始范围的结束百分比
            }
        ],
        yAxis: {
            type: 'value',
            splitLine :{    //网格线
                lineStyle:{
                    type:'dashed',
                },
                show:true //隐藏或显示
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1, //这里是坐标轴的宽度,可以去掉
                }
            }
        },
        series: 
        [{
            type: 'line',
            data: getChartData(echart, 1),
            // 如果数据量非常大，可以关闭抗锯齿优化以提高性能
            smooth: true,
            symbol: "none",
            itemStyle: {
                color: "rgba(136,154,255,0.65)"
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(136,154,255,0.25)"
                }, {
                    offset: 1,
                    color: 'rgba(136,154,255,0)'
                }])
            }
        },{
            type: 'line',
            data: getChartData(echart, 2),
            // 如果数据量非常大，可以关闭抗锯齿优化以提高性能
            smooth: true,
            symbol: "none",
            itemStyle: {
                color: "rgba(255,174,0,0.65)"
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(255,174,0,0.25)"
                }, {
                    offset: 1,
                    color: 'rgba(136,154,255,0)'
                }])
            }
        },{
            type: 'line',
            data: getChartData(echart, 3),
            // 如果数据量非常大，可以关闭抗锯齿优化以提高性能
            smooth: true,
            symbol: "none",
            itemStyle: {
                color: "rgba(93,203,252,0.65)"
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(93,203,252,0.25)"
                }, {
                    offset: 1,
                    color: 'rgba(136,154,255,0)'
                }])
            }
        }],
        };
        // 渲染图表
        chart && chart.setOption(option);
    }


    useEffect(() => {
        initChart();
    }, [echart])

    useEffect(() => {
       initChart();
    }, [])

    return (
        <div className="w-full h-full relative">
            <div className="flex absolute top-2 left-5">
                <div className="flex items-center mr-4">
                    <div className="w-4 h-4 bg-echart-700 rounded"></div>
                    采样方式1
                </div>
                <div className="flex items-center mr-4">
                    <div className="w-4 h-4 bg-echart-600 rounded"></div>
                    采样方式2
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-echart-500 rounded"></div>
                    采样方式3
                </div>
            </div>
            <div className="w-full h-full flex-1" id="echart-temperature" ></div>
        </div>
    )
})

export default EchartTemperature 