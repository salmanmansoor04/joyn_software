import React from 'react'

import '../styles/auditDashboard.css'

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';

import Axios from 'axios';

import Spinner from "./Spinner";

class AuditDashboard extends React.Component {

    state = {
        months: [],
        numberOfAuditsSeries: [],
        numberOfRevisitsSeries: [],
        deploymentInspection: [],
        deploymentInspectionCities: [],

        isLoading: false,

        totalNumberAudits: 0,
        totalNumberRevisits: 0,
        totalNumberInspection: 0,

        deploymentInspectionMonths: [],
        deploymentInspectionSeries: [],

        auditDataCity: [],
        auditCities: [],
        yearToSend: '',
        monthToSend: '',
        daysLabels: [],
        daysSeries: [],
        daysChartShown: false
    }

    closeDaysChart = () => {
        this.setState({daysChartShown: false, daysLabels: [], daysSeries: []})
    }

    monthSelected = (e) => {
        this.setState({daysChartShown: true})
        let splitted = e.target.value.split('-')
        this.setState({ yearToSend: splitted[0], monthToSend: splitted[1] }, () => {
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/fetchDailyCharts', { month: this.state.monthToSend, year: this.state.yearToSend, cust_id: localStorage.getItem('cust_id') })
                .then(res => {
                    let tempCumulativeInpection = []
                    let tempCumulativeAudits = []
                    let sum = 0
                    res.data.inspection.forEach((val) => {
                        sum = sum + val;
                        tempCumulativeInpection.push(parseFloat(sum.toFixed(2)))
                    })
                    console.log('checkingggggg', tempCumulativeInpection)
                    sum = 0
                    res.data.audits.forEach((val) => {
                        sum = sum + val;
                        tempCumulativeAudits.push(sum)
                    })
                    let tempSeries = [
                        {
                            type: 'line',
                            name: 'Audits Acc',
                            data: tempCumulativeAudits,
                            yAxis: 1
                        },
                        {
                            type: 'line',
                            name: 'Inspection Acc',
                            data: tempCumulativeInpection,
                            yAxis: 0
                        },
                        {
                            type: 'column',
                            name: 'Inspection',
                            data: res.data.inspection,
                            yAxis: 0
                        },
                        {
                            type: 'column',
                            name: 'Audits',
                            data: res.data.audits,
                            yAxis: 1
                        }
                    ]
                    this.setState({ daysSeries: tempSeries, daysLabels: res.data.allDays }, () => {
                        
                    })
                }).catch(err => console.log(err))
        })
    }


