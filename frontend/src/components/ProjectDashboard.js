import React from "react";

import Axios from 'axios';

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';

import xrange from 'highcharts/modules/xrange';

import '../styles/projectDashboard.css'

import Spinner from "./Spinner";

xrange(Highcharts);

var gantChartDataPersistent = {};
var barChartDataPersistent = {};
var barChartData2Persistent = {};

class ProjectDashboard extends React.Component {

    state = {
        gantChartData: [],
        barChartData: [],
        barChartData2: [],
        activities: [],
        cities: [],
        months: [],
        activitiesWithTotal: [],

        isLoading: false
    }

    cityClicked = (city, type) => {

        if (type == 'gantChart') {
            let temp = [];
            gantChartDataPersistent[city].forEach((val) => {
                let temporary = {};
                temporary['x'] = Date.UTC(val.year, val.month, val.firstDay);
                temporary['x2'] = Date.UTC(val.year, val.month, val.lastDay);
                temporary['y'] = val.y;
                temporary['partialFill'] = val.partialFill;
                temp.push(temporary);
            })

            this.setState({ gantChartData: temp })
        }
        if (type == 'barChart') {
            this.setState({ barChartData: barChartDataPersistent[city] })
        }
        if (type == 'barChart2') {
            this.setState({ barChartData2: barChartData2Persistent[city] })
        }
    }

    clickCheck = async () => {
        var auth = await this.props.authChecker(this.props.access_token_expiry, this.props.refresh_token_expiry);
        console.log(auth);
        console.log('hello')
    }


