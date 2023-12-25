import React from 'react'

import Axios from 'axios';

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';

import '../styles/snagDashboard.css';

import Spinner from "./Spinner";

require("highcharts/modules/exporting.js")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);

var init = '';
class SnagDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            types: [],
            months: [],
            days: [],
            openClosedTotalSeries: [],
            cityWiseOpenClosedSeries: [],
            cityTypeWiseSeries: [],
            citySevWiseSeries: [],
            snagAgingSeries: [],
            timeToResolveSeries: [],
            totalSnagsSev: [],
            totalSnagsOpenClosed: [],
            cityWiseOpenClosedSnags: [],
            cityTypeWiseSnags: [],
            citySevWiseSnags: [],
            snagAging: [],
            timeToResolve: [],
            chartFilter: '',
            totalSnagsOpenClosedSeries: [],
            totalSnagsSevSeries: [],

            isLoading: false,

            low: 0,
            high: 0,
            medium: 0,

            open: 0,
            closed: 0,
        }

    }

    openClosedCityClicked = (city) => {
        if (city == 'total') {
            city = 'Total'
        }
        var temp = [];
        this.state.cityWiseOpenClosedSnags.forEach(value => {
            if (value.city === city) {

                temp = [{
                    name: 'open',
                    data: value.openSnags
                }, {
                    name: 'closed',
                    data: value.closedSnags
                }, {
                    name: 'total',
                    data: value.total
                }]

                init = ''
                let cumulativeOpenSnags = []
                let cumulativeClosedSnags = []
                temp.forEach((val) => {
                    if (val.name === 'closed') {
                        let sum = 0
                        val.data.forEach((dat) => {
                            sum = sum + dat
                            cumulativeClosedSnags.push(sum)
                        })
                    }
                    if (val.name === 'open') {
                        let sum = 0
                        val.data.forEach((dat) => {
                            sum = sum + dat
                            cumulativeOpenSnags.push(sum)
                        })
                    }
                })
                temp.push({ name: 'Open Snags Cumulative', data: cumulativeOpenSnags, type: 'spline' })
                temp.push({ name: 'Closed Snags Cumulative', data: cumulativeClosedSnags, type: 'spline' })

                this.setState({ chartFilter: 'cityWiseOpenClosed' }, () => {
                    this.setState({ cityWiseOpenClosedSeries: temp });
                })

            }
        });

    }

    cityTypeClicked = (city) => {
        if (city == 'total') {
            city = 'Total'
        }
        this.state.cityTypeWiseSnags.forEach(value => {
            if (value.city === city) {
                let temp = [];
                temp = [{
                    name: 'high',
                    data: value.high
                }, {
                    name: 'low',
                    data: value.low
                }, {
                    name: 'medium',
                    data: value.medium
                }]

                init = ''

                this.setState({ chartFilter: 'cityType' }, () => {
                    this.setState({ cityTypeWiseSeries: temp });
                })
            }
        })
    }

    snagAgingClicked = (city) => {
        if (city == 'total') {
            city = 'Total'
        }
        this.state.snagAging.forEach(value => {
            if (value.city === city) {
                let temp = [];
                temp = [{
                    name: 'high',
                    data: value.high
                }, {
                    name: 'low',
                    data: value.low
                }, {
                    name: 'medium',
                    data: value.medium
                }]

                init = ''

                this.setState({ chartFilter: 'snagAging' }, () => {
                    this.setState({ snagAgingSeries: temp });
                })
            }
        })
    }

    timeToResolveClicked = (city) => {
        if (city == 'total') {
            city = 'Total'
        }
        this.state.timeToResolve.forEach(value => {
            if (value.city === city) {
                let temp = [];
                temp = [{
                    name: 'high',
                    data: value.high
                }, {
                    name: 'low',
                    data: value.low
                }, {
                    name: 'medium',
                    data: value.medium
                }]

                init = ''

                this.setState({ chartFilter: 'timeResolve' }, () => {
                    this.setState({ timeToResolveSeries: temp });
                })
            }
        })
    }

    render() {

        const cityWiseOpenClosedChartOptions = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Snags'
            },
            
            credits: {
                enabled: false
            },

            yAxis: {
                title: {
                    text: 'Number of Snags'
                }
            },

            xAxis: {
                categories: this.state.months
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            series: this.state.cityWiseOpenClosedSeries,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }

        const cityTypeWiseOptions = {
            colors: ['#DC143C', '#32CD32', '#FF8C00'],
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Snags vs Types'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.state.types
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'number of snags'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: false
                }
            },
            series: this.state.cityTypeWiseSeries,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }

        const citySevWiseOptions = {
            colors: ['#DC143C', '#32CD32', '#FF8C00'],
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Snags vs Cities'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.state.cities
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'number of snags'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: false
                }
            },
            series: this.state.citySevWiseSeries,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }

        const snagAgingOptions = {
            colors: ['#DC143C', '#32CD32', '#FF8C00'],
            chart: {
                type: 'column'
            },
            title: {
                text: 'Snag Aging (days)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.state.days
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'number of snags'
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: false
                }
            },
            series: this.state.snagAgingSeries,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }

        const timeToResolveOptions = {
            colors: ['#DC143C', '#32CD32', '#FF8C00'],
            chart: {
                type: 'column'
            },
            title: {
                text: 'time to resolve (days)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.state.days
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'number of snags'
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: false
                },
            },
            series: this.state.timeToResolveSeries,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }

        const totalSnagsOpenClosedOptions = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Open/Closed Snags'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b> {point.y}</b>'
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
                        enabled: false
                    },
                    showInLegend: true,
                },
                series: {
                    animation: false
                }
            },
            series: [{
                name: 'Snags',
                colorByPoint: true,
                data: [{
                    name: 'Open',
                    y: this.state.open,
                }, {
                    name: 'Closed',
                    y: this.state.closed
                }]
            }]
        }

        const totalSnagsSevOptions = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            colors: ['#DC143C', '#32CD32', '#FF8C00'],
            title: {
                text: 'Snag Severity'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
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
                        enabled: false
                    },
                    showInLegend: true,
                },
                series: {
                    animation: false
                }
            },
            series: [{
                name: 'Snags',
                colorByPoint: true,
                data: [{
                    name: 'high',
                    y: this.state.high
                }, {
                    name: 'low',
                    y: this.state.low,
                }, {
                    name: 'medium',
                    y: this.state.medium
                }]
            }]
        }

        // setTimeout(() => {
        //     if (init === 'init' || this.state.chartFilter === 'cityWiseOpenClosed') {
        //         Highcharts.chart('cityWiseOpenClosedChart', cityWiseOpenClosedChartOptions);
        //     }
        //     if (init == 'init' || this.state.chartFilter === 'cityType') {
        //         Highcharts.chart('cityTypeWiseChart', cityTypeWiseOptions);
        //     }
        //     if (init == 'init') {
        //         Highcharts.chart('citySevWiseChart', citySevWiseOptions);
        //     }
        //     if (init == 'init' || this.state.chartFilter === 'snagAging') {
        //         Highcharts.chart('snagAgingChart', snagAgingOptions);
        //     }
        //     if (init == 'init' || this.state.chartFilter === 'timeResolve') {
        //         Highcharts.chart('timeToResolveChart', timeToResolveOptions);
        //     }
        //     if (init == 'init') {
        //         Highcharts.chart('totalSnagsOpenClosed', totalSnagsOpenClosedOptions);
        //     }
        //     if (init == 'init') {
        //         Highcharts.chart('totalSnagsSev', totalSnagsSevOptions);
        //     }
        // })



        return (

            <div style={{ height: '100%', width: '100%', position: 'relative', background: 'rgb(238, 238, 238)' }}>
                {this.state.isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                        <Spinner />
                    </div>
                }
                <div className='charts_wrapper'>
                    <div style={{ height: '48%', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        <div className='chart'>
                            <HighchartsReact highcharts={Highcharts} options={cityWiseOpenClosedChartOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', overflow: 'auto', borderRadius: '10px' }}>

                                <select onChange={(e) => this.openClosedCityClicked(e.target.value)}>
                                    <option onClick={() => this.openClosedCityClicked('total')} value='total'>Total</option>
                                    {this.state.cities.map((city, index) => {
                                        return (
                                            // <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='city' onClick={() => this.openClosedCityClicked(city)} /> {city}</div>
                                            <option key={index} onClick={() => this.openClosedCityClicked(city)} value={city}>{city}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='chart'>
                            <HighchartsReact highcharts={Highcharts} options={cityTypeWiseOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', overflow: 'auto', borderRadius: '10px' }}>
                                <select onChange={(e) => this.cityTypeClicked(e.target.value)}>
                                    <option onClick={() => this.cityTypeClicked('total')} value='total'>Total</option>
                                    {this.state.cities.map((city, index) => {
                                        return (
                                            // <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='city' onClick={() => this.openClosedCityClicked(city)} /> {city}</div>
                                            <option key={index} onClick={() => this.cityTypeClicked(city)} value={city}>{city}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='chart'>
                            <HighchartsReact highcharts={Highcharts} options={citySevWiseOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', borderRadius: '10px' }}>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '48%', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        <div className='chartBottom'>
                            <HighchartsReact highcharts={Highcharts} options={totalSnagsOpenClosedOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', borderRadius: '10px' }}>
                            </div>
                        </div>
                        <div className='chartBottom'>
                            <HighchartsReact highcharts={Highcharts} options={snagAgingOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', overflow: 'auto', borderRadius: '10px' }}>
                                <select onChange={(e) => this.snagAgingClicked(e.target.value)}>
                                    <option onClick={() => this.snagAgingClicked('total')} value='total'>Total</option>
                                    {this.state.cities.map((city, index) => {
                                        return (
                                            // <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='city' onClick={() => this.openClosedCityClicked(city)} /> {city}</div>
                                            <option key={index} onClick={() => this.snagAgingClicked(city)} value={city}>{city}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='chartBottom'>
                            <HighchartsReact highcharts={Highcharts} options={timeToResolveOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', overflow: 'auto', borderRadius: '10px' }}>
                                <select onChange={(e) => this.timeToResolveClicked(e.target.value)}>
                                    <option onClick={() => this.timeToResolveClicked('total')} value='total'>Total</option>
                                    {this.state.cities.map((city, index) => {
                                        return (
                                            // <div style={{ fontSize: '10px' }} key={index}> <input type="radio" name='city' onClick={() => this.openClosedCityClicked(city)} /> {city}</div>
                                            <option key={index} onClick={() => this.timeToResolveClicked(city)} value={city}>{city}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='chartBottom'>
                            <HighchartsReact highcharts={Highcharts} options={totalSnagsSevOptions} containerProps={{ style: { height: "90%", width: "100%", borderRadius: '10px' } }} immutable={true} />
                            <div style={{ height: '10%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: '13px', fontWeight: 'bold', borderRadius: '10px' }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.props.updatePathname(window.location.href)
        init = 'init'

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

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagDashboardInit', { cust_id: localStorage.getItem('cust_id') }, config)
                .then(res => {
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
                    console.log(res.data)
                    this.setState({ months: res.data.months })
                    this.setState({ types: res.data.types })
                    this.setState({ cities: res.data.cities })
                    this.setState({ days: res.data.days });
                    this.setState({ cityWiseOpenClosedSnags: res.data.cityWiseOpenClosedSnags });
                    this.setState({ cityTypeWiseSnags: res.data.cityTypeWiseSnags })
                    this.setState({ citySevWiseSnags: res.data.citySevWiseSnags })
                    this.setState({ snagAging: res.data.snagAging })
                    this.setState({ timeToResolve: res.data.timeToResolve })
                    this.state.cityWiseOpenClosedSnags.forEach(value => {
                        if (value.city === 'Total') {
                            let temp = [];
                            temp = [{
                                name: 'open',
                                data: value.openSnags,
                                type: 'column'
                            }, {
                                name: 'closed',
                                data: value.closedSnags,
                                type: 'column'
                            }, {
                                name: 'total',
                                data: value.total,
                                type: 'column'
                            }]
                            let cumulativeOpenSnags = []
                            let cumulativeClosedSnags = []
                            temp.forEach((val) => {
                                if (val.name === 'closed') {
                                    let sum = 0
                                    val.data.forEach((dat) => {
                                        sum = sum + dat
                                        cumulativeClosedSnags.push(sum)
                                    })
                                }
                                if (val.name === 'open') {
                                    let sum = 0
                                    val.data.forEach((dat) => {
                                        sum = sum + dat
                                        cumulativeOpenSnags.push(sum)
                                    })
                                }
                            })
                            temp.push({ name: 'Open Snags Cumulative', data: cumulativeOpenSnags, type: 'spline' })
                            temp.push({ name: 'Closed Snags Cumulative', data: cumulativeClosedSnags, type: 'spline' })
                            this.setState({ cityWiseOpenClosedSeries: temp, open: value.openSnags.reduce((partialSum, a) => partialSum + a, 0), closed: value.closedSnags.reduce((partialSum, a) => partialSum + a, 0) }, () => {
                            });
                        }
                    });

                    this.state.cityTypeWiseSnags.forEach(value => {
                        if (value.city === 'Total') {
                            let temp = [];
                            temp = [{
                                name: 'high',
                                data: value.high
                            }, {
                                name: 'low',
                                data: value.low
                            }, {
                                name: 'medium',
                                data: value.medium
                            }]

                            this.setState({ cityTypeWiseSeries: temp })
                        }
                    })

                    this.state.citySevWiseSnags.forEach((value, index) => {
                        if (index === 0) {
                            let temp = [];
                            temp = [{
                                name: 'high',
                                data: value.high
                            }, {
                                name: 'low',
                                data: value.low
                            }, {
                                name: 'medium',
                                data: value.medium
                            }]

                            this.setState({
                                citySevWiseSeries: temp,
                                high: value.high.reduce((partialSum, a) => partialSum + a, 0),
                                low: value.low.reduce((partialSum, a) => partialSum + a, 0),
                                medium: value.medium.reduce((partialSum, a) => partialSum + a, 0)
                            }, () => {
                            })
                        }
                    })

                    this.state.snagAging.forEach(value => {
                        if (value.city === 'Total') {
                            let temp = [];
                            temp = [{
                                name: 'high',
                                data: value.high
                            }, {
                                name: 'low',
                                data: value.low
                            }, {
                                name: 'medium',
                                data: value.medium
                            }]

                            this.setState({ snagAgingSeries: temp })
                        }
                    })

                    this.state.timeToResolve.forEach(value => {
                        if (value.city === 'Total') {
                            let temp = [];
                            temp = [{
                                name: 'high',
                                data: value.high
                            }, {
                                name: 'low',
                                data: value.low
                            }, {
                                name: 'medium',
                                data: value.medium
                            }]

                            this.setState({ timeToResolveSeries: temp, isLoading: false }, () => {
                            })
                        }
                    })


                }).catch(err => console.log(err))

        })
    }
}

export default SnagDashboard