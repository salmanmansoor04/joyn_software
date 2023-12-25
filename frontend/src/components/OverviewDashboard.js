import React from 'react'

import { Link } from 'react-router-dom'

import Axios from 'axios';

import Spinner from "./Spinner";

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';

import '../styles/OverviewDashboard.css'

// import '../styles/ForgotPassword.css'

class OverviewDashboard extends React.Component {

    state = {

        isLoading: true,
        cityWiseChartData: [],
        operators: [],

        totalBarChartData: [],
        totalPieChartData: [],

        months: [],
        numberOfAuditsSeries: [],
        deploymentInspection: [],
        deploymentInspectionCities: [],

        showLargeChart: false,
        showLargeChartTotalOfcDeployment: false,
        showLargeChartTotalSitesIntegration: false,
        showLargeChartTotalNumberOfAudits: false,
        showLargeChartCurrentOfcDeployment: false,
        zoomBarChartData: [],
        zoomPieChartData: []
    }

    showLargeChart = (item) => {
        this.setState({ zoomBarChartData: item.barChartData, zoomPieChartData: item.pieChartData, showLargeChart: true })
    }

    render() {

        return (
            <div className='overviewDashboard_wrapper'>
                {this.state.isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                        <Spinner />
                    </div>
                }
                {this.state.showLargeChart &&
                    <div onClick={() => { this.setState({ showLargeChart: false }) }} className='chartLargeOuter'>
                        <div className='chartLargeInner'>
                            <div style={{ height: '100%', width: '100%', boxSizing: 'border-box', background: 'white', borderRadius: '10px' }}>
                                <div style={{ height: '50%' }}>
                                    <HighchartsReact highcharts={Highcharts} options={
                                        {
                                            chart: {
                                                type: 'column',
                                                animation: false,
                                            },
                                            navigation: {
                                                buttonOptions: {
                                                    enabled: false
                                                }
                                            },
                                            credits: {
                                                enabled: false
                                            },
                                            title: {
                                                text: 'OFC Deployment (Km)',
                                            },
                                            xAxis: {
                                                categories: this.state.operators,
                                                crosshair: true,
                                                scrollbar: {
                                                    enabled: true
                                                },
                                            },
                                            yAxis: {
                                                min: 0,
                                                title: {
                                                    text: 'KM'
                                                }
                                            },
                                            legend: {
                                                labelFormatter: function () {
                                                    return this.name.length > 10 ? [...this.name].splice(0, 15).join('') + '...' : this.name
                                                }
                                            },

                                            tooltip: {
                                                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                                footerFormat: '</table>',
                                                shared: true,
                                                useHTML: true
                                            },
                                            plotOptions: {
                                                column: {
                                                    pointPadding: 0.2,
                                                    borderWidth: 0
                                                },
                                                series: {
                                                    animation: false
                                                }
                                            },
                                            series: this.state.zoomBarChartData
                                        }
                                    } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                                </div>
                                <div style={{ height: '50%', width: '100%', borderRadius: '10px' }}>
                                    <HighchartsReact highcharts={Highcharts} options={
                                        {
                                            chart: {
                                                plotBackgroundColor: null,
                                                plotBorderWidth: null,
                                                plotShadow: false,
                                                type: 'pie'
                                            },
                                            navigation: {
                                                buttonOptions: {
                                                    enabled: false
                                                }
                                            },
                                            
                                            credits: {
                                                enabled: false
                                            },
                                            title: {
                                                text: 'Sites Integration',
                                            },
                                            accessibility: {
                                                point: {
                                                    valueSuffix: '%'
                                                }
                                            },
                                            plotOptions: {
                                                pie: {
                                                    allowPointSelect: true,
                                                    cursor: 'pointer',
                                                    dataLabels: {
                                                        enabled: true,
                                                        format: '<b>{point.name}</b>: {y} '
                                                    }
                                                }
                                            },
                                            series: [{
                                                name: 'Sites',
                                                colorByPoint: true,
                                                data: this.state.zoomPieChartData
                                            }]
                                        }
                                    } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {this.state.showLargeChartTotalOfcDeployment &&
                    <div onClick={() => { this.setState({ showLargeChartTotalOfcDeployment: false }) }} className='chartLargeOuter'>
                        <div className='chartLargeInner' style={{ height: '50%' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'column',
                                        animation: false,
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Total OFC Deployment (Km)',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    xAxis: {
                                        categories: this.state.operators,
                                        crosshair: true,
                                        scrollbar: {
                                            enabled: true
                                        },
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'KM'
                                        }
                                    },
                                    legend: {
                                        labelFormatter: function () {
                                            return this.name.length > 10 ? [...this.name].splice(0, 15).join('') + '...' : this.name
                                        }
                                    },

                                    tooltip: {
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        },
                                        series: {
                                            animation: false
                                        }
                                    },
                                    series: this.state.totalBarChartData
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                    </div>
                }
                {this.state.showLargeChartTotalSitesIntegration &&
                    <div onClick={() => { this.setState({ showLargeChartTotalSitesIntegration: false }) }} className='chartLargeOuter'>
                        <div className='chartLargeInner' style={{ height: '50%' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Total Sites Integration',
                                    },
                                    accessibility: {
                                        point: {
                                            valueSuffix: '%'
                                        }
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true,
                                                format: '<b>{point.name}</b>: {y} '
                                            }
                                        }
                                    },
                                    series: [{
                                        name: 'Sites',
                                        colorByPoint: true,
                                        data: this.state.totalPieChartData,
                                        animation: false
                                    }]
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                    </div>
                }
                {this.state.showLargeChartTotalNumberOfAudits &&
                    <div onClick={() => { this.setState({ showLargeChartTotalNumberOfAudits: false }) }} className='chartLargeOuter'>
                        <div className='chartLargeInner' style={{ height: '50%' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'column',
                                        animation: false,
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Total Number of Audits (Monthly)',
                                    },
                                    xAxis: {
                                        categories: this.state.months,
                                        crosshair: true,
                                        scrollbar: {
                                            enabled: true
                                        },
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'KM'
                                        }
                                    },
                                    legend: {
                                        labelFormatter: function () {
                                            return this.name.length > 10 ? [...this.name].splice(0, 15).join('') + '...' : this.name
                                        }
                                    },

                                    tooltip: {
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        },
                                        series: {
                                            animation: false
                                        }
                                    },
                                    series: this.state.numberOfAuditsSeries
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                    </div>
                }
                {this.state.showLargeChartCurrentOfcDeployment &&
                    <div onClick={() => { this.setState({ showLargeChartCurrentOfcDeployment: false }) }} className='chartLargeOuter'>
                        <div className='chartLargeInner' style={{ height: '50%' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'spline',
                                        animation: false,
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Deployment Inspection Per City (km)',
                                    },
                                    xAxis: {
                                        categories: this.state.deploymentInspectionCities,
                                        crosshair: true,
                                        scrollbar: {
                                            enabled: true
                                        },
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'KM'
                                        }
                                    },
                                    legend: {
                                        enabled: false
                                    },

                                    tooltip: {
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        },
                                        series: {
                                            animation: false
                                        }
                                    },
                                    series: [{
                                        name: 'deployment inspection distance',
                                        data: this.state.deploymentInspection
                                    }]
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                    </div>
                }
                <div style={{ height: '100%', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ height: '20%', width: '100%', boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        <div onClick={() => { this.setState({ showLargeChartTotalOfcDeployment: true }) }} style={{ height: '100%', width: '24%', boxSizing: 'border-box', borderRadius: '10px', cursor: 'pointer' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'column',
                                        animation: false,
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Total OFC Deployment (Km)',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    xAxis: {
                                        categories: this.state.operators,
                                        crosshair: true,
                                        scrollbar: {
                                            enabled: true
                                        },
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'KM'
                                        }
                                    },
                                    legend: {
                                        align: 'right',
                                        verticalAlign: 'top',
                                        layout: 'vertical',
                                        x: 0,
                                        y: 40,
                                        width: '20%',
                                        itemStyle: {
                                            width: 130,
                                            fontSize: 10
                                        },
                                        labelFormatter: function () {
                                            return this.name.length > 10 ? [...this.name].splice(0, 15).join('') + '...' : this.name
                                        }
                                    },

                                    tooltip: {
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        },
                                        series: {
                                            animation: false
                                        }
                                    },
                                    series: this.state.totalBarChartData
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                        <div onClick={() => { this.setState({ showLargeChartTotalSitesIntegration: true }) }} style={{ height: '100%', width: '24%', boxSizing: 'border-box', borderRadius: '10px', cursor: 'pointer' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Total Sites Integration',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    accessibility: {
                                        point: {
                                            valueSuffix: '%'
                                        }
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            center: ['50%', '0'],
                                            size: '100%',
                                            dataLabels: {
                                                enabled: true,
                                                format: '<b>{point.name}</b>: {y} '
                                            }
                                        }
                                    },
                                    series: [{
                                        name: 'Sites',
                                        colorByPoint: true,
                                        data: this.state.totalPieChartData,
                                        animation: false
                                    }]
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                        <div onClick={() => { this.setState({ showLargeChartTotalNumberOfAudits: true }) }} style={{ height: '100%', width: '24%', boxSizing: 'border-box', borderRadius: '10px', cursor: 'pointer' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'column',
                                        animation: false,
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Total Number of Audits (Monthly)',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    xAxis: {
                                        categories: this.state.months,
                                        crosshair: true,
                                        scrollbar: {
                                            enabled: true
                                        },
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'KM'
                                        }
                                    },
                                    legend: {
                                        align: 'right',
                                        verticalAlign: 'top',
                                        layout: 'vertical',
                                        x: 0,
                                        y: 40,
                                        width: '20%',
                                        itemStyle: {
                                            width: 130,
                                            fontSize: 10
                                        },
                                        labelFormatter: function () {
                                            return this.name.length > 10 ? [...this.name].splice(0, 15).join('') + '...' : this.name
                                        }
                                    },

                                    tooltip: {
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        },
                                        series: {
                                            animation: false
                                        }
                                    },
                                    series: this.state.numberOfAuditsSeries
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                        <div onClick={() => { this.setState({ showLargeChartCurrentOfcDeployment: true }) }} style={{ height: '100%', width: '24%', boxSizing: 'border-box', borderRadius: '10px', cursor: 'pointer' }}>
                            <HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'spline',
                                        animation: false,
                                    },
                                    navigation: {
                                        buttonOptions: {
                                            enabled: false
                                        }
                                    },
                                    
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: 'Deployment Inspection Per City (km)',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    xAxis: {
                                        categories: this.state.deploymentInspectionCities,
                                        crosshair: true,
                                        scrollbar: {
                                            enabled: true
                                        },
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '10px'
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'KM'
                                        }
                                    },
                                    legend: {
                                        enabled: false
                                    },

                                    tooltip: {
                                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        },
                                        series: {
                                            animation: false
                                        }
                                    },
                                    series: [{
                                        name: 'deployment inspection distance',
                                        data: this.state.deploymentInspection
                                    }]
                                }
                            } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                        </div>
                    </div>
                    {this.state.cityWiseChartData.map((item, index) => {
                        return (
                            <div onClick={() => this.showLargeChart(item)} key={index} style={{ height: '38%', width: '24%', boxSizing: 'border-box', background: 'white', borderRadius: '10px', cursor: 'pointer' }}>
                                <h6 style={{ textAlign: 'center', margin: '0px', height: '5%' }}>{item.city}</h6>
                                <div style={{ height: '47.5%' }}>
                                    <HighchartsReact highcharts={Highcharts} options={
                                        {
                                            chart: {
                                                type: 'column',
                                                animation: false,
                                            },
                                            navigation: {
                                                buttonOptions: {
                                                    enabled: false
                                                }
                                            },
                                            
                                            credits: {
                                                enabled: false
                                            },
                                            title: {
                                                text: 'OFC Deployment (Km)',
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontSize: '10px'
                                                }
                                            },
                                            xAxis: {
                                                categories: this.state.operators,
                                                crosshair: true,
                                                scrollbar: {
                                                    enabled: true
                                                },
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontSize: '10px'
                                                }
                                            },
                                            yAxis: {
                                                min: 0,
                                                title: {
                                                    text: 'KM'
                                                }
                                            },
                                            legend: {
                                                align: 'right',
                                                verticalAlign: 'top',
                                                layout: 'vertical',
                                                x: 0,
                                                y: 40,
                                                width: '20%',
                                                itemStyle: {
                                                    width: 130,
                                                    fontSize: 10
                                                },
                                                labelFormatter: function () {
                                                    return this.name.length > 10 ? [...this.name].splice(0, 15).join('') + '...' : this.name
                                                }
                                            },

                                            tooltip: {
                                                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                                footerFormat: '</table>',
                                                shared: true,
                                                useHTML: true
                                            },
                                            plotOptions: {
                                                column: {
                                                    pointPadding: 0.2,
                                                    borderWidth: 0
                                                },
                                                series: {
                                                    animation: false
                                                }
                                            },
                                            series: item.barChartData
                                        }
                                    } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                                </div>
                                <div style={{ height: '47.5%', width: '100%', borderRadius: '10px' }}>
                                    <HighchartsReact highcharts={Highcharts} options={
                                        {
                                            chart: {
                                                plotBackgroundColor: null,
                                                plotBorderWidth: null,
                                                plotShadow: false,
                                                type: 'pie'
                                            },
                                            navigation: {
                                                buttonOptions: {
                                                    enabled: false
                                                }
                                            },
                                            
                                            credits: {
                                                enabled: false
                                            },
                                            title: {
                                                text: 'Sites Integration',
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontSize: '10px'
                                                }
                                            },
                                            accessibility: {
                                                point: {
                                                    valueSuffix: '%'
                                                }
                                            },
                                            plotOptions: {
                                                pie: {
                                                    allowPointSelect: true,
                                                    cursor: 'pointer',
                                                    center: ['50%', '0'],
                                                    size: '100%',
                                                    dataLabels: {
                                                        enabled: true,
                                                        format: '<b>{point.name}</b>: {y} '
                                                    }
                                                },
                                                series: {
                                                    animation: false
                                                }
                                            },
                                            series: [{
                                                name: 'Sites',
                                                colorByPoint: true,
                                                data: item.pieChartData
                                            }]
                                        }
                                    } containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    componentDidMount() {

        console.log('hello2');
        this.props.updatePathname(window.location.href)
        this.setState({ isLoading: true }, async () => {

            var auth = await this.props.authChecker(localStorage.getItem("access_token_expiry"), localStorage.getItem("refresh_token_expiry"));
            console.log(auth)
            if (auth === 'login') {
                alert('Session has expired you need to login again')
                localStorage.removeItem("access_token_expiry");
                localStorage.removeItem("refresh_token_expiry");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("id");
                this.props.navigate("/");
                return
            }


            let config = {
                headers: {
                    'X-Access-Token': localStorage.getItem("access_token"),
                    'X-Refresh-Token': localStorage.getItem("refresh_token"),
                    'X-User-ID': localStorage.getItem("id"),
                }
            }

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/overviewDashboardInit', {}, config)
                .then(res => {
                    if (res.data === 'login') {
                        //alert('No Unauthorized Access');
                        console.log('coming here')
                        localStorage.removeItem("access_token_expiry");
                        localStorage.removeItem("refresh_token_expiry");
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        localStorage.removeItem("id");
                        this.props.navigate("/");
                        return
                    }

                    console.log('response', res.data);

                    var numberOfAuditsSeries = [];
                    res.data.spotAudits.forEach((val) => {
                        var temp = { name: val.city, data: val['Number Of Audits'] }
                        numberOfAuditsSeries.push(temp)
                    })

                    console.log(numberOfAuditsSeries);

                    this.setState({
                        cityWiseChartData: res.data.cityWiseChartData,
                        operators: res.data.Operators,
                        numberOfAuditsSeries: numberOfAuditsSeries,
                        deploymentInspection: res.data.deploymentInspection,
                        deploymentInspectionCities: res.data.deploymentInspectionCities,
                        months: res.data.months,

                        totalBarChartData: res.data.totalBarChartData,
                        totalPieChartData: res.data.totalPieChartData,
                        isLoading: false
                    })

                }).catch(err => console.log(err))

        })
    }
}



export default OverviewDashboard

// chart: {
//     plotBackgroundColor: null,
//     plotBorderWidth: null,
//     plotShadow: false,
//     type: 'pie',
// },
// navigation: {
//     buttonOptions: {
//         enabled: false
//     }
// },
// title: {
//     text: 'Sites Integration',
//     style: {
//         fontWeight: 'bold',
//         fontSize: '10px'
//     }
// },
// legend: {
//     align: 'right',
//     verticalAlign: 'top',
//     layout: 'vertical',
//     x: 0,
//     y: 40,
//     itemStyle: {
//         color: '#000000',
//         fontWeight: 'bold',
//         fontSize: '10px'
//     }
// },

// plotOptions: {
//     pie: {
//         allowPointSelect: true,
//         cursor: 'pointer',
//         center: ['70%', '50%'],
//         size: '150%',
//         align: 'right',
//         verticalAlign: 'top',
//         dataLabels: {
//             enabled: false
//         },
//         showInLegend: true
//     }
// },
// series: [{
//     name: 'Sites',
//     colorByPoint: true,
//     data: item.pieChartData
// }]