    render() {

        const gantChartOptions = {
            chart: {
                type: 'xrange',
                animation: false
            },
            title: {
                text: 'Project Progress'
            },
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        var ix = point.index + 1,
                            category = point.yCategory,
                            from = new Date(point.x),
                            to = new Date(point.x2);
                        return ix + '. ' + category + ', ' + from.toDateString() +
                            ' to ' + to.toDateString() + '.';
                    }
                }
            },
            xAxis: {
                ordinal: false,
                type: "datetime",
                labels: {
                    maxStaggerLines: 25
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                categories: this.state.activities,
                reversed: true,
                scrollbar: {
                    enabled: true
                }
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            series: [{
                name: 'Cable Deployment',
                // pointPadding: 0,
                // groupPadding: 0,
                borderColor: 'gray',
                pointWidth: 20,
                data: this.state.gantChartData,
                dataLabels: {
                    enabled: true
                }
            }]
        }

        const barChartOptions = {
            chart: {
                animation: false
            },

            title: {
                text: 'Deployment vs Month'
            },

            xAxis: {
                categories: this.state.months,
                scrollbar: {
                    enabled: true
                }
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'KM'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                },
                scrollbar: {
                    enabled: true
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                },
                series: {
                    animation: false
                }
            },

            legend: {
                width: 400,
                align: 'center',
                itemWidth: 200,
                borderWidth: 1
            },

            series: this.state.barChartData
        }

        const barChart2Options = {
            chart: {
                type: 'column',
                animation: false
            },
            title: {
                text: 'Deployment vs Type'
            },
            xAxis: {
                categories: this.state.activitiesWithTotal,
                crosshair: true,
                scrollbar: {
                    enabled: true
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'KM'
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
            series: this.state.barChartData2
        }

        const barChart3Options = {
            chart: {
                type: 'line',
                animation: false
            },
            title: {
                text: 'Deployment vs Type'
            },
            xAxis: {
                categories: ['2022-03-08', '2022-03-17', '2022-04-28'],
                crosshair: true,
                scrollbar: {
                    enabled: true
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'KM'
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
            series: [
                {
                    name: 'Total Planned',
                    data: [200, 100, 300]
                },
                {
                    name: 'Total UG Planned',
                    data: [100, 40, 100]
                },
                {
                    name: 'Total Aerial Planned',
                    data: [100, 60, 200]
                },
                {
                    name: 'Total Deployed',
                    data: [100, 50, 50]
                },
                {
                    name: 'Total UG Deployed',
                    data: [50, 30, 25]
                },
                {
                    name: 'Total Aerial Deployed',
                    data: [50, 20, 25]
                }
            ]
        }

        return (
            <>
                <h3 className='auditDashboard_Heading'>Project Dashboard (Currently running on test data)</h3>
                <div className="projectDashboard_Wrapper">
                    {this.state.isLoading &&
                        <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                            <Spinner />
                        </div>
                    }
                    <div style={{ height: '50%', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div className="bottom">
                            <HighchartsReact highcharts={Highcharts} options={barChart2Options} containerProps={{ style: { height: "90%", width: "100%" } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: 'lightgray', display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
                                {this.state.cities.map((city, index) => {
                                    return (
                                        <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='citybarChart2' onClick={() => this.cityClicked(city, 'barChart2')} /> {city} </div>
                                    );
                                })}
                                <div style={{ fontSize: '10px' }}> <input type="radio" name='citybarChart2' defaultChecked onClick={() => this.cityClicked('total', 'barChart2')} /> Total</div>
                            </div>
                        </div>
                        <div className="bottom">
                            <HighchartsReact highcharts={Highcharts} options={barChartOptions} containerProps={{ style: { height: "90%", width: "100%" } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: 'lightgray', display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
                                {this.state.cities.map((city, index) => {
                                    return (
                                        <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='citybarChart' onClick={() => this.cityClicked(city, 'barChart')} /> {city}</div>
                                    );
                                })}
                                <div style={{ fontSize: '10px' }}> <input type="radio" name='citybarChart' defaultChecked onClick={() => this.cityClicked('total', 'barChart')} /> Total</div>
                            </div>
                        </div>
                    </div>
                    <div className="gantChart">
                        <HighchartsReact highcharts={Highcharts} options={barChart3Options} containerProps={{ style: { height: "90%", width: "100%" } }} immutable={true} />
                        <div style={{ height: '10%', width: '100%', background: 'lightgray', display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
                            {this.state.cities.map((city, index) => {
                                return (
                                    <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='citygantChart' onClick={() => this.cityClicked(city, 'gantChart')} /> {city}</div>
                                );
                            })}
                            <div style={{ fontSize: '10px' }}> <input type="radio" name='citygantChart' defaultChecked onClick={() => this.cityClicked('total', 'gantChart')} /> Total</div>
                            {/* <div><button onClick={() => this.clickCheck()}>Click Check</button></div> */}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    componentDidMount() {
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

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/projectDashboardInit', {}, config)
                .then( res => {
                    if (res.data === 'login') {
                        //alert('No Unauthorized Access');
                        localStorage.removeItem("access_token_expiry");
                        localStorage.removeItem("refresh_token_expiry");
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        localStorage.removeItem("id");
                        this.props.navigate("/");
                        return
                    }

                    console.log(res.data);
                    gantChartDataPersistent = res.data.gantChartData;
                    barChartDataPersistent = res.data.barChartData;
                    barChartData2Persistent = res.data.barChartData2;
                    let temp = [];
                    gantChartDataPersistent.total.forEach((val) => {
                        let temporary = {};
                        temporary['x'] = Date.UTC(val.year, val.month, val.firstDay);
                        temporary['x2'] = Date.UTC(val.year, val.month, val.lastDay);
                        temporary['y'] = val.y;
                        temporary['partialFill'] = val.partialFill;
                        temp.push(temporary);
                    })

                    this.setState({
                        gantChartData: temp,
                        activities: res.data.activities,
                        barChartData: res.data.barChartData.total,
                        barChartData2: res.data.barChartData2.total,
                        months: res.data.months,
                        cities: res.data.cities,
                        activitiesWithTotal: res.data.activitiesWithTotal,
                        isLoading: false
                    })

                }).catch(err => console.log(err))

        })

    }
}

export default ProjectDashboard;