    render() {

        const auditOptions = {

            title: {
                text: 'Spot Audits'
            },
            
            credits: {
                enabled: false
            },

            //colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],

            colors: ['#ED561B', '#DDDF00', '#058DC7', '#24CBE5', '#64E572'],

            yAxis: {
                title: {
                    text: 'Number of Audits'
                }
                // stackLabels: {
                //     enabled: true,
                //     style: {
                //         fontWeight: 'bold',
                //         color: (Highcharts.theme && Highcharts.theme.textColor) || 'blue'
                //     },
                //     align: 'left',
                //     allowOverlap: true
                // }
            },

            xAxis: {
                categories: this.state.months,

            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                // series: {
                //     stacking: 'normal',
                //     animation: false
                // }
                column: {
                    stacking: 'normal',
                }
            },

            series: this.state.numberOfAuditsSeries,

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

        const revisitOptions = {
            title: {
                text: 'Number of Revisits'
            },
            credits: {
                enabled: false
            },

            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],

            yAxis: {
                title: {
                    text: 'Number of revisits'
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

            series: this.state.numberOfRevisitsSeries,

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

        const DeploymentInspectionOptions = {

            title: {
                text: 'Deployment Inspection (KM)'
            },
            credits: {
                enabled: false
            },
            
            credits: {
                enabled: false
            },
            credits: {
                enabled: false
            },

            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00'],

            yAxis: {
                title: {
                    text: 'Deployment Inspection'
                }
                // stackLabels: {
                //     enabled: true,
                //     style: {
                //         fontWeight: 'bold',
                //         color: (Highcharts.theme && Highcharts.theme.textColor) || 'blue'
                //     },
                //     align: 'left',
                //     allowOverlap: true
                // }
            },

            xAxis: {
                categories: this.state.deploymentInspectionMonths
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                // series: {
                //     stacking: 'normal',
                //     animation: false
                // }
                column: {
                    stacking: 'normal',
                }
            },

            series: this.state.deploymentInspectionSeries,

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

        const DeploymentInspectionCityOptions = {
            chart: {
                type: 'bar',
            },

            title: {
                text: 'City Wise Deployment Inspection (KM)'
            },
            credits: {
                enabled: false
            },

            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00'],

            yAxis: {
                title: {
                    text: 'Deployment'
                }
            },

            xAxis: {
                categories: this.state.deploymentInspectionCities
            },

            legend: {
                enabled: false
            },
            plotOptions: {

            },

            series: [{
                name: 'deployment',
                data: this.state.deploymentInspection
            }],

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

        const AuditCityOptions = {
            chart: {
                type: 'bar',
            },

            title: {
                text: 'City Wise Audits'
            },
            credits: {
                enabled: false
            },

            colors: ['#ED561B', '#50B432', '#ED561B', '#DDDF00'],

            yAxis: {
                title: {
                    text: 'Audits'
                }
            },

            xAxis: {
                categories: this.state.auditCities
            },

            legend: {
                enabled: false
            },
            plotOptions: {

            },

            series: [{
                name: 'Audits',
                data: this.state.auditDataCity
            }],

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

        const daysOptions = {
            chart: {

            },

            title: {
                text: 'Daily Trend'
            },
            credits: {
                enabled: false
            },

            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00'],

            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}KM',
                },
                title: {
                    text: 'Inspection',
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Audits',
                },
                labels: {
                    format: '{value}',
                }

            }],

            xAxis: {
                categories: this.state.daysLabels
            },

            legend: {
                enabled: true
            },
            plotOptions: {

            },

            series: this.state.daysSeries,

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

        return (
            <>
                <div style={{ height: 'calc(100% - 30px)', width: '100%', position: 'relative', background: 'rgb(238, 238, 238)' }}>
                    {this.state.isLoading &&
                        <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                            <Spinner />
                        </div>
                    }
                    {this.state.daysChartShown &&
                        <div className='auditDashboard_DailyTrendChart'>
                            <div style={{width: '100%', height: '5%', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center', background: ' white', fontWeight: 'bold'}}>
                                <div style={{cursor: 'pointer', marginRight: '20px'}} onClick={() => this.closeDaysChart()}>x</div>
                            </div>
                            <HighchartsReact highcharts={Highcharts} options={daysOptions} containerProps={{ style: { height: "95%", width: "100%" } }} />
                        </div>
                    }
                    <div className='auditDashboard_Charts'>
                        <div className='auditDashboard_chart'>
                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                                <HighchartsReact highcharts={Highcharts} options={auditOptions} containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} />
                            }
                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) === false &&
                                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
                                    You are not Assigned this feature
                                </div>
                            }
                        </div>
                        <div className='auditDashboard_chart'>
                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                                <HighchartsReact highcharts={Highcharts} options={revisitOptions} containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} />
                            }
                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) === false &&
                                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
                                    You are not Assigned this feature
                                </div>
                            }
                        </div>
                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                            <>

                            </>
                        }
                        <div className='auditDashboard_chart'>
                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                                <HighchartsReact highcharts={Highcharts} options={DeploymentInspectionOptions} containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} />
                            }
                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) === false &&
                                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
                                    You are not Assigned this feature
                                </div>
                            }
                        </div>
                        <div className='auditDashboard_chart'>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                                <div style={{ height: '79%', width: '49%', boxSizing: 'border-box' }}>
                                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                                        <HighchartsReact highcharts={Highcharts} options={DeploymentInspectionCityOptions} containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} />
                                    }
                                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) === false &&
                                        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
                                            You are not Assigned this feature
                                        </div>
                                    }
                                </div>
                                <div style={{ height: '79%', width: '49%', boxSizing: 'border-box' }}>
                                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                                        <HighchartsReact highcharts={Highcharts} options={AuditCityOptions} containerProps={{ style: { height: "100%", width: "100%", borderRadius: '10px' } }} />
                                    }
                                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) === false &&
                                        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
                                            You are not Assigned this feature
                                        </div>
                                    }
                                </div>
                                <div style={{ height: '19%', width: '100%', boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    <div className='auditDashboard_card'>

                                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                                            <>
                                                <div>Total Number of Spot Audits</div>
                                                <div>{this.state.totalNumberAudits}</div>
                                            </>
                                        }
                                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) === false &&
                                            <div>Not Applicable</div>
                                        }
                                    </div>
                                    <div className='auditDashboard_card'>
                                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                                            <>
                                                <div>Total Number of Revisits</div>
                                                <div>{this.state.totalNumberRevisits}</div>
                                            </>
                                        }
                                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) === false &&
                                            <div>Not Applicable</div>
                                        }
                                    </div>
                                    <div className='auditDashboard_card'>

                                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                                            <>
                                                <div>Total Deployment Inspection (KM)</div>
                                                <div>{this.state.totalNumberInspection.toFixed(2)} KM</div>
                                            </>
                                        }
                                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) === false &&
                                            <div>Not Applicable</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: '30px', width: '100%', background: '#4162A6', color: 'white' }}>
                    <span>Select a month to see daily trend</span> <input type="month" onChange={(e) => this.monthSelected(e)} />
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

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/auditDashboardInit', { cust_id: localStorage.getItem('cust_id') }, config)
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
                    var temp2;
                    var totalNumberAudits = 0;

                    var numberOfRevisitsSeries = [];
                    var numberOfAuditsSeries = [];
                    res.data.numberOfRevisits.forEach((val) => {

                        var temp = { name: val.city, data: val['Number Of Revisits'] }
                        numberOfRevisitsSeries.push(temp);
                    })
                    res.data.spotAudits.forEach((val) => {
                        var type = '';
                        var data = [];
                        var name = val.city;
                        if (val.city != 'Total') {
                            type = 'column'
                            data = val['Number Of Audits']
                        } else {
                            temp2 = { name: 'Monthly Total', data: val['Number Of Audits'], type: 'spline' };
                            type = 'spline'
                            let sum = 0
                            val['Number Of Audits'].forEach((item) => {
                                sum = sum + item;
                                data.push(sum);
                            })
                            name = 'Total Acc'

                            totalNumberAudits = sum
                        }
                        var temp = { name: name, data: data, type: type }
                        numberOfAuditsSeries.push(temp)
                    })
                    numberOfAuditsSeries.push(temp2)

                    console.log(numberOfAuditsSeries);
                    console.log(numberOfRevisitsSeries);
                    console.log(res.data.deploymentInspection);

                    var totalNumberRevisits = 0;
                    var totalNumberInspection = 0;

                    numberOfRevisitsSeries.forEach((val) => {
                        if (val.name === 'Total') {
                            val.data.forEach((value) => {
                                totalNumberRevisits = totalNumberRevisits + value
                            })
                        }
                    })
                    totalNumberInspection = res.data.deploymentInspection.reduce((partialSum, a) => partialSum + a, 0)

                    this.setState({
                        numberOfRevisitsSeries: numberOfRevisitsSeries,
                        numberOfAuditsSeries: numberOfAuditsSeries,
                        deploymentInspection: res.data.deploymentInspection,
                        deploymentInspectionCities: res.data.deploymentInspectionCities,
                        months: res.data.months,
                        totalNumberAudits: totalNumberAudits,
                        totalNumberRevisits: totalNumberRevisits,
                        totalNumberInspection: totalNumberInspection,
                        deploymentInspectionSeries: res.data.deploymenyInspectionNew,
                        deploymentInspectionMonths: res.data.deploymentInspectionMonths,
                        auditDataCity: res.data.auditDataCity,
                        auditCities: res.data.auditCities,
                        isLoading: false

                    });

                }).catch(err => console.log(err))

        })

    }
}

export default AuditDashboard