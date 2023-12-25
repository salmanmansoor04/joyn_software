import React from 'react'

import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

import Axios from 'axios'

import '../styles/snagReporting.css'
import { Link } from 'react-router-dom';

import Spinner from "./Spinner";
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

let filterObjectPersistent = { cities: [], regions: [], areas: [], categories: [], descriptions: [], severities: ['1', '2', '3'], statuses: ['yes', null], actions: ['Actionable', 'Non Actionable', 'NA'], tasks: ['assigned', 'rectified', null], dates: { from: '', to: '' } };


class SnagReporting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numberOfSnagsShown: 0,
            cities: [],
            regions: [],
            categories: [],
            severities: ['1', '2', '3'],
            descriptions: [],
            areas: [],
            snags: [],
            snagsPersistent: [],
            filterObject: { cities: [], regions: [], areas: [], categories: [], descriptions: [], severities: ['1', '2', '3'], statuses: ['yes', null], actions: ['Actionable', 'Non Actionable', 'NA'], tasks: ['assigned', 'rectified', null], dates: { from: '', to: '' } },
            openFilter: '',
            showFilterIcon: '',
            markers: [],
            center: { lat: 22.291, lng: 153.027 },

            detailsToShow: [],
            detailsToShowPosition: { lat: 0, lng: 0 },

            isLoading: false,
            pages: [],
            initialLoad: false,

            mediaShow: false,

            media: [],

            folderName: '',

            images: [],

            path: '',
            offset: '0%',

            // heatmapTestData: []

            members: [],
            membersShow: [],
            selectedMembers: [],

            functions: [],
            selectedSnags: [],

            task: {
                urgency: '',
                description: '',
                startDate: '',
                dueDate: '',
                Type: 'Snag'
            },

            memberFilter: {
                region: 'All',
                city: 'All',
                function: 'All'
            },

            showAssignTask: false,

            mapFullScreen: false,

            taskPositions: [],

            rectifiedImages: [],
            task_id: 0
        };
    }

    openFilterWindow = (val) => {
        if (this.state.openFilter !== val) {
            this.setState({ openFilter: val })
        } else {
            this.setState({ openFilter: '' })
        }
    }

    addToFilter = (value, type) => {
        var temp = this.state.filterObject;
        if (type == 'region') {
            if (temp.regions.includes(value)) {
                temp.regions = temp.regions.filter((val) => {
                    return val != value
                })
                temp.cities = filterObjectPersistent.cities
                temp.cities = temp.cities.filter((val) => {
                    return temp.regions.includes(val.region)
                })
            } else {
                temp.regions.push(value);
                temp.cities = filterObjectPersistent.cities
                temp.cities = temp.cities.filter((val) => {
                    return temp.regions.includes(val.region)
                })
            }
            this.setState({ filterObject: temp }, () => {
                console.log('persistent', filterObjectPersistent);
                console.log('filter', this.state.filterObject);
            });
        }
        if (type == 'city') {
            if (temp.cities.some(val => { return val.name == value.name })) {
                temp.cities = temp.cities.filter((val) => {
                    return val.name != value.name
                })
            } else {
                temp.cities.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'area') {
            if (temp.areas.includes(value)) {
                temp.areas = temp.areas.filter((val) => {
                    return val != value
                })
            } else {
                temp.areas.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'category') {
            if (temp.categories.includes(value)) {
                temp.categories = temp.categories.filter((val) => {
                    return val != value
                })
            } else {
                temp.categories.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'description') {
            if (temp.descriptions.includes(value)) {
                temp.descriptions = temp.descriptions.filter((val) => {
                    return val != value
                })
            } else {
                temp.descriptions.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'severity') {
            if (temp.severities.includes(value)) {
                temp.severities = temp.severities.filter((val) => {
                    return val != value
                })
            } else {
                temp.severities.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'status') {
            if (temp.statuses.includes(value)) {
                temp.statuses = temp.statuses.filter((val) => {
                    return val != value
                })
            } else {
                temp.statuses.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'action_status') {
            if (temp.actions.includes(value)) {
                temp.actions = temp.actions.filter((val) => {
                    return val != value
                })
            } else {
                temp.actions.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'task') {
            if (temp.tasks.includes(value)) {
                temp.tasks = temp.tasks.filter((val) => {
                    return val != value
                })
            } else {
                temp.tasks.push(value);
            }
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'dateFrom') {
            temp.dates.from = value.target.value
            this.setState({ filterObject: temp }, () => {
            });
        }
        if (type == 'dateTo') {
            temp.dates.to = value.target.value;
            this.setState({ filterObject: temp }, () => {
            });
        }
    }

    selectAll = (type) => {
        if (type == 'region') {
            let temp = this.state.filterObject;
            if (temp.regions.length == filterObjectPersistent.regions.length) {
                temp.regions = []
                temp.cities = filterObjectPersistent.cities
                temp.cities = temp.cities.filter((val) => {
                    return temp.regions.includes(val.region)
                })
            } else {
                temp.regions = filterObjectPersistent.regions
                temp.cities = filterObjectPersistent.cities
                temp.cities = temp.cities.filter((val) => {
                    return temp.regions.includes(val.region)
                })
            }
            this.setState({ filterObject: temp }, () => {
                console.log('persistent', filterObjectPersistent);
                console.log('filter', this.state.filterObject);
            });
        }
        if (type == 'city') {
            let temp = this.state.filterObject;
            if (temp.cities.length == filterObjectPersistent.cities.length) {
                temp.cities = []
            } else {
                temp.cities = filterObjectPersistent.cities
            }
            this.setState({ filterObject: temp }, () => {
                //console.log('persistent1', filterObjectPersistent);
                // console.log('filter', this.state.filterObject);
            });
        }
        if (type == 'category') {
            let temp = this.state.filterObject;
            if (temp.categories.length == filterObjectPersistent.categories.length) {
                temp.categories = []
            } else {
                temp.categories = filterObjectPersistent.categories
            }
            this.setState({ filterObject: temp }, () => {
                // console.log('persistent', filterObjectPersistent);
                // console.log('filter', this.state.filterObject);
            });
        }
        if (type == 'description') {
            let temp = this.state.filterObject;
            if (temp.descriptions.length == filterObjectPersistent.descriptions.length) {
                temp.descriptions = []
            } else {
                temp.descriptions = filterObjectPersistent.descriptions
            }
            this.setState({ filterObject: temp }, () => {
                // console.log('persistent', filterObjectPersistent);
                // console.log('filter', this.state.filterObject);
            });
        }
        if (type == 'area') {
            let temp = this.state.filterObject;
            if (temp.areas.length == filterObjectPersistent.areas.length) {
                temp.areas = []
            } else {
                temp.areas = filterObjectPersistent.areas
            }
            this.setState({ filterObject: temp }, () => {
                // console.log('persistent', filterObjectPersistent);
                // console.log('filter', this.state.filterObject);
            });
        }
    }

    applyFilter = () => {

        let cities = [];
        this.state.filterObject.cities.forEach((val) => {
            cities.push(val.name);
        })
        console.log(cities)
        console.log(this.state.filterObject.severities)
        this.setState({ isLoading: true }, () => {

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagReportingGetSnags', { cities: cities, severities: this.state.filterObject.severities, categories: this.state.filterObject.categories, snags: this.state.filterObject.descriptions, areas: this.state.filterObject.areas, statuses: this.state.filterObject.statuses, actions: this.state.filterObject.actions, tasks: this.state.filterObject.tasks, cust_id: localStorage.getItem('cust_id') })
                .then(res => {

                    console.log(res.data);

                    let tempCities = [
                        { name: 'Gujranwala', region: 'Central' },
                        { name: 'Sialkot', region: 'Central' },
                        { name: 'Sargodah', region: 'Central' },
                        { name: 'Multan', region: 'Central' },
                        { name: 'Faisalabad', region: 'Central' },
                        { name: 'Islamabad', region: 'North' },
                        { name: 'Rawalpindi', region: 'North' },
                        { name: 'Peshawar', region: 'North' },
                    ];
                    let tempRegions = ['North', 'South', 'Central'];

                    let tempMarkers = [];

                    res.data.snags.data.forEach((val) => {

                        if (tempMarkers.includes(val.position) === false) {
                            tempMarkers.push(val.position);
                        }

                    })
                    let snags1 = res.data.snags.data;
                    let snags2 = res.data.snags.data;

                    tempMarkers = tempMarkers.map((val) => {
                        return JSON.parse(val)
                    })


                    this.setState({ snags: snags1, snagsPersistent: snags2, markers: tempMarkers, pages: res.data.snags.links, isLoading: false, openFilter: '' }, () => {
                        this.setState({ numberOfSnagsShown: this.state.snags.length })
                        console.log('markers', this.state.markers)
                    })

                }).catch(err => { alert('Some Problem Please Try Again'); this.setState({ isLoading: false }) })

        })
    }

    resetFilter = () => {

        // var dumper = {}

        // for (let indiv in filterObjectPersistent) {
        //     dumper[indiv] = filterObjectPersistent[indiv]
        // }
        // console.log(dumper)
        // this.setState({ filterObject: dumper, categories: dumper.categories, descriptions: dumper.descriptions, areas: dumper.areas }, () => {
        //     // document.getElementById('from').value = '';
        //     // document.getElementById('to').value = '';
        //     console.log('persistent', filterObjectPersistent);
        //     console.log('filter', this.state.filterObject);
        // })
        this.setState({ isLoading: true }, () => {

            let config = {
                headers: {
                    'X-Access-Token': localStorage.getItem("access_token"),
                    'X-Refresh-Token': localStorage.getItem("refresh_token"),
                    'X-User-ID': localStorage.getItem("id"),
                }
            }

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagReportingInit', {}, config)
                .then(res => {

                    console.log('hello world', res.data);

                    let tempCities = [
                        { name: 'Gujranwala', region: 'Central' },
                        { name: 'Sialkot', region: 'Central' },
                        { name: 'Sargodah', region: 'Central' },
                        { name: 'Multan', region: 'Central' },
                        { name: 'Faisalabad', region: 'Central' },
                        { name: 'Islamabad', region: 'North' },
                        { name: 'Rawalpindi', region: 'North' },
                        { name: 'Peshawar', region: 'North' },
                    ];
                    let tempRegions = ['North', 'South', 'Central'];

                    let temp = { cities: tempCities, regions: tempRegions, areas: res.data.areas, categories: res.data.categories, descriptions: res.data.descriptions, severities: ['1', '2', '3'], statuses: ['yes', null], actions: ['Actionable', 'Non Actionable', 'NA'], tasks: ['assigned', 'rectified', null], dates: { from: '', to: '' } }
                    let temp2 = { cities: tempCities, regions: tempRegions, areas: res.data.areas, categories: res.data.categories, descriptions: res.data.descriptions, severities: ['1', '2', '3'], statuses: ['yes', null], actions: ['Actionable', 'Non Actionable', 'NA'], tasks: ['assigned', 'rectified', null], dates: { from: '', to: '' } }

                    filterObjectPersistent = temp2

                    this.setState({ filterObject: temp, cities: tempCities, regions: tempRegions, areas: res.data.areas, categories: res.data.categories, descriptions: res.data.descriptions, snags: [], isLoading: false, numberOfSnagsShown: 0, openFilter: '' }, () => {
                        console.log('persistent', filterObjectPersistent);
                        console.log('filter', this.state.filterObject);
                    })

                }).catch(err => console.log(err))
        })
    }

    search = async (e, type) => {

        let tempFilterObject = filterObjectPersistent;
        let searchText = e.target.value;
        console.log(searchText)

        if (type === 'category') {
            var categories = tempFilterObject.categories;
            categories = categories.filter((val) => {
                let text = val.toLowerCase();
                let searchtext = searchText.toLowerCase();
                return text.includes(searchtext);
            })
            this.setState({ categories: categories });
        }
        if (type === 'description') {
            var descriptions = tempFilterObject.descriptions;
            descriptions = descriptions.filter((val) => {
                let text = val.toLowerCase();
                let searchtext = searchText.toLowerCase();
                return text.includes(searchtext);
            })
            this.setState({ descriptions: descriptions });
        }
        if (type === 'area') {
            var areas = tempFilterObject.areas;
            areas = areas.filter((val) => {
                let text = val.toLowerCase();
                let searchtext = searchText.toLowerCase();
                return text.includes(searchtext);
            })
            this.setState({ areas: areas });
        }

    }


    infowindowclosed = () => {
        var temp = { lat: 0, lng: 0 }
        this.setState({ detailsToShowPosition: temp }, () => {
            this.setState({ detailsToShow: [] })
        })
    }

    markerClicked = (val) => {
        // console.log(val)
        let tempPosition = val;

        let tempDetails = [];

        let stringifiedPosition = JSON.stringify(tempPosition)

        this.state.snags.forEach((item) => {

            if (item.position == stringifiedPosition) {
                tempDetails.push(item)
            }
        })

        this.setState({ detailsToShow: tempDetails }, () => {
            this.setState({ detailsToShowPosition: tempPosition }, () => {
                // console.log(this.state.detailsToShow);
            })
        })
    }

    fetchSnags = () => {

        // let map = new window.google.maps.Map(document.getElementById("map"), {
        //     center: this.state.center,
        //     zoom: 1
        // });
        // let heatmap = new window.google.maps.visualization.HeatmapLayer({
        //     map: map,
        //     data: [
        //         { location: new window.google.maps.LatLng(37.782, -122.447), weight: 1, radius: 50 },
        //     ]
        // });
        // heatmap.set("radius", heatmap.get("radius") ? null : 10);

        let cities = [];
        this.state.filterObject.cities.forEach((val) => {
            cities.push(val.name);
        })
        console.log(cities)
        console.log(this.state.filterObject.severities)
        this.setState({ isLoading: true }, () => {

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagReportingGetSnags', { cities: cities, severities: this.state.filterObject.severities, categories: this.state.filterObject.categories, snags: this.state.filterObject.descriptions, areas: this.state.filterObject.areas, statuses: this.state.filterObject.statuses, actions: this.state.filterObject.actions, tasks: this.state.filterObject.tasks, cust_id: localStorage.getItem('cust_id') })
                .then(res => {

                    console.log(res.data);

                    let tempCities = [
                        { name: 'Gujranwala', region: 'Central' },
                        { name: 'Sialkot', region: 'Central' },
                        { name: 'Sargodah', region: 'Central' },
                        { name: 'Multan', region: 'Central' },
                        { name: 'Faisalabad', region: 'Central' },
                        { name: 'Islamabad', region: 'North' },
                        { name: 'Rawalpindi', region: 'North' },
                        { name: 'Peshawar', region: 'North' },
                    ];
                    let tempRegions = ['North', 'South', 'Central'];

                    let tempMarkers = [];

                    res.data.snags.data.forEach((val) => {

                        if (tempMarkers.includes(val.position) === false) {
                            tempMarkers.push(val.position);
                        }

                    })
                    let snags1 = res.data.snags.data;
                    let snags2 = res.data.snags.data;

                    tempMarkers = tempMarkers.map((val) => {
                        return JSON.parse(val)
                    })


                    this.setState({ snags: snags1, snagsPersistent: snags2, markers: tempMarkers, pages: res.data.snags.links, isLoading: false, initialLoad: false, openFilter: '' }, () => {
                        this.setState({ center: tempMarkers[0] }, () => {
                            console.log('pages', this.state.pages)
                            this.setState({ numberOfSnagsShown: this.state.snags.length })
                            console.log('marker1', JSON.stringify(this.state.markers[0]));
                            console.log('task Position1', this.state.taskPositions[0])
                        })
                    })

                }).catch(err => { alert('Some Problem Occured Try Again'); this.setState({ isLoading: false }) })

        })
    }

    pageClicked = (url) => {
        if (url == null) {
            return
        }
        let cities = [];
        this.state.filterObject.cities.forEach((val) => {
            cities.push(val.name);
        })
        console.log(cities);
        console.log(this.state.filterObject.severities);
        console.log(url)
        this.setState({ isLoading: true }, () => {

            Axios.post(url, { cities: cities, severities: this.state.filterObject.severities, categories: this.state.filterObject.categories, snags: this.state.filterObject.descriptions, areas: this.state.filterObject.areas, statuses: this.state.filterObject.statuses })
                .then(res => {

                    console.log(res.data);

                    let tempCities = [
                        { name: 'Gujranwala', region: 'Central' },
                        { name: 'Sialkot', region: 'Central' },
                        { name: 'Sargodah', region: 'Central' },
                        { name: 'Multan', region: 'Central' },
                        { name: 'Faisalabad', region: 'Central' },
                        { name: 'Islamabad', region: 'North' },
                        { name: 'Rawalpindi', region: 'North' },
                        { name: 'Peshawar', region: 'North' },
                    ];
                    let tempRegions = ['North', 'South', 'Central'];

                    let tempMarkers = [];

                    res.data.snags.data.forEach((val) => {

                        if (tempMarkers.includes(val.position) === false) {
                            tempMarkers.push(val.position);
                        }

                    })
                    let snags1 = res.data.snags.data;
                    let snags2 = res.data.snags.data;

                    tempMarkers = tempMarkers.map((val) => {
                        return JSON.parse(val)
                    })


                    this.setState({ snags: snags1, snagsPersistent: snags2, markers: tempMarkers, pages: res.data.snags.links, isLoading: false })

                }).catch(err => console.log(err))

        })

    }

    showImage = (ident, q_id, snag_id, task_assignment_status) => {

        console.log('q_id', q_id)

        let media = this.state.media;

        media = media.filter((val) => {
            return val.identification === ident
        })
        console.log('media', media);
        let images = JSON.parse(media[0].media);
        console.log('image first', images);
        images = images.filter((val) => {
            return val.qid == q_id
        })
        console.log('images after', images)
        this.setState({ mediaShow: true }, () => {
            this.setState({ images: images, folderName: media[0].name }, () => {
                console.log('identification', ident);
                console.log('question_id', q_id);
                console.log('folder name', this.state.folderName);
                console.log('images', this.state.images);
            })
        })

        console.log('snag id', snag_id)
        if (task_assignment_status === 'Complete') {
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagReportingGetRectifiedImages', { snagId: snag_id })
                .then(res => {

                    if (res.data.images) {
                        this.setState({ rectifiedImages: JSON.parse(res.data.images), task_id: res.data.task_id }, () => {
                            console.log('images', this.state.rectifiedImages)
                            console.log('task_id', this.state.task_id)
                        })
                    }

                }).catch(err => console.log(err))
        }

    }

    closeImage = () => {
        this.setState({ mediaShow: false, rectifiedImages: [], task_id: 0 })
    }

    downloadReport = () => {
        if (JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '4' })) {
            let CSV = '';

            let headings = [];

            for (let key in this.state.snags[0]) {
                if (key === 'form_name') {
                    headings[0] = { key: key, title: 'Category' }
                }
                if (key === 'q_name') {
                    headings[1] = { key: key, title: 'Audit Parameter' }
                }
                if (key === 'Snag_Status') {
                    headings[2] = { key: key, title: 'Status' }
                }
                if (key === 'Region') {
                    headings[3] = { key: key, title: 'Region' }
                }
                if (key === 'City') {
                    headings[4] = { key: key, title: 'City' }
                }
                if (key === 'Area') {
                    headings[5] = { key: key, title: 'Area' }
                }
                if (key === 'position') {
                    headings[6] = { key: key, title: 'Location' }
                }
                if (key === 'severity') {
                    headings[7] = { key: key, title: 'Severity' }
                }
                if (key === 'created') {
                    headings[8] = { key: key, title: 'Date Of Opening' }
                }
                if (key === 'actionStatus') {
                    headings[9] = { key: key, title: 'Actionable' }
                }
                if (key === 'closed_status') {
                    headings[10] = { key: key, title: 'Closed' }
                }
                if (key === 'dateOfClosing') {
                    headings[11] = { key: key, title: 'Date Of Closing' }
                }
                if (key === 'Remarks') {
                    headings[12] = { key: key, title: 'Remarks' }
                }

            }

            headings.forEach((val, index) => {
                CSV = CSV + val.title + ','
            })

            CSV = CSV + '\r\n';

            this.state.snags.forEach((val, index) => {
                let row = [];
                for (let key in val) {
                    let entry = val[key]
                    if (typeof entry === 'string') {
                        entry = entry.replace(/,/g, '');
                    }
                    if (key === 'form_name') {
                        row[0] = entry
                    }
                    if (key === 'q_name') {
                        row[1] = entry
                    }
                    if (key === 'Snag_Status') {
                        row[2] = entry
                    }
                    if (key === 'Region') {
                        row[3] = entry
                    }
                    if (key === 'City') {
                        row[4] = entry
                    }
                    if (key === 'Area') {
                        row[5] = entry
                    }
                    if (key === 'position') {
                        row[6] = entry
                    }
                    if (key === 'severity') {
                        if (entry === '1') {
                            row[7] = 'Low'
                        } else if (entry === '2') {
                            row[7] = 'Medium'
                        } else {
                            row[7] = 'High'
                        }
                    }
                    if (key === 'created') {
                        row[8] = entry
                    }
                    if (key === 'actionStatus') {
                        row[9] = entry
                    }
                    if (key === 'closed_status') {
                        row[10] = entry
                    }
                    if (key === 'dateOfClosing') {
                        row[11] = entry
                    }
                    if (key === 'Remarks') {
                        row[12] = entry
                    }
                }

                row.forEach((val1, ind1) => {
                    CSV = CSV + val1 + ','
                })

                CSV = CSV + '\r\n';
            })

            //Generate a file name
            var fileName = "Snag Report";
            //this will remove the blank-spaces from the title and replace it with an underscore
            //fileName += ReportTitle.replace(/ /g,"_");   

            //Initialize file format you want csv or xls
            var uri = 'data:text/kml;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension    

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Access Denied, Only Authorized Users')
            return
        }

    }

    taskInput = (e, type) => {
        let tempObj = this.state.task
        if (type == 'name') {
            tempObj.name = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
        if (type == 'urgency') {
            tempObj.urgency = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
        if (type == 'region') {
            tempObj.region = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
        if (type == 'city') {
            tempObj.city = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
        if (type == 'startDate') {
            tempObj.startDate = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
        if (type == 'dueDate') {
            tempObj.dueDate = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
        if (type == 'description') {
            tempObj.description = e.target.value;
            this.setState({ task: tempObj }, () => {
                console.log(this.state.task)
            });
        }
    }

    assignTask = () => {

        this.setState({ showAssignTask: true })

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getMembers', { cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                this.setState({ members: res.data.members, membersShow: res.data.members, functions: res.data.functions })

            }).catch(err => alert(err.response.data.message))
    }

    assignPressed = () => {
        console.log('snags', this.state.selectedSnags)
        console.log('task', this.state.task)
        console.log('members', this.state.selectedMembers)
        // task: {
        //     urgency: '',
        //     description: '',
        //     startDate: '',
        //     dueDate: '',
        //     Type: 'Snag'
        // }
        let status = true;
        for (let x in this.state.task) {
            if (this.state.task[x] === '') {
                status = false
            }
        }
        if (status === false) {
            alert('All fields are necessary');
            return
        }

        this.setState({ isLoading: true }, () => {

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/createTaskSnag', { snags: this.state.selectedSnags, task: this.state.task, members: this.state.selectedMembers, user_id: localStorage.getItem('id'), cust_id: localStorage.getItem('cust_id') })
                .then(res1 => {

                    console.log('response', res1.data)
                    if (res1.data === 'failed') {
                        alert('Some Problem Occured Please Try Again')
                        this.setState({ isLoading: false })
                        return
                    }
                    if (res1.data.mailStatus === 'nok') {
                        alert('Could not send mail')
                    }
                    let tempTaskPositions = res1.data.taskPostions
                    let tempTask = {
                        urgency: '',
                        description: '',
                        startDate: '',
                        dueDate: '',
                        Type: 'Snag'
                    }
                    let cities = [];
                    this.state.filterObject.cities.forEach((val) => {
                        cities.push(val.name);
                    })

                    Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagReportingGetSnags', { cities: cities, severities: this.state.filterObject.severities, categories: this.state.filterObject.categories, snags: this.state.filterObject.descriptions, areas: this.state.filterObject.areas, statuses: this.state.filterObject.statuses, actions: this.state.filterObject.actions, tasks: this.state.filterObject.tasks, cust_id: localStorage.getItem('cust_id') })
                        .then(res => {

                            console.log(res.data);

                            let tempMarkers = [];

                            res.data.snags.data.forEach((val) => {

                                if (tempMarkers.includes(val.position) === false) {
                                    tempMarkers.push(val.position);
                                }

                            })
                            let snags1 = res.data.snags.data;
                            let snags2 = res.data.snags.data;

                            tempMarkers = tempMarkers.map((val) => {
                                return JSON.parse(val)
                            })


                            this.setState({ taskPositions: tempTaskPositions, snags: snags1, snagsPersistent: snags2, markers: tempMarkers, pages: res.data.snags.links, initialLoad: false, openFilter: '' }, () => {
                                this.setState({ center: tempMarkers[0] }, () => {
                                    console.log('pages', this.state.pages)
                                    this.setState({ numberOfSnagsShown: this.state.snags.length, showAssignTask: false, selectedSnags: [], selectedMembers: [], task: tempTask }, () => {

                                        let tempDetails = []

                                        if (this.state.detailsToShowPosition.lat !== 0 && this.state.detailsToShowPosition.lng !== 0) {
                                            let stringifiedPosition = JSON.stringify(this.state.detailsToShowPosition)

                                            this.state.snags.forEach((item) => {

                                                if (item.position == stringifiedPosition) {
                                                    tempDetails.push(item)
                                                }
                                            })

                                        }

                                        this.setState({ detailsToShow: tempDetails, isLoading: false, })
                                    })
                                })
                            })

                        }).catch(err => { console.log(err); alert('Some Issue Occured Reloading the changes, Please refresh page to see changes'); this.setState({ isLoading: false }) })

                }).catch(err => { alert('Some Problem Occured Please Try Again'); this.setState({ isLoading: false }) })

        })

    }

    memberFilterHandleChange = (e, type) => {
        let tempMemberFilter = this.state.memberFilter
        if (type === 'city') {
            tempMemberFilter.city = e.target.value;
            this.setState({ memberFilter: tempMemberFilter }, () => {
                console.log(this.state.memberFilter)
                this.applyMemberFilter()
            })
        }
        if (type === 'region') {
            tempMemberFilter.region = e.target.value;
            this.setState({ memberFilter: tempMemberFilter }, () => {
                console.log(this.state.memberFilter)
                this.applyMemberFilter()
            })
        }
        if (type === 'function') {
            tempMemberFilter.function = e.target.value;
            this.setState({ memberFilter: tempMemberFilter }, () => {
                console.log(this.state.memberFilter)
                this.applyMemberFilter()
            })
        }
    }

    memberSelect = (val) => {

        let tempSelectedMembers = []

        if (tempSelectedMembers.some((value) => { return value.id === val.id }) === false) {
            tempSelectedMembers.push(val)
        } else {
            tempSelectedMembers = tempSelectedMembers.filter((val1) => {
                return val1.id !== val.id
            })
        }

        this.setState({ selectedMembers: tempSelectedMembers }, () => {
            console.log(this.state.selectedMembers)
        });
    }

    closeAssignTask = () => {

        let tempTask = {
            name: '',
            urgency: '',
            region: '',
            city: '',
            description: '',
            startDate: '',
            dueDate: '',
            Type: 'Snag'
        }

        this.setState({ task: tempTask, selectedMembers: [], selectedSnags: [] })
    }

    selectSnagsForTask = (val) => {

        let tempTask = {
            urgency: '',
            description: '',
            startDate: '',
            dueDate: '',
            Type: 'Snag'
        }

        let tempSelectedSnags = [val];

        // if (tempSelectedSnags.some((value) => { return value.id === val.id }) === false) {
        //     tempSelectedSnags.push(val);
        // } else {
        //     tempSelectedSnags = tempSelectedSnags.filter((value) => {
        //         return val.id !== value.id
        //     })
        // }

        this.setState({ selectedSnags: [...tempSelectedSnags], task: tempTask }, () => {
            console.log(this.state.selectedSnags)
        })

    }

    applyMemberFilter = () => {

        console.log('init', this.state.membersShow)

        let tempMembersShow = this.state.members;

        if (this.state.memberFilter.city === 'All' && this.state.memberFilter.region === 'All' && this.state.memberFilter.function === 'All') {
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city !== 'All' && this.state.memberFilter.region === 'All' && this.state.memberFilter.function === 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.city == this.state.memberFilter.city
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city === 'All' && this.state.memberFilter.region !== 'All' && this.state.memberFilter.function === 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.region == this.state.memberFilter.region
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city === 'All' && this.state.memberFilter.region === 'All' && this.state.memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == this.state.memberFilter.function
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city !== 'All' && this.state.memberFilter.region !== 'All' && this.state.memberFilter.function === 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.city == this.state.memberFilter.city && val.region == this.state.memberFilter.region
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city === 'All' && this.state.memberFilter.region !== 'All' && this.state.memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == this.state.memberFilter.function && val.region == this.state.memberFilter.region
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city !== 'All' && this.state.memberFilter.region === 'All' && this.state.memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == this.state.memberFilter.function && val.city == this.state.memberFilter.city
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }
        if (this.state.memberFilter.city !== 'All' && this.state.memberFilter.region !== 'All' && this.state.memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == this.state.memberFilter.function && val.city == this.state.memberFilter.city && val.region == this.state.memberFilter.region
            })
            this.setState({ membersShow: tempMembersShow }, () => {
                console.log('afterFilter', this.state.membersShow)
            })
        }

    }

    render() {
        //console.log('persistent2', filterObjectPersistent2)
        //filterObjectPersistent = filterObjectPersistent2
        const containerStyle = {
            width: '100%',
            height: '100%'
        };
        return (

            <div className='snagReportingWrapper'>

                {this.state.isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: '10000000' }}>
                        <Spinner />
                        <div style={{ clear: 'both' }}></div>
                        <h6 style={{ textAlign: 'center', width: '100%' }}>Please Wait while we generate your report</h6>
                    </div>
                }

                {this.state.initialLoad &&
                    <div style={{ height: '30%', width: '50%', background: '#3B5998', position: 'absolute', zIndex: '1000', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        Please Click on generate Report
                    </div>
                }

                {/* <div style={{position: 'absolute', height: '40%', width: '60%', overflow:'auto', left: '50%', top:'50%', transform:'translate(-50%, -50%)', background: 'lightgray'}}>

                </div> */}

                <div className='snagReporting_sidebar'>
                    <div style={{ height: '60px' }}>
                        <div>
                            <Link to='/home' ><i className="fa fa-home" title="Home" style={{ cursor: 'pointer', color: 'black', marginRight: '20px' }}></i></Link>
                            <Link to='/teamManagement/taskCreation'><i className="fa fa-tasks" title="Task Management" style={{ cursor: 'pointer', color: 'black' }}></i></Link>
                        </div>
                        <div style={{ fontWeight: 'bold', textAlign: 'center' }} >Snag Reporting</div>
                    </div>
                    <div style={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                        <div>
                            Region <i className="fa fa-angle-down"></i>
                            <div style={{ marginLeft: '20px' }}>
                                <input onChange={() => this.selectAll('region')} checked={this.state.filterObject.regions.length == filterObjectPersistent.regions.length} type="checkbox" /> Select All
                            </div>
                            {this.state.regions.map((item, index) => {
                                return (
                                    <div key={index} style={{ marginLeft: '20px' }}>
                                        <input onChange={() => this.addToFilter(item, 'region')} checked={this.state.filterObject.regions.includes(item) === true} type="checkbox" /> {item}
                                    </div>
                                )
                            })}
                        </div>

                        <div>
                            Cities <i className="fa fa-angle-down"></i>
                            <div style={{ marginLeft: '20px' }}>
                                <input onChange={() => this.selectAll('city')} checked={this.state.filterObject.cities.length == filterObjectPersistent.cities.length} type="checkbox" /> Select All
                            </div>
                            {this.state.cities.map((item, index) => {
                                return (
                                    <div key={index} style={{ marginLeft: '20px' }}>
                                        <input onChange={() => this.addToFilter(item, 'city')} type="checkbox" checked={this.state.filterObject.cities.some((val) => { return val.name == item.name })} /> {item.name}
                                    </div>
                                )
                            })}
                        </div>

                        <div>
                            Severity <i className="fa fa-angle-down"></i>
                            {['1', '2', '3'].map((item, index) => {
                                return (
                                    <div key={index} style={{ marginLeft: '20px' }}>
                                        <input onChange={() => this.addToFilter(item, 'severity')} type="checkbox" checked={this.state.filterObject.severities.includes(item) === true} />
                                        {item === '1' &&
                                            <span>Low</span>
                                        }
                                        {item === '2' &&
                                            <span>Medium</span>
                                        }
                                        {item === '3' &&
                                            <span>High</span>
                                        }

                                    </div>
                                )
                            })}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button onClick={() => this.fetchSnags()} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px' }}>Generate Report</button>
                        </div>

                        {/* <hr></hr>
                        <div>
                            Date
                            <div style={{ marginLeft: '20px' }}>
                                <div>From</div>
                                <div><input id="from" onChange={(e) => this.addToFilter(e, 'dateFrom')} type="date" /></div>

                            </div>
                            <div style={{ marginLeft: '20px' }}>
                                <div>To</div>
                                <div><input id="to" onChange={(e) => this.addToFilter(e, 'dateTo')} type="date" /></div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={() => this.applyFilter()} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px' }}>Apply Filter</button>
                            <button onClick={() => this.resetFilter()} style={{ cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px' }}>Reset Filter</button>
                        </div> */}
                    </div>
                </div>

                <div className='snagReporting_content'>

                    <div style={{ height: '5%', width: '100%', background: '#e0f4fa', color: '#04b2d9', fontSize: 'small', fontWeight: 'bold', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '50%' }}>
                            Total Filtered Snags: {this.state.numberOfSnagsShown}
                        </div>
                        <div style={{ width: '50%', textAlign: 'right' }}>
                            {this.state.selectedSnags.length > 0 &&
                                <button onClick={() => this.assignTask()} style={{ color: '#04b2d9', fontSize: 'small', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px', marginRight: '20px' }}>Assign Task</button>
                            }
                            {this.state.snags.length > 0 &&
                                <button onClick={() => this.downloadReport()} style={{ color: '#04b2d9', fontSize: 'small', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px', marginRight: '20px' }}>Download Report</button>
                            }
                            <button onClick={() => this.applyFilter()} style={{ color: '#04b2d9', fontSize: 'small', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px', marginRight: '20px' }}>Apply Filter</button>
                            <button onClick={() => this.resetFilter()} style={{ color: '#04b2d9', fontSize: 'small', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px' }}>Reset</button>
                        </div>
                    </div>
                    <div className="fixTableHead">
                        <table>
                            <thead>
                                <tr>
                                    <th onMouseLeave={() => { this.setState({ showFilterIcon: '', openFilter: '' }) }} onMouseOver={() => { this.setState({ showFilterIcon: 'Category' }) }}><div className={`${this.state.showFilterIcon === 'Category' ? "shorten" : ""}`}>Category</div>
                                        {this.state.showFilterIcon === 'Category' &&
                                            <i className={`fa fa-ellipsis-v filterIcon ${this.state.filterObject.categories.length !== filterObjectPersistent.categories.length && 'activeFilter'}`} onClick={() => this.openFilterWindow('category')} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                        }
                                        {this.state.openFilter === 'category' &&
                                            <div className='filterBox' style={{ height: 'auto' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} />
                                                </div>
                                                <div>
                                                    <input onChange={() => this.selectAll('category')} checked={this.state.filterObject.categories.length == filterObjectPersistent.categories.length} type="checkbox" /> Select All
                                                </div>
                                                {this.state.categories.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <input onChange={() => this.addToFilter(item, 'category')} type="checkbox" checked={this.state.filterObject.categories.includes(item)} /> {item}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </th>
                                    <th onMouseLeave={() => { this.setState({ showFilterIcon: '', openFilter: '' }) }} onMouseOver={() => { this.setState({ showFilterIcon: 'Audit Parameter' }) }}><div className={`${this.state.showFilterIcon === 'Audit Parameter' ? "shorten" : ""}`}> Audit Parameter </div>
                                        {this.state.showFilterIcon === 'Audit Parameter' &&
                                            <i className={`fa fa-ellipsis-v filterIcon ${this.state.filterObject.descriptions.length !== filterObjectPersistent.descriptions.length && 'activeFilter'}`} onClick={() => this.openFilterWindow('snag')} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                        }
                                        {this.state.openFilter === 'snag' &&
                                            <div className='filterBox'>
                                                <div style={{ textAlign: 'center' }}>
                                                    <input type="text" placeholder='search' onChange={(e) => this.search(e, 'description')} />
                                                </div>
                                                <div>
                                                    <input onChange={() => this.selectAll('description')} checked={this.state.filterObject.descriptions.length == filterObjectPersistent.descriptions.length} type="checkbox" /> Select All
                                                </div>
                                                {this.state.descriptions.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <input onChange={() => this.addToFilter(item, 'description')} type="checkbox" checked={this.state.filterObject.descriptions.includes(item)} /> {item}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </th>
                                    <th>Status</th>
                                    <th>Region</th>
                                    <th>City</th>
                                    <th onMouseLeave={() => { this.setState({ showFilterIcon: '', openFilter: '' }) }} onMouseOver={() => { this.setState({ showFilterIcon: 'Area' }) }}><div className={`${this.state.showFilterIcon === 'Area' ? "shorten" : ""}`}>Area </div>
                                        {this.state.showFilterIcon === 'Area' &&
                                            <i className={`fa fa-ellipsis-v filterIcon ${this.state.filterObject.areas.length !== filterObjectPersistent.areas.length && 'activeFilter'}`} onClick={() => this.openFilterWindow('area')} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                        }
                                        {this.state.openFilter === 'area' &&
                                            <div className='filterBox'>
                                                <div style={{ textAlign: 'center' }}>
                                                    <input type="text" placeholder='search' onChange={(e) => this.search(e, 'area')} />
                                                </div>
                                                <div>
                                                    <input onChange={() => this.selectAll('area')} checked={this.state.filterObject.areas.length == filterObjectPersistent.areas.length} type="checkbox" /> Select All
                                                </div>
                                                {this.state.areas.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <input onChange={() => this.addToFilter(item, 'area')} type="checkbox" checked={this.state.filterObject.areas.includes(item)} /> {item}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </th>
                                    <th>Severity</th>
                                    <th>Date of Opening</th>
                                    <th onMouseLeave={() => { this.setState({ showFilterIcon: '', openFilter: '' }) }} onMouseOver={() => { this.setState({ showFilterIcon: 'Closed' }) }}><div className={`${this.state.showFilterIcon === 'Closed' ? "shorten" : ""}`}>Closed</div>
                                        {this.state.showFilterIcon === 'Closed' &&
                                            <i className="fa fa-ellipsis-v filterIcon" onClick={() => this.openFilterWindow('status')} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                        }
                                        {this.state.openFilter === 'status' &&
                                            <div className='filterBox' style={{ height: 'auto' }}>
                                                {['yes'].map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <input onChange={() => this.addToFilter(item, 'status')} type="checkbox" checked={this.state.filterObject.statuses.includes(item)} /> {item}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </th>
                                    <th>Date of Closing</th>
                                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 3 }) &&
                                        <th onMouseLeave={() => { this.setState({ showFilterIcon: '', openFilter: '' }) }} onMouseOver={() => { this.setState({ showFilterIcon: 'Task' }) }}><div className={`${this.state.showFilterIcon === 'Task' ? "shorten" : ""}`}>Task </div>
                                            {this.state.showFilterIcon === 'Task' &&
                                                <i className="fa fa-ellipsis-v filterIcon" onClick={() => this.openFilterWindow('task')} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                            }
                                            {this.state.openFilter === 'task' &&
                                                <div className='filterBox' style={{ height: 'auto' }}>
                                                    {['assigned', 'rectified'].map((item, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <input onChange={() => this.addToFilter(item, 'task')} type="checkbox" checked={this.state.filterObject.tasks.includes(item)} /> {item}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            }

                                        </th>
                                    }
                                    <th>Assigned By</th>
                                    <th onMouseLeave={() => { this.setState({ showFilterIcon: '', openFilter: '' }) }} onMouseOver={() => { this.setState({ showFilterIcon: 'Action Status' }) }}><div className={`${this.state.showFilterIcon === 'Action Status' ? "shorten" : ""}`}>Action Status</div>
                                        {this.state.showFilterIcon === 'Action Status' &&
                                            <i className={`fa fa-ellipsis-v filterIcon ${this.state.filterObject.actions.length !== filterObjectPersistent.actions.length && 'activeFilter'}`} onClick={() => this.openFilterWindow('action_status')} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                        }
                                        {this.state.openFilter === 'action_status' &&
                                            <div className='filterBox' style={{ height: 'auto' }}>
                                                {['Actionable', 'Non Actionable', 'NA'].map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <input onChange={() => this.addToFilter(item, 'action_status')} type="checkbox" checked={this.state.filterObject.actions.includes(item)} /> {item}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </th>
                                    <th>Remarks</th>
                                    <th>Images</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.snags.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.form_name}</td>
                                            <td>{item.q_name}</td>
                                            <td>{item.Snag_Status}</td>
                                            <td>{item.Region}</td>
                                            <td>{item.City}</td>
                                            <td>{item.Area}</td>
                                            <td>
                                                {item.severity === '1' &&
                                                    <span>Low</span>
                                                }
                                                {item.severity === '2' &&
                                                    <span>Medium</span>
                                                }
                                                {item.severity === '3' &&
                                                    <span>High</span>
                                                }

                                            </td>
                                            <td>{item.created}</td>
                                            <td>{item.closed_status}</td>
                                            <td>{item.dateOfClosing}</td>
                                            {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 3 }) &&
                                                <td>
                                                    {item.task_assignment_status === null &&
                                                        <input type="checkbox" onChange={() => this.selectSnagsForTask(item)} checked={this.state.selectedSnags.some((val) => { return val.id === item.id })} />
                                                    }
                                                    {item.task_assignment_status !== null &&
                                                        <>
                                                            <span>{item.task_assignment_status}</span>
                                                            {item.closed_status === null && item.task_assignment_status === 'Complete' &&
                                                                <input type="checkbox" onChange={() => this.selectSnagsForTask(item)} checked={this.state.selectedSnags.some((val) => { return val.id === item.id })} />
                                                            }
                                                        </>
                                                    }
                                                </td>
                                            }
                                            <td>{item.assigned_by_name}</td>
                                            <td>{item.actionStatus}</td>
                                            <td>{item.Remarks}</td>
                                            <td><i style={{ cursor: 'pointer', fontSize: '10px' }} className="fa fa-image" onClick={() => this.showImage(item.identification, item.q_id, item.id, item.task_assignment_status)}></i></td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                    </div>

                    <div className='pagination'>
                        {this.state.pages.map((item, index) => {
                            return (
                                <div className={`pageItem ${item.label == '...' && 'borderRemove'} ${item.active && 'borderWhite'}`} key={index} onClick={() => this.pageClicked(item.url)}>
                                    {item.label === "&laquo; Previous" &&
                                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}><i className="fa fa-angle-left" aria-hidden="true"></i></span>
                                    }
                                    {item.label === "Next &raquo;" &&
                                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}><i className="fa fa-angle-right" aria-hidden="true"></i></span>

                                    }
                                    {item.label !== "Next &raquo;" && item.label !== "&laquo; Previous" &&
                                        <span style={{ width: '30px' }}>{item.label}</span>
                                    }

                                </div>
                            )
                        })}
                    </div>

                    <div className={`${this.state.mapFullScreen ? "mapFullScreen" : "mapView"}`}>
                        <div title='Full Screen' onClick={() => this.setState({ mapFullScreen: !this.state.mapFullScreen, selectedSnags: [] })} style={{ position: 'absolute', top: '5px', right: '5px', zIndex: '100000', background: 'white', cursor: 'pointer' }}>
                            <i className="fa fa-expand" aria-hidden="true"></i>
                        </div>
                        {/* <LoadScript
                            googleMapsApiKey="AIzaSyD6l5bH_gXHS6Qjxk4MdS_bDaqicwzI_uE"
                        // libraries={["visualization"]}
                        > */}
                        <GoogleMap
                            id="map"
                            mapContainerStyle={containerStyle}
                            center={this.state.center}
                            options={
                                { fullscreenControl: false }
                            }
                            zoom={9}
                        >
                            {this.state.markers.map((value, index) => {
                                return (
                                    <div key={index}>
                                        {this.state.taskPositions.includes(JSON.stringify(value)) &&
                                            <Marker
                                                onClick={() => this.markerClicked(value)}
                                                icon={{
                                                    url: `yellow.png`,
                                                    scaledSize: { width: 60, height: 60 },
                                                    anchor: { x: 5, y: 20 }
                                                }}
                                                position={value}
                                            />
                                        }
                                        {!this.state.taskPositions.includes(JSON.stringify(value)) &&
                                            <Marker
                                                onClick={() => this.markerClicked(value)}
                                                icon={{
                                                    url: `red.png`,
                                                    scaledSize: { width: 60, height: 60 },
                                                    anchor: { x: 5, y: 20 }
                                                }}
                                                position={value}
                                            />
                                        }
                                    </div>
                                )
                            })}

                            {this.state.detailsToShowPosition.lat != 0 && this.state.detailsToShowPosition.lng != 0 &&
                                <InfoWindow
                                    onCloseClick={() => this.infowindowclosed()}
                                    position={this.state.detailsToShowPosition}
                                >
                                    <div>
                                        {this.state.selectedSnags.length > 0 &&
                                            <button onClick={() => this.assignTask()} style={{ cursor: 'pointer', color: 'black', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '5px', marginRight: '20px' }}>Assign Task</button>
                                        }
                                        <table border='1'>
                                            <tr>
                                                <th>Category</th>
                                                <th>Snag</th>
                                                <th>Area</th>
                                                <th>Date of Opening</th>
                                                <th>Severity</th>
                                                <th>closed</th>
                                                <th>Date of Closing</th>
                                                <th>Task</th>
                                            </tr>
                                            {this.state.detailsToShow.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.form_name}</td>
                                                        <td>{value.q_name}</td>
                                                        <td>{value.Area}</td>
                                                        <td>{value.created}</td>
                                                        <td>
                                                            {value.severity === '1' &&
                                                                <span>Low</span>
                                                            }
                                                            {value.severity === '2' &&
                                                                <span>Medium</span>
                                                            }
                                                            {value.severity === '3' &&
                                                                <span>High</span>
                                                            }
                                                        </td>
                                                        <td>{value.closed_status}</td>
                                                        <td>{value.dateOfClosing}</td>
                                                        <td>
                                                            {value.task_assignment_status === null &&
                                                                <input type="checkbox" onChange={() => this.selectSnagsForTask(value)} checked={this.state.selectedSnags.some((val) => { return val.id === value.id })} />
                                                            }
                                                            {value.task_assignment_status !== null &&
                                                                <span>{value.task_assignment_status}</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )

                                            })}
                                        </table>
                                    </div>

                                </InfoWindow>
                            }
                            {/* <HeatmapLayer

                                    data={this.state.heatmapTestData}
                                    options={{
                                        radius: 30
                                    }}
                                />
                                <Polyline
                                    path={[
                                        {lat: 37.782, lng: -122.447},
                                        {lat: 37.785, lng: -122.435}
                                      ]}
                                /> */}

                        </GoogleMap>
                        {/* </LoadScript> */}
                    </div>

                </div>

                {this.state.mediaShow &&

                    <div className='snagImageContainer'>
                        <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'white', height: '30px', cursor: 'pointer' }} onClick={() => this.closeImage()}>x</div>
                        <div style={{ height: 'calc(50% - 30px)' }}>
                            <div style={{ textAlign: 'center', fontSize: '13px', height: '30px' }}>Snag Images</div>
                            {this.state.images.length > 0 &&
                                <div style={{ height: 'calc(100% - 30px)', width: '100%', overflow: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {this.state.images.map((value, index) => {
                                        return (
                                            <div key={index} style={{ height: '200px', width: '40%', boxSizing: 'border-box' }}>
                                                <a href={`${process.env.REACT_APP_AUDITIMAGES_BASE_URL}${this.state.folderName}/${value.media}`} target="_blank"><img src={`${process.env.REACT_APP_AUDITIMAGES_BASE_URL}${this.state.folderName}/${value.media}`} style={{ height: '100%', width: '100%' }} /></a>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                            {this.state.images.length === 0 &&
                                <div style={{ textAlign: 'center', color: 'white' }}>
                                    No Image for this Snag
                                </div>
                            }
                        </div>

                        {this.state.rectifiedImages.length > 0 &&
                            <div style={{ height: 'calc(50% - 30px)' }}>
                                <div style={{ textAlign: 'center', fontSize: '13px', height: '30px' }}>Rectification Images</div>
                                <div style={{ height: 'calc(100% - 30px)', width: '100%', overflow: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {this.state.rectifiedImages.map((value, index) => {
                                        return (
                                            <div key={index} style={{ height: '200px', width: '40%', boxSizing: 'border-box' }}>
                                                <a href={`${process.env.REACT_APP_TASKIMAGES_BASE_URL}${this.state.task_id}/${value}`} target="_blank"><img src={`${process.env.REACT_APP_TASKIMAGES_BASE_URL}${this.state.task_id}/${value}`} style={{ height: '100%', width: '100%' }} /></a>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }

                    </div>

                }

                {this.state.showAssignTask &&
                    <div className={`${this.state.mapFullScreen ? "taskAssignWizardMapFull" : "taskAssignWizard"}`}>

                        <div onClick={() => { this.setState({ showAssignTask: false }); this.closeAssignTask() }} style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', height: '30px', boxSizing: 'border-box' }}>x</div>

                        <div style={{ height: '30px', boxSizing: 'border-box', fontWeight: 'bold', paddingLeft: '10px' }}>Task Details</div>
                        <div className="Snag_Reporting_TeamCreationInputFieldsContainer" style={{ height: 'calc(50% - 60px)', overflow: 'auto', boxSizing: 'border-box', borderBottom: '1px solid darkgrey' }}>
                            <div className="Snag_Reporting_TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Urgency</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={'DEFAULT'} onChange={(e) => this.taskInput(e, 'urgency')} style={{ width: '90%' }}>
                                        <option value="DEFAULT" disabled>--Select Urgency--</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>
                            {/* <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Region</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={'DEFAULT'} onChange={(e) => this.taskInput(e, 'region')} style={{ width: '90%' }}>
                                        <option value="DEFAULT" disabled>--Select Region--</option>
                                        <option value="North">North</option>
                                        <option value="South">South</option>
                                        <option value="Central">Central</option>
                                    </select>
                                </div>
                            </div> */}
                            {/* <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>City</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={'DEFAULT'} onChange={(e) => this.taskInput(e, 'city')} style={{ width: '90%' }}>
                                        <option value="DEFAULT" disabled>--Select City--</option>
                                        <option value="Islamabad">Islamabad</option>
                                        <option value="Rawalpindi">Rawalpindi</option>
                                        <option value="Peshawar">Peshawar</option>
                                        <option value="Faisalabad">Faisalabad</option>
                                        <option value="Gujranwala">Gujranwala</option>
                                        <option value="Sialkot">Sialkot</option>
                                        <option value="Sargoda">Sargoda</option>
                                        <option value="Multan">Multan</option>
                                    </select>
                                </div>
                            </div> */}
                            <div className="Snag_Reporting_TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Start Date</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => this.taskInput(e, 'startDate')} style={{ width: '90%' }} type="date" />
                                </div>
                            </div>
                            <div className="Snag_Reporting_TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Due Date</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => this.taskInput(e, 'dueDate')} style={{ width: '90%' }} type="date" />
                                </div>
                            </div>
                            <div className="Snag_Reporting_TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Description</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <textarea onChange={(e) => this.taskInput(e, 'description')} style={{ width: '90%' }}></textarea>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: '30px', boxSizing: 'border-box', fontWeight: 'bold', paddingLeft: '20px' }}>Members</div>
                        <div style={{ height: 'calc(50% - 60px)', overflow: 'auto', boxSizing: 'border-box' }}>
                            <div className="Snag_Reporting_TeamCreationInputFieldsContainer2">
                                <div className="Snag_Reporting_TeamCreationInputField2">
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Region</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <select onChange={(e) => this.memberFilterHandleChange(e, 'region')} defaultValue={'All'} style={{ width: '90%' }}>
                                            <option value="All">All</option>
                                            <option value="North">North</option>
                                            <option value="South">South</option>
                                            <option value="Central">Central</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="Snag_Reporting_TeamCreationInputField2" >
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>City</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <select onChange={(e) => this.memberFilterHandleChange(e, 'city')} defaultValue={'All'} style={{ width: '90%' }}>
                                            <option value="All">All</option>
                                            <option value="Islamabad">Islamabad</option>
                                            <option value="Rawalpindi">Rawalpindi</option>
                                            <option value="Peshawar">Peshawar</option>
                                            <option value="Faisalabad">Faisalabad</option>
                                            <option value="Gujranwala">Gujranwala</option>
                                            <option value="Sialkot">Sialkot</option>
                                            <option value="Sargoda">Sargoda</option>
                                            <option value="Multan">Multan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="Snag_Reporting_TeamCreationInputField2" >
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Function</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <select onChange={(e) => this.memberFilterHandleChange(e, 'function')} defaultValue={'All'} style={{ width: '90%' }}>
                                            <option value='All'>All</option>
                                            {this.state.functions.map((val, index) => {
                                                return (
                                                    <option key={index} value={val.name}>{val.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="Snag_Reporting_TeamCreationInputFieldsContainer" style={{ textAlign: 'center' }}>
                                {this.state.membersShow.map((val, index) => {
                                    return (
                                        <div key={index} style={{ borderBottom: '1px solid black', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <div style={{ width: '50%', textAlign: 'right' }}>
                                                <input onChange={() => this.memberSelect(val)} type="checkbox" checked={this.state.selectedMembers.some((value) => { return value.id == val.id })} />
                                            </div>
                                            <div style={{ width: '50%', textAlign: 'left' }}>
                                                {val.name}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div style={{ height: '30px', textAlign: 'center', boxSizing: 'border-box' }}>
                            <button onClick={() => this.assignPressed()} style={{ cursor: 'pointer' }}>Assign</button>
                        </div>

                    </div>

                }

            </div>
        )
    }

    componentDidMount() {

        console.log('config in snag Reporting', 'just checking')

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

            console.log('config in snag Reporting', config)
            console.log('local storage in snag Reposrting', localStorage.getItem('id'))

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/snagReportingInit', { cust_id: localStorage.getItem('cust_id') }, config)
                .then(res => {
                    // setTimeout(() => {
                    //     this.setState({
                    //         // heatmapTestData: [
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.456), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.453), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.450), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.447), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.443), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.441), weight: 0.5 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.439), weight: 0.5 },
                    //         //     { location: new window.google.maps.LatLng(37.782, -122.435), weight: 0.5 },
                    //         //     { location: new window.google.maps.LatLng(37.785, -122.447), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.785, -122.445), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.785, -122.441), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.785, -122.437), weight: 0.1 },
                    //         //     { location: new window.google.maps.LatLng(37.785, -122.435), weight: 0.1 }
                    //         // ]
                    //     // }, () => {

                    //     //     let count = 0;
                    //     //     setInterval(() => {
                    //     //         count = (count + 1) % 200;
                    //     //         this.setState({
                    //     //             offset: count / 2 + "%",
                    //     //         })
                    //     //     }, 20)
                    //     // })
                    // }, 3000);

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

                    let tempTaskPositions = res.data.taskPositions;

                    let tempCities = [
                        { name: 'Gujranwala', region: 'Central' },
                        { name: 'Sialkot', region: 'Central' },
                        { name: 'Sargodah', region: 'Central' },
                        { name: 'Multan', region: 'Central' },
                        { name: 'Faisalabad', region: 'Central' },
                        { name: 'Islamabad', region: 'North' },
                        { name: 'Rawalpindi', region: 'North' },
                        { name: 'Peshawar', region: 'North' },
                    ];
                    let tempRegions = ['North', 'South', 'Central'];

                    let temp = { cities: tempCities, regions: tempRegions, areas: res.data.areas, categories: res.data.categories, descriptions: res.data.descriptions, severities: ['1', '2', '3'], statuses: ['yes', null], actions: ['Actionable', 'Non Actionable', 'NA'], tasks: ['assigned', 'rectified', null], dates: { from: '', to: '' } }
                    let temp2 = { cities: tempCities, regions: tempRegions, areas: res.data.areas, categories: res.data.categories, descriptions: res.data.descriptions, severities: ['1', '2', '3'], statuses: ['yes', null], actions: ['Actionable', 'Non Actionable', 'NA'], tasks: ['assigned', 'rectified', null], dates: { from: '', to: '' } }

                    filterObjectPersistent = temp2

                    this.setState({ taskPositions: tempTaskPositions, filterObject: temp, cities: tempCities, regions: tempRegions, areas: res.data.areas, categories: res.data.categories, descriptions: res.data.descriptions, media: res.data.media, isLoading: false }, () => {
                        console.log('persistent', filterObjectPersistent);
                        console.log('filter', this.state.filterObject);
                        console.log('taskPositions', this.state.taskPositions)
                    })

                }).catch(err => { alert('Some Problem Occured'); this.setState({ isLoading: false }) })
        })
    }
}



export default SnagReporting