import React from "react";
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';
import Axios from 'axios';
import '../styles/GisView.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom'
import OtdrMap from "./OtdrMap";

import PolylineMap from "./PolylineMap";

import Spinner from "./Spinner";
import { faSleigh } from "@fortawesome/free-solid-svg-icons";

var data = [];
var persistentTracks = [];
var persistentselectedTracks = [];

let colors = ['#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#0000FF', '#808080', '#FF5733', '#33C9FF', '#7EFF33', '#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#0000FF', '#808080', '#FF5733', '#33C9FF', '#7EFF33'];
let cableName = [];
let color2 = ['ff0000ff', 'ff00ff00', 'ff00ffff', 'ff0080ff', 'fff0000', '506E6E6E', '#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#0000FF', '#808080', '#FF5733', '#33C9FF', '#7EFF33'];

// let colors = ['#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000'];

// let color2 = ['#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000'];
let RowColors = {
    'Available': '#3BC10D',
    'Not Available': '#FD0F0F',
    'In Progress': '#F3FF00',
    'under litigation': '#FFAE00'
}

let myInterval

class GisView extends React.Component {

    state = {
        otdrShown: true,
        track: [],
        tracksShow: [],
        mappedmarkers: [],
        allcables: [],
        selectedmarkers: [],
        selectedcables: [],
        selectedtracks: [],
        cablestrack: [],
        recenter: { 'lat': 33, 'lng': 74 },
        recenterPersistent: { 'lat': 33, 'lng': 74 },
        zoom: 14,
        cities: [
            {
                "city": "Rawalpindi",
                "region": "north"
            },
            {
                "city": "Islamabad",
                "region": "north"
            },
            {
                "city": "Gujranwala",
                "region": "central"
            },
            {
                "city": "Multan",
                "region": "central"
            },
            {
                "city": "Faislabad",
                "region": "central"
            },
            {
                "city": "Peshawar",
                "region": "north"
            },
            {
                "city": "Sialkot",
                "region": "central"
            },
            {
                "city": "Sargodah",
                "region": "central"
            }
        ],
        regions: ['north', 'south', 'central'],
        selectedcities: [],
        selectedregions: [],
        ana: [],
        cables: [],
        cablesLength: 0,
        reportShown: false,
        imageShown: false,
        sideBarHide: false,
        detailsToShow: {},
        detailsToShowPosition: { lat: 0, lng: 0 },

        filteredDataResult: [],

        auditForms: [],
        auditMarkers: [],
        auditQuestions: [],
        auditDetailsToShow: [],
        auditDetailsToShowPosition: { lat: 0, lng: 0 },
        auditImageShown: false,

        cableDetailsToShow: [],
        cableDetailsToShowPosition: { lat: 0, lng: 0 },

        isLoading: false,

        isLoading2: false,

        regionsShown: false,
        citiesShown: false,
        tracksShown: false,
        OFCShown: false,
        cablesShown: false,

        markersShow: false,
        markersShowArray: [],

        moreOptionsShown: false,

        filterWindowOpen: false,

        summaryMarkers: [],
        summaryCables: [],

        selectAllTracks: [],

        citiesForReport: [],

        tracksForReport: [],

        openDownloadWizard: false,

        filterApplied: false,

        regionsOpen: [],
        citiesOpen: [],

        plannedSitesCities: ['Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Gujranwala', 'Multan', 'Sargodha'],
        plannedSitesSelectedCitys: [],
        plannedSites: {
            Islamabad: [],
            Rawalpindi: [],
            Faisalabad: [],
            Peshawar: [],
            Gujranwala: [],
            Multan: [],
            Sargodha: []
        },

        plannedSitesShown: false,
        planned: false,

        potentialSitesRegions: ['North', 'South', 'Central'],
        potentialSitesSelectedRegions: [],
        potentialSites: {
            North: [],
            South: [],
            Central: []
        },

        totalSelectedPlannedSites: 0,
        totalSelectedPotentialSites: 0,

        potentialSitesShown: false,
        potentialOperatorShown: false,
        potential: false,

        rowShown: false,
        RowColors: {
            'Available': { color: '#3BC10D', opacity: 0.4 },
            'Not Available': { color: '#FD0F0F', opacity: 0.4 },
            'In Progress': { color: '#F3FF00', opacity: 0.4 },
            'under litigation': { color: '#FFAE00', opacity: 0.4 }
        },

        otdrResults: [],

        otdrFileLink: '',
        otdrFileLinkPosition: { lat: 0, lng: 0 },

        offset: '0%',

        otdrCities: ['Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Gujranwala', 'Sialkot', 'Sargodah', 'Multan'],
        otdrInfo: []

    }

    otdrMapClicked = (position, file) => {
        console.log(file)
        console.log(process.env.REACT_APP_BACKEND_BASE_URL + 'otdrResults/' + file)
        this.setState({ otdrFileLink: process.env.REACT_APP_BACKEND_BASE_URL + 'otdrResults/' + file, otdrFileLinkPosition: position })
    }

    otdrResultsClicked = () => {
        if (this.state.otdrResults.length > 0) {
            this.setState({ otdrResults: [], otdrInfo: [] })
            return
        }
        this.setState({ isLoading2: true }, () => {

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getOtdrResults')
                .then(res => {
                    res.data.results.forEach((val) => {
                        val.locA = JSON.parse(val.locA);
                        val.locB = JSON.parse(val.locB);
                        val.line = [val.locA, val.locB];

                    })


                    this.setState({ isLoading2: false, otdrResults: res.data.results }, () => {
                        let tempOtdrInfo = [];

                        this.state.otdrCities.forEach((city) => {

                            let sum = 0;

                            this.state.otdrResults.forEach((result) => {
                                if (result.city === city) {
                                    sum = sum + parseFloat(result.length)
                                }
                            })

                            let temp = { city: city, length: sum }

                            tempOtdrInfo.push(temp);
                        })

                        let total = 0

                        tempOtdrInfo.forEach((result2) => {

                            total = total + result2.length
                        })

                        tempOtdrInfo.push({ city: 'Total', length: total })

                        this.setState({ otdrInfo: tempOtdrInfo }, () => {

                            if (this.state.selectedtracks.length === 0) {
                                this.setState({ zoom: 5 })
                            }
                        });

                    });
                }).catch((err) => {
                    console.log(err)
                    this.setState({ isLoading2: false }, () => {
                        alert('Some problem Occured, Please Try again')
                    })
                })

        })

    }

    rowTypeClicked = (type) => {

        let tempRowColors = this.state.RowColors;

        if (type == 'NA') {
            if (tempRowColors['Not Available'].opacity != 0) {
                tempRowColors['Not Available'].opacity = 0
            } else {
                tempRowColors['Not Available'].opacity = 0.4
            }
        }

        if (type == 'A') {
            if (tempRowColors['Available'].opacity != 0) {
                tempRowColors['Available'].opacity = 0
            } else {
                tempRowColors['Available'].opacity = 0.4
            }
        }

        if (type == 'IP') {
            if (tempRowColors['In Progress'].opacity != 0) {
                tempRowColors['In Progress'].opacity = 0
            } else {
                tempRowColors['In Progress'].opacity = 0.4
            }
        }

        if (type == 'UL') {
            if (tempRowColors['under litigation'].opacity != 0) {
                tempRowColors['under litigation'].opacity = 0
            } else {
                tempRowColors['under litigation'].opacity = 0.4
            }
        }

        this.setState({ RowColors: tempRowColors })

    }
    infowindowclosed = () => {
        var temp = { lat: 0, lng: 0 }
        this.setState({ detailsToShowPosition: temp })
    }
    auditInfowindowclosed = () => {
        var temp = { lat: 0, lng: 0 }
        this.setState({ auditDetailsToShowPosition: temp })
    }

    cableInfowindowclosed = () => {
        var temp = { lat: 0, lng: 0 }
        this.setState({ cableDetailsToShowPosition: temp })
    }
    markerClicked = (val, detail, value) => {
        var temp = { lat: val[0], lng: val[1] }
        this.setState({ detailsToShowPosition: temp })
        this.setState({ detailsToShow: detail[0] })

        //this.setState({});
    }

    markerMouseOver = (val) => {

        let temp = val;
        temp = temp.substr(4);
    }

    auditMarkerClicked = (val) => {
        this.setState({ isLoading: true }, () => {

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/markerClicked', { position: val })
                .then(res => {
                    console.log('check', res.data)
                    this.setState({ auditDetailsToShowPosition: val, auditDetailsToShow: res.data.question, auditForms: res.data.forms, isLoading: false });

                }).catch(err => console.log(err))

        })

    }

    addCity = (val) => {
        let tempCities = this.state.citiesForReport
        if (tempCities.includes(val)) {
            tempCities = tempCities.filter((value) => {
                return value !== val
            })
        } else {
            tempCities.push(val)
        }
        this.setState({ citiesForReport: tempCities }, () => {
            console.log(this.state.citiesForReport)
        })
    }
    addMarker = async (val) => {
        var temp = [];
        if (this.state.selectedmarkers.includes(`OFC/${val}`)) {
            for (var i = 0; i < this.state.selectedmarkers.length; i++) {
                if (`OFC/${val}` != this.state.selectedmarkers[i]) {
                    temp.push(this.state.selectedmarkers[i]);
                }
            }
        } else {
            temp = this.state.selectedmarkers;
            temp.push(`OFC/${val}`);
        }

        await this.updatefilter(temp);
    }

    addCable = async (val) => {
        var temp = [];
        if (this.state.selectedcables.includes(val)) {
            for (var i = 0; i < this.state.selectedcables.length; i++) {
                if (val != this.state.selectedcables[i]) {
                    temp.push(this.state.selectedcables[i]);
                }
            }
        } else {
            temp = this.state.selectedcables;
            temp.push(val);
        }

        await this.updateCables(temp);
    }

    addTrack = async (val) => {
        var temp = [];
        var cable = [];
        if (this.state.selectedtracks.some((value) => { return value.id == val.id })) {
            for (var i = 0; i < this.state.selectedtracks.length; i++) {
                if (val.id != this.state.selectedtracks[i].id) {
                    temp.push(this.state.selectedtracks[i]);
                    this.state.selectedtracks[i]['track'].forEach((val) => {
                        val['row_status'] = this.state.selectedtracks[i]['row_status']
                        cable.push(val)
                    })
                }
            }
        } else {
            temp = this.state.selectedtracks;
            cable = this.state.cablestrack;
            temp.push(val);
            val.track.forEach((value) => {
                value['row_status'] = val.row_status;
                cable.push(value)
            })
        }
        persistentselectedTracks = temp;
        await this.updateTracks(temp, cable);
        //var alltracksdata = [];
        var allmarkersdata = [];
        for (var m = 0; m < this.state.selectedtracks.length; m++) {
            var track = this.state.selectedtracks[m]['track'];

            var markers = this.state.selectedtracks[m]['markerposition'];
            for (var j = 0; j < markers.length; j++) {
                allmarkersdata.push(markers[j]);
            }
            //alltracksdata.push(this.state.selectedtracks[i]);
            //this.setState({ recenter: track[0]['data'][0] })
        }
        //this.setState({ track: alltracksdata });
        var recenter = { lat: 0, lng: 0 };
        if (allmarkersdata.length > 0) {
            for (let x in allmarkersdata[allmarkersdata.length - 1]) {
                if (x != 'detail' && x != 'id', x != 'subtrack') {
                    recenter.lat = allmarkersdata[allmarkersdata.length - 1][x][0];
                    recenter.lng = allmarkersdata[allmarkersdata.length - 1][x][1]
                }
            }
        } else {
            recenter = this.state.recenterPersistent
        }
        this.setState({ mappedmarkers: allmarkersdata, recenter: recenter });

    }

    addRegion = async (val) => {
        var temp = [];
        if (this.state.selectedregions.includes(val)) {
            for (var i = 0; i < this.state.selectedregions.length; i++) {
                if (val != this.state.selectedregions[i]) {
                    temp.push(this.state.selectedregions[i]);
                }
            }
        } else {
            temp = this.state.selectedregions;
            temp.push(val);
        }

        await this.updateRegions(temp);

        this.regionSelected();
    }

    citySelected = () => {
        let temporaryTracks = [];

        this.state.track.forEach((val) => {
            if (this.state.selectedcities.some((value) => { return value.city === val.city })) {
                temporaryTracks.push(val)
            }
        })

        this.setState({ selectedtracks: temporaryTracks }, () => {
            var temporaryCable = [];
            this.state.selectedtracks.forEach((val) => {
                val.track.forEach((value) => {
                    temporaryCable.push(value)
                })
            })
            this.setState({ cablestrack: temporaryCable }, () => {
                var allmarkersdata = [];
                for (var m = 0; m < this.state.selectedtracks.length; m++) {
                    var track = this.state.selectedtracks[m]['track'];

                    var markers = this.state.selectedtracks[m]['markerposition'];
                    for (var j = 0; j < markers.length; j++) {
                        allmarkersdata.push(markers[j]);
                    }
                    //alltracksdata.push(this.state.selectedtracks[i]);
                    this.setState({ recenter: track[0]['data'][0] })
                }
                //this.setState({ track: alltracksdata });
                this.setState({ mappedmarkers: allmarkersdata }, () => {
                });
            });
        })
    }

    regionSelected = () => {
        let temporaryCities = []
        this.state.cities.forEach((val) => {
            if (this.state.selectedregions.includes(val.region)) {
                temporaryCities.push(val)
            }
        })

        this.setState({ selectedcities: temporaryCities }, () => {

            let temporaryTracks = [];

            this.state.track.forEach((val) => {
                if (this.state.selectedregions.includes(val.region) && this.state.selectedcities.some((value) => { return value.city === val.city })) {
                    temporaryTracks.push(val)
                }
            })

            this.setState({ selectedtracks: temporaryTracks }, () => {
                var temporaryCable = [];
                this.state.selectedtracks.forEach((val) => {
                    val.track.forEach((value) => {
                        temporaryCable.push(value)
                    })
                })
                this.setState({ cablestrack: temporaryCable }, () => {
                    var allmarkersdata = [];
                    for (var m = 0; m < this.state.selectedtracks.length; m++) {
                        var track = this.state.selectedtracks[m]['track'];

                        var markers = this.state.selectedtracks[m]['markerposition'];
                        for (var j = 0; j < markers.length; j++) {
                            allmarkersdata.push(markers[j]);
                        }
                        //alltracksdata.push(this.state.selectedtracks[i]);
                        this.setState({ recenter: track[0]['data'][0] })
                    }
                    //this.setState({ track: alltracksdata });
                    this.setState({ mappedmarkers: allmarkersdata });
                });
            })
        });
    }
    updateCities = async (temp) => {
        this.setState({ selectedcities: temp })
    }
    updateRegions = async (temp) => {
        this.setState({ selectedregions: temp })
    }
    updatefilter = async (temp) => {
        this.setState({ selectedmarkers: temp }, () => {
            console.log('checking selected markers', this.state.selectedmarkers)
        })
    }
    updateCables = async (temp) => {
        this.setState({ selectedcables: temp })
    }
    updateTracks = async (temp, cable) => {
        this.setState({ selectedtracks: temp });
        this.setState({ cablestrack: cable }, () => {
        });
    }
    applyFilter = () => {
        if (this.state.selectedtracks.length === 0) {
            alert('Please Select Cities on which filters are to be applied')
            return;
        }
        this.setState({ rowShown: false }, () => {
            this.setState({ mappedmarkers: [] });
            var cable = [];
            var tempTrack = persistentselectedTracks;
            var filtered = [];
            var totalLength = 0;
            var tempMappedMarkers = [];
            var summaryCables = [];
            var summaryMarkers = [];

            this.state.selectedmarkers.forEach((val) => {
                var temp = { name: val, quantity: 0 }

                this.state.selectedtracks.forEach((val1, trackindex) => {
                    val1.markerposition.forEach((val2) => {
                        for (let x in val2) {
                            if (x != 'detail' && x != 'id' && x != 'subtrack') {
                                if (x == val) {
                                    temp.quantity = temp.quantity + 1;
                                }
                            }
                        }
                    })
                })

                if (temp.quantity > 0) {
                    summaryMarkers.push(temp);
                }
            })

            this.state.selectedcables.forEach((val) => {
                var temp = { name: val, lenght: 0 }
                this.state.selectedtracks.forEach((val2, trackindex) => {
                    val2.track.forEach((val3, index) => {
                        val3.name.forEach((name, ind) => {
                            console.log(name)
                            if (val === name.trim()) {
                                for (var i = 0; i < val3.data.length - 1; i++) {
                                    temp.lenght = temp.lenght + this.distance(val3.data[i]['lat'], val3.data[i]['lng'], val3.data[i + 1]['lat'], val3.data[i + 1]['lng']);
                                }
                            }
                        })

                    })
                })
                console.log('checking cables', temp);
                if (temp.lenght > 0) {
                    summaryCables.push(temp);
                }

            })

            this.state.selectedtracks.forEach((val, trackindex) => {
                var trackName = val.name;
                var markers = [];
                var cables = [];

                this.state.selectedmarkers.forEach((val1) => {
                    var temp = { name: val1, quantity: 0 }

                    val.markerposition.forEach((val2) => {
                        for (let x in val2) {
                            if (x != 'detail' && x != 'id' && x != 'subtrack') {
                                if (x == val1) {
                                    temp.quantity = temp.quantity + 1;
                                    tempMappedMarkers.push(val2);
                                }
                            }
                        }
                    })
                    if (temp.quantity > 0) {
                        markers.push(temp);
                    }
                })
                this.state.selectedcables.forEach((val3) => {
                    var temp2 = { name: val3, lenght: 0 }
                    val.track.forEach((val4, index) => {
                        val4.name.forEach((name, ind) => {
                            if (val3 == name) {
                                for (var i = 0; i < val4.data.length - 1; i++) {
                                    temp2.lenght = temp2.lenght + this.distance(val4.data[i]['lat'], val4.data[i]['lng'], val4.data[i + 1]['lat'], val4.data[i + 1]['lng']);
                                }
                                var seperatecable = [];
                                var colorIndex = this.state.cables.indexOf(name);
                                seperatecable['name'] = name;
                                seperatecable['data'] = val4.data;
                                seperatecable['color'] = colorIndex;
                                seperatecable['shape'] = val4.shape;
                                seperatecable['width'] = val4.width;
                                cable.push(seperatecable);
                            }
                        })

                    })
                    if (temp2.lenght > 0) {
                        cables.push(temp2);
                        totalLength = totalLength + temp2.lenght;
                    }
                })
                filtered.push({ track: trackName, markers: markers, cables: cables });
            })


            var totalquantity = 0;
            var totallength = 0;

            summaryMarkers.forEach((val) => {
                totalquantity = totalquantity + val.quantity
            })
            summaryCables.forEach((val) => {
                totallength = totallength + val.lenght
            })
            var tempTotalSummaryCables = { name: 'Total', lenght: totallength }
            var tempTotalSummaryMarkers = { name: 'Total', quantity: totalquantity }
            let tempMarkersShowArray = [];
            if (this.state.selectedtracks.length > 0) {
                tempMarkersShowArray.push('N/W Elements')
            }
            summaryCables.push(tempTotalSummaryCables)
            summaryMarkers.push(tempTotalSummaryMarkers)
            this.setState({ filteredDataResult: filtered, cablesLength: totalLength, mappedmarkers: tempMappedMarkers, cablestrack: cable, summaryMarkers: summaryMarkers, summaryCables: summaryCables, markersShowArray: tempMarkersShowArray, filterWindowOpen: false, filterApplied: true, reportShown: true }, () => {
                console.log('checking mapped Markers', this.state.mappedmarkers)
            })

        })
    }
    // distance = (lat1, lon1, lat2, lon2) => {
    //     if ((lat1 == lat2) && (lon1 == lon2)) {
    //         return 0;
    //     }
    //     else {
    //         var radlat1 = lat1 * (Math.PI / 180);
    //         var radlat2 = lat2 * (Math.PI  / 180);
    //         var theta = lon1 - lon2;
    //         var radtheta = Math.PI * theta / 180;
    //         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    //         if (dist > 1) {
    //             dist = 1;
    //         }
    //         dist = Math.acos(dist);
    //         dist = dist * 180 / Math.PI;
    //         dist = dist * 60 * 1.1515;
    //         dist = dist * 1.609344
    //         return dist;
    //     }
    // }

    distance = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    toRad = (Value) => {
        return Value * Math.PI / 180;
    }

    download = (id) => {
        if (this.props.id === '18') {
            this.createKML(id);
            return
        } else {
            alert('Only Authorized Users are allowed to download')
            return
        }
    }

    delete = (name, id) => {
        Axios.post('https://joyndigital.com/Latitude/public/api/customer/fiber/delete', { id: id, name: name })
            .then(res => {

            }).catch(err => console.log(err))
    }

    downloadReport = (JSONData, ReportTitle, ShowLabel) => {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = [];
        arrData = typeof JSONData != 'object' ? JSONData : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        //CSV += ReportTitle + '\r\n\n';
        var head = ['Segment Name', 'Category', "Item Name", "Quantity"]
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in head) {
                //Now convert each value to string and comma-seprated
                row += head[index] + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]['markers']) {
                row += '"' + arrData[i]['track'] + '",';
                row += '"OFC",';
                row += '"' + arrData[i]['markers'][index]['name'] + '",';
                row += '"' + arrData[i]['markers'][index]['quantity'] + '",';
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
                row = "";
                row = "";
                CSV += row + '\r\n';
            }
            for (var index in arrData[i]['cables']) {
                row += '"' + arrData[i]['track'] + '",';
                row += '"Cable",';
                row += '"' + arrData[i]['cables'][index]['name'] + '",';
                row += '"' + arrData[i]['cables'][index]['lenght'] + '",';
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
                row = "";
                row = "";
                CSV += row + '\r\n';
            }
            row = "";
            CSV += row + '\r\n';
            //add a line break after each row

        }

        console.log('checking', CSV);

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "Infrastrature Survey Report";
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
    }
    closeReport = () => {
        this.setState({ reportShown: false })
    }

    showImages = () => {
        this.setState({ imageShown: true })
    }

    showAuditImage = () => {
        this.setState({ auditImageShown: true })
    }

    closeImage = () => {
        this.setState({ imageShown: false })
    }

    closeAuditImage = () => {
        this.setState({ auditImageShown: false })
    }

    hideSideBar = () => {
        this.setState({ sideBarHide: true })
    }

    showSideBar = () => {
        this.setState({ sideBarHide: false })
    }

    downloadReport2 = () => {
        if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '4' }) === false){
            alert("Access Denied, No unauthorized access");
            return 
        }
        if (this.state.citiesForReport.length === 0) {
            alert('Please Select the cities to generate the report');
            return
        }
        if (this.state.citiesForReport.length !== 0 && (this.state.selectedcables.length === 0 && this.state.selectedmarkers.length === 0)) {
            alert('You have not selected any network elements or cables');
            return
        }
        if (this.state.citiesForReport.length !== 0 && (this.state.selectedcables.length !== 0 && this.state.selectedmarkers.length === 0)) {
            alert('Warning!!! You have not selected any Network Elements, Report will show empty results for Network Elements');
        }
        if (this.state.citiesForReport.length !== 0 && (this.state.selectedcables.length === 0 && this.state.selectedmarkers.length !== 0)) {
            alert('Warning!!! You have not selected any Cables, Report will show empty results for Cables');
        }
        this.setState({ isLoading2: true }, () => {
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/inspectionDashboardInitGetTracksMultipleCity', { cities: this.state.citiesForReport })
                .then(res => {
                    data = res.data;
                    var alltracksdata = [];
                    //var allmarkersdata = [];
                    for (var i = 0; i < data.data.length; i++) {
                        var track = JSON.parse(data.data[i]['data']);
                        alltracksdata.push(track);
                    }
                    this.setState({ tracksForReport: alltracksdata }, () => {
                        this.setState({ rowShown: false }, () => {
                            this.setState({ mappedmarkers: [] });
                            var cable = [];
                            var filtered = [];
                            var totalLength = 0;
                            var summaryCables = [];
                            var summaryMarkers = [];

                            this.state.selectedmarkers.forEach((val) => {
                                var temp = { name: val, quantity: 0 }

                                this.state.tracksForReport.forEach((val1, trackindex) => {
                                    val1.markerposition.forEach((val2) => {
                                        for (let x in val2) {
                                            if (x != 'detail' && x != 'id' && x != 'subtrack') {
                                                if (x == val) {
                                                    temp.quantity = temp.quantity + 1;
                                                }
                                            }
                                        }
                                    })
                                })

                                if (temp.quantity > 0) {
                                    summaryMarkers.push(temp);
                                }
                            })

                            this.state.selectedcables.forEach((val) => {
                                var temp = { name: val, lenght: 0 }

                                this.state.tracksForReport.forEach((val2, trackindex) => {
                                    val2.track.forEach((val3, index) => {
                                        val3.name.forEach((name, ind) => {
                                            if (val == name.trim()) {
                                                for (var i = 0; i < val3.data.length - 1; i++) {
                                                    temp.lenght = temp.lenght + this.distance(val3.data[i]['lat'], val3.data[i]['lng'], val3.data[i + 1]['lat'], val3.data[i + 1]['lng']);
                                                }
                                            }
                                        })

                                    })
                                })

                                if (temp.lenght > 0) {
                                    summaryCables.push(temp);
                                }

                            })

                            this.state.tracksForReport.forEach((val, trackindex) => {
                                var trackName = val.name;
                                var markers = [];
                                var cables = [];

                                this.state.selectedmarkers.forEach((val1) => {
                                    var temp = { name: val1, quantity: 0 }

                                    val.markerposition.forEach((val2) => {
                                        for (let x in val2) {
                                            if (x != 'detail' && x != 'id' && x != 'subtrack') {
                                                if (x == val1) {
                                                    temp.quantity = temp.quantity + 1;
                                                }
                                            }
                                        }
                                    })
                                    if (temp.quantity > 0) {
                                        markers.push(temp);
                                    }
                                })
                                this.state.selectedcables.forEach((val3) => {
                                    var temp2 = { name: val3, lenght: 0 }
                                    val.track.forEach((val4, index) => {
                                        val4.name.forEach((name, ind) => {
                                            if (val3 == name) {
                                                for (var i = 0; i < val4.data.length - 1; i++) {
                                                    temp2.lenght = temp2.lenght + this.distance(val4.data[i]['lat'], val4.data[i]['lng'], val4.data[i + 1]['lat'], val4.data[i + 1]['lng']);
                                                }
                                                var seperatecable = [];
                                                var colorIndex = this.state.cables.indexOf(name);
                                                seperatecable['name'] = name;
                                                seperatecable['data'] = val4.data;
                                                seperatecable['color'] = colorIndex;
                                                seperatecable['shape'] = val4.shape;
                                                seperatecable['width'] = val4.width;
                                                cable.push(seperatecable);
                                            }
                                        })

                                    })
                                    if (temp2.lenght > 0) {
                                        cables.push(temp2);
                                        totalLength = totalLength + temp2.lenght;
                                    }
                                })
                                filtered.push({ track: trackName, markers: markers, cables: cables });
                            })


                            var totalquantity = 0;
                            var totallength = 0;

                            summaryMarkers.forEach((val) => {
                                totalquantity = totalquantity + val.quantity
                            })
                            summaryCables.forEach((val) => {
                                totallength = totallength + val.lenght
                            })
                            var tempTotalSummaryCables = { name: 'Total', lenght: totallength }
                            var tempTotalSummaryMarkers = { name: 'Total', quantity: totalquantity }
                            let tempMarkersShowArray = [];
                            summaryCables.push(tempTotalSummaryCables)
                            summaryMarkers.push(tempTotalSummaryMarkers)
                            this.setState({ filteredDataResult: filtered, cablesLength: totalLength, cablestrack: cable, summaryMarkers: summaryMarkers, summaryCables: summaryCables, isLoading2: false }, () => {
                                this.downloadReport(this.state.filteredDataResult, "Report", true)
                            })

                        })
                    })
                }).catch(err => {
                    console.log(err);
                    this.setState({ isLoading2: false });
                })
        })
    }

    showReport = () => {
        if (this.state.citiesForReport.length === 0) {
            alert('Please Select the cities to generate the report');
            return
        }
        if (this.state.citiesForReport.length !== 0 && (this.state.selectedcables.length === 0 && this.state.selectedmarkers.length === 0)) {
            alert('You have not selected any network elements or cables');
            return
        }
        if (this.state.citiesForReport.length !== 0 && (this.state.selectedcables.length !== 0 && this.state.selectedmarkers.length === 0)) {
            alert('Warning!!! You have not selected any Network Elements, Report will show empty results for Network Elements');
        }
        if (this.state.citiesForReport.length !== 0 && (this.state.selectedcables.length === 0 && this.state.selectedmarkers.length !== 0)) {
            alert('Warning!!! You have not selected any Cables, Report will show empty results for Cables');
        }
        this.setState({ isLoading2: true }, () => {
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/inspectionDashboardInitGetTracksMultipleCity', { cities: this.state.citiesForReport })
                .then(res => {
                    data = res.data;
                    var alltracksdata = [];
                    //var allmarkersdata = [];
                    for (var i = 0; i < data.data.length; i++) {
                        var track = JSON.parse(data.data[i]['data']);
                        alltracksdata.push(track);
                    }
                    this.setState({ tracksForReport: alltracksdata }, () => {
                        this.setState({ rowShown: false }, () => {
                            var cable = [];
                            var filtered = [];
                            var totalLength = 0;
                            var summaryCables = [];
                            var summaryMarkers = [];

                            this.state.selectedmarkers.forEach((val) => {
                                var temp = { name: val, quantity: 0 }

                                this.state.tracksForReport.forEach((val1, trackindex) => {
                                    val1.markerposition.forEach((val2) => {
                                        for (let x in val2) {
                                            if (x != 'detail' && x != 'id' && x != 'subtrack') {
                                                if (x == val) {
                                                    temp.quantity = temp.quantity + 1;
                                                }
                                            }
                                        }
                                    })
                                })

                                if (temp.quantity > 0) {
                                    summaryMarkers.push(temp);
                                }
                            })

                            this.state.selectedcables.forEach((val) => {
                                var temp = { name: val, lenght: 0 }

                                this.state.tracksForReport.forEach((val2, trackindex) => {
                                    val2.track.forEach((val3, index) => {
                                        val3.name.forEach((name, ind) => {
                                            if (val == name.trim()) {
                                                for (var i = 0; i < val3.data.length - 1; i++) {
                                                    temp.lenght = temp.lenght + this.distance(val3.data[i]['lat'], val3.data[i]['lng'], val3.data[i + 1]['lat'], val3.data[i + 1]['lng']);
                                                }
                                            }
                                        })

                                    })
                                })

                                if (temp.lenght > 0) {
                                    summaryCables.push(temp);
                                }

                            })

                            this.state.tracksForReport.forEach((val, trackindex) => {
                                var trackName = val.name;
                                var markers = [];
                                var cables = [];

                                this.state.selectedmarkers.forEach((val1) => {
                                    var temp = { name: val1, quantity: 0 }

                                    val.markerposition.forEach((val2) => {
                                        for (let x in val2) {
                                            if (x != 'detail' && x != 'id' && x != 'subtrack') {
                                                if (x == val1) {
                                                    temp.quantity = temp.quantity + 1;
                                                }
                                            }
                                        }
                                    })
                                    if (temp.quantity > 0) {
                                        markers.push(temp);
                                    }
                                })
                                this.state.selectedcables.forEach((val3) => {
                                    var temp2 = { name: val3, lenght: 0 }
                                    val.track.forEach((val4, index) => {
                                        val4.name.forEach((name, ind) => {
                                            if (val3 == name) {
                                                for (var i = 0; i < val4.data.length - 1; i++) {
                                                    temp2.lenght = temp2.lenght + this.distance(val4.data[i]['lat'], val4.data[i]['lng'], val4.data[i + 1]['lat'], val4.data[i + 1]['lng']);
                                                }
                                                var seperatecable = [];
                                                var colorIndex = this.state.cables.indexOf(name);
                                                seperatecable['name'] = name;
                                                seperatecable['data'] = val4.data;
                                                seperatecable['color'] = colorIndex;
                                                seperatecable['shape'] = val4.shape;
                                                seperatecable['width'] = val4.width;
                                                cable.push(seperatecable);
                                            }
                                        })

                                    })
                                    if (temp2.lenght > 0) {
                                        cables.push(temp2);
                                        totalLength = totalLength + temp2.lenght;
                                    }
                                })
                                filtered.push({ track: trackName, markers: markers, cables: cables });
                            })


                            var totalquantity = 0;
                            var totallength = 0;

                            summaryMarkers.forEach((val) => {
                                totalquantity = totalquantity + val.quantity
                            })
                            summaryCables.forEach((val) => {
                                totallength = totallength + val.lenght
                            })
                            var tempTotalSummaryCables = { name: 'Total', lenght: totallength }
                            var tempTotalSummaryMarkers = { name: 'Total', quantity: totalquantity }
                            summaryCables.push(tempTotalSummaryCables)
                            summaryMarkers.push(tempTotalSummaryMarkers)
                            this.setState({ filteredDataResult: filtered, cablesLength: totalLength, cablestrack: cable, summaryMarkers: summaryMarkers, summaryCables: summaryCables, isLoading2: false, reportShown: true }, () => {
                                console.log('checking mapped Markers', this.state.mappedmarkers)
                            })

                        })
                    })
                }).catch(err => {
                    console.log(err);
                    this.setState({ isLoading2: false });
                })
        })
    }

    downloadKML = () => {

        if (this.state.citiesForReport.length === 0) {
            alert('Please Select the cities for which you want to download KML for');
            return
        }
        this.setState({ isLoading2: true }, () => {
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/inspectionDashboardInitGetTracksMultipleCity', { cities: this.state.citiesForReport })
                .then(res => {
                    data = res.data;
                    var alltracksdata = [];
                    //var allmarkersdata = [];
                    for (var i = 0; i < data.data.length; i++) {
                        var track = JSON.parse(data.data[i]['data']);
                        alltracksdata.push(track);
                    }
                    this.setState({ tracksForReport: alltracksdata }, () => {
                        var data1 = '';
                        var data2 = '';
                        var data3 = '';
                        let guid = () => {
                            let s4 = () => {
                                return Math.floor((1 + Math.random()) * 0x10000)
                                    .toString(16)
                                    .substring(1);
                            }
                            return s4() + '-' + s4() + '-' + s4() + s4();
                        }
                        this.state.tracksForReport.forEach((item, index) => {
                            for (var i = 0; i < item['track'].length; i++) {
                                var id = guid();
                                var coord = '';
                                for (var j = 0; j < item['track'][i]['data'].length; j++) {
                                    coord += item['track'][i]['data'][j]['lng'];
                                    coord += ',';
                                    coord += item['track'][i]['data'][j]['lat'];
                                    coord += ',';
                                    coord += '0';
                                    coord += ' ';
                                }
                                var stylemap = `<StyleMap id="${id}">
                                                        <Pair>
                                                            <key>normal</key>
                                                            <styleUrl>#${id}${i}</styleUrl>
                                                        </Pair>
                                                        </StyleMap>`;
                                var style = `<Style id="${id}${i}">
                                                            <LineStyle>
                                                                <color>${color2[item['track'][i]['color']]}</color>
                                                                <width>4</width>
                                                            </LineStyle>
                                                      </Style>`;
                                var placemark = `<Placemark>
                                                            <name>${item['track'][i]['name']}</name>
                                                            <open>1</open>
                                                            <styleUrl>#${id}</styleUrl>
                                                            <LineString>
                                                                <tessellate>1</tessellate>
                                                                <coordinates>
                                                                    ${coord}
                                                                </coordinates>
                                                            </LineString>
                                                        </Placemark>`;
                                data1 += stylemap;
                                data2 += style;
                                data3 += placemark;
                            }
                            item['markerposition'].forEach(function (currentValue, index) {
                                for (const [key, value] of Object.entries(currentValue)) {
                                    var id = guid();
                                    if (key != 'id' && key != 'detail' && key != 'subtrack') {
                                        var details = currentValue.detail;
                                        var detailmap = '';
                                        for (const [key, value] of Object.entries(currentValue.detail[0])) {
                                            detailmap = detailmap + `${key}:${value}<br/>`;

                                        }

                                        var stylemap = `<StyleMap id="${id}">
                                                                <Pair>
                                                                    <key>normal</key>
                                                                    <styleUrl>#${id}${i}11</styleUrl>
                                                                </Pair>
                                                                </StyleMap>`;
                                        var style = `<Style id="${id}${i}11">
                                                                <IconStyle>
                                                                    <scale>1</scale>
                                                                    <Icon>
                                                                        <href>https://joyndigital.com/Latitude/public/FiberAppMakrer/${key}.png</href>
                                                                    </Icon>
                                                                    <hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>
                                                                </IconStyle>
                                                                <LabelStyle>
                                                                    <color>ffffaa00</color>
                                                                    <scale>0</scale>
                                                                </LabelStyle>
                                                             </Style>`;

                                        var placemark = `<Placemark>
                                                                        <name>${key}</name>
                                                                        <description>${detailmap}</description>
                                                                        <styleUrl>${id}</styleUrl>
                                                                        <Point>
                                                                            <coordinates>${value[1]},${value[0]},0</coordinates>
                                                                        </Point>
                                                                </Placemark>`;
                                        data1 += stylemap;
                                        data2 += style;
                                        data3 += placemark;
                                    }
                                }
                            });

                        })

                        var arrData = [];
                        var CSV = '';


                        var makekml = `<?xml version="1.0" encoding="UTF-8"?>
                                    <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
                                        <Document>
                                            <name>${'test kml'}</name>
                                            ${data1}
                                            ${data2}
                                            ${data3}
                                        </Document>
                                    </kml>`;
                        var fileName = 'test kml';
                        var uri = 'data:text/kml;charset=utf-8,' + escape(makekml);
                        var link = document.createElement("a");
                        link.href = uri;
                        link.style = "visibility:hidden";
                        link.download = fileName + ".kml";

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        this.setState({ isLoading2: false })
                    })
                }).catch(err => {
                    console.log(err);
                    this.setState({ isLoading2: false });
                })
        })

    }

    createKML = (index) => {
        var data1 = '';
        var data2 = '';
        var data3 = '';
        let guid = () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + '-' + s4() + '-' + s4() + s4();
        }
        for (var i = 0; i < this.state.track[index]['track'].length; i++) {
            var id = guid();
            var coord = '';
            for (var j = 0; j < this.state.track[index]['track'][i]['data'].length; j++) {
                coord += this.state.track[index]['track'][i]['data'][j]['lng'];
                coord += ',';
                coord += this.state.track[index]['track'][i]['data'][j]['lat'];
                coord += ',';
                coord += '0';
                coord += ' ';
            }
            var stylemap = `<StyleMap id="${id}">
                                    <Pair>
                                    	<key>normal</key>
                                    	<styleUrl>#${id}${i}</styleUrl>
                                    </Pair>
                                    </StyleMap>`;
            var style = `<Style id="${id}${i}">
                                        <LineStyle>
                                        	<color>${color2[this.state.track[index]['track'][i]['color']]}</color>
                                        	<width>4</width>
                                        </LineStyle>
                                  </Style>`;
            var placemark = `<Placemark>
                                        <name>${this.state.track[index]['track'][i]['name']}</name>
                                        <open>1</open>
                                        <styleUrl>#${id}</styleUrl>
                                        <LineString>
                                        	<tessellate>1</tessellate>
                                        	<coordinates>
                                        		${coord}
                                        	</coordinates>
                                        </LineString>
                                    </Placemark>`;
            data1 += stylemap;
            data2 += style;
            data3 += placemark;
        }
        this.state.track[index]['markerposition'].forEach(function (currentValue, index) {
            for (const [key, value] of Object.entries(currentValue)) {
                var id = guid();
                if (key != 'id' && key != 'detail' && key != 'subtrack') {
                    var details = currentValue.detail;
                    var detailmap = '';
                    for (const [key, value] of Object.entries(currentValue.detail[0])) {
                        detailmap = detailmap + `${key}:${value}<br/>`;

                    }

                    var stylemap = `<StyleMap id="${id}">
                                            <Pair>
                                            	<key>normal</key>
                                            	<styleUrl>#${id}${i}11</styleUrl>
                                            </Pair>
                                            </StyleMap>`;
                    var style = `<Style id="${id}${i}11">
                                            <IconStyle>
                                    			<scale>1</scale>
                                    			<Icon>
                                    				<href>https://joyndigital.com/Latitude/public/FiberAppMakrer/${key}.png</href>
                                    			</Icon>
                                    			<hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>
                                    		</IconStyle>
                                    		<LabelStyle>
                                    			<color>ffffaa00</color>
                                    			<scale>0</scale>
                                    		</LabelStyle>
                                         </Style>`;

                    var placemark = `<Placemark>
                                    				<name>${key}</name>
                                    				<description>${detailmap}</description>
                                    				<styleUrl>${id}</styleUrl>
                                    				<Point>
                                    					<coordinates>${value[1]},${value[0]},0</coordinates>
                                    				</Point>
                                    		</Placemark>`;
                    data1 += stylemap;
                    data2 += style;
                    data3 += placemark;
                }
            }
        });
        var arrData = [];
        var CSV = '';


        var makekml = `<?xml version="1.0" encoding="UTF-8"?>
                    <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
                        <Document>
                            <name>${this.state.track[index]['name']}</name>
                            ${data1}
                            ${data2}
                            ${data3}
                        </Document>
                    </kml>`;
        var fileName = this.state.track[index]['name'];
        var uri = 'data:text/kml;charset=utf-8,' + escape(makekml);
        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".kml";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    selectAll = (type) => {

        if (type === 'region') {
            if (this.state.selectedregions.length !== this.state.regions.length) {
                this.setState({ selectedregions: this.state.regions }, () => {
                    this.regionSelected();
                })
            } else {
                this.setState({ selectedregions: [] }, () => {
                    this.regionSelected();
                })
            }
        }
        if (type === 'city') {
            if (this.state.citiesForReport.length !== this.state.cities.length) {
                let temp = [];
                this.state.cities.forEach((val) => {
                    temp.push(val.city)
                })
                this.setState({ citiesForReport: temp })
            } else {
                this.setState({ citiesForReport: [] })
            }
        }
        if (type === 'track') {
            if (this.state.selectedtracks.length !== this.state.tracksShow.length) {
                this.setState({ selectedtracks: this.state.tracksShow }, () => {
                    var temporaryCable = [];
                    this.state.selectedtracks.forEach((val) => {
                        val.track.forEach((value) => {
                            temporaryCable.push(value)
                        })
                    })
                    this.setState({ cablestrack: temporaryCable }, () => {
                        var allmarkersdata = [];
                        for (var m = 0; m < this.state.selectedtracks.length; m++) {
                            var track = this.state.selectedtracks[m]['track'];

                            var markers = this.state.selectedtracks[m]['markerposition'];
                            for (var j = 0; j < markers.length; j++) {
                                allmarkersdata.push(markers[j]);
                            }
                            //alltracksdata.push(this.state.selectedtracks[i]);
                            this.setState({ recenter: track[0]['data'][0] })
                        }
                        //this.setState({ track: alltracksdata });
                        this.setState({ mappedmarkers: allmarkersdata });
                    });

                })
            } else {
                this.setState({ selectedtracks: [] }, () => {
                    var temporaryCable = [];
                    this.state.selectedtracks.forEach((val) => {
                        val.track.forEach((value) => {
                            temporaryCable.push(value)
                        })
                    })
                    this.setState({ cablestrack: temporaryCable }, () => {
                        var allmarkersdata = [];
                        for (var m = 0; m < this.state.selectedtracks.length; m++) {
                            var track = this.state.selectedtracks[m]['track'];

                            var markers = this.state.selectedtracks[m]['markerposition'];
                            for (var j = 0; j < markers.length; j++) {
                                allmarkersdata.push(markers[j]);
                            }
                            //alltracksdata.push(this.state.selectedtracks[i]);
                            this.setState({ recenter: track[0]['data'][0] })
                        }
                        //this.setState({ track: alltracksdata });
                        this.setState({ mappedmarkers: allmarkersdata });
                    });
                })
            }
        }

        if (type === 'OFC') {
            if (this.state.selectedmarkers.length !== this.state.ana.length) {
                let temporaryMarkers = [];
                this.state.ana.forEach((val) => {
                    temporaryMarkers.push(`OFC/${val}`);
                })
                this.setState({ selectedmarkers: temporaryMarkers })
            } else {
                this.setState({ selectedmarkers: [] })
            }
        }

        if (type == 'cable') {
            if (this.state.cables.length !== this.state.selectedcables.length) {
                this.setState({ selectedcables: this.state.cables })
            } else {
                this.setState({ selectedcables: [] })
            }
        }
    }

    resetFilter = () => {
        this.setState({
            selectedcables: [],
            selectedmarkers: [],
            selectedtracks: [],
            selectedcities: [],
            selectedregions: [],
            markersShowArray: [],

        }, () => {
            var temporaryCable = [];
            this.state.selectedtracks.forEach((val) => {
                val.track.forEach((value) => {
                    temporaryCable.push(value)
                })
            })
            this.setState({ cablestrack: temporaryCable }, () => {
                var allmarkersdata = [];
                for (var m = 0; m < this.state.selectedtracks.length; m++) {
                    var track = this.state.selectedtracks[m]['track'];

                    var markers = this.state.selectedtracks[m]['markerposition'];
                    for (var j = 0; j < markers.length; j++) {
                        allmarkersdata.push(markers[j]);
                    }
                    //alltracksdata.push(this.state.selectedtracks[i]);
                    this.setState({ recenter: track[0]['data'][0] })
                }
                //this.setState({ track: alltracksdata });
                this.setState({ mappedmarkers: allmarkersdata, filteredDataResult: [], reportShown: false, imageShown: false, selectAllTracks: [], filterApplied: false });
            });
        })
    }

    dropdownOpen = (type) => {

        if (type == 'regions') {
            this.setState({ regionsShown: !this.state.regionsShown })
        }
        if (type == 'cities') {
            this.setState({ citiesShown: !this.state.citiesShown })
        }
        if (type == 'tracks') {
            this.setState({ tracksShown: !this.state.tracksShown })
        }
        if (type == 'ofc') {
            this.setState({ OFCShown: !this.state.OFCShown })
        }
        if (type == 'cables') {
            this.setState({ cablesShown: !this.state.cablesShown })
        }
    }

    pathClicked = (e, names) => {
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.setState({ cableDetailsToShow: names, cableDetailsToShowPosition: position });
    }

    check = (e) => {
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log('test', position);
    }

    showMarkers = () => {
        this.setState({ markersShow: !this.state.markersShow }, () => {

        })
    }

    addToMarkers = (val) => {
        let temp = this.state.markersShowArray;
        if (temp.includes(val)) {
            temp = temp.filter((value) => {
                return value != val;
            })
        } else {
            temp.push(val)
        }

        this.setState({ markersShowArray: temp }, () => {

        })
    }

    showMoreOptions = () => {
        this.setState({ moreOptionsShown: !this.state.moreOptionsShown })
    }

    openFilterWindow = () => {
        this.setState({ filterWindowOpen: !this.state.filterWindowOpen, reportShown: false })
    }

    selectAllNew = (city) => {
        let tempSelectAllTracks = this.state.selectAllTracks;
        if (tempSelectAllTracks.includes(city)) {
            tempSelectAllTracks = tempSelectAllTracks.filter((val) => {
                return val != city
            })
        } else {
            tempSelectAllTracks.push(city)
        }
        this.setState({ selectAllTracks: tempSelectAllTracks }, () => {

            if (this.state.selectAllTracks.includes(city)) {
                let tempTracksShow = this.state.tracksShow.filter((val) => {
                    return this.state.selectAllTracks.includes(val.city)
                })
                this.setState({ selectedtracks: tempTracksShow }, () => {
                    var temporaryCable = [];
                    this.state.selectedtracks.forEach((val) => {
                        val.track.forEach((value) => {
                            value['row_status'] = val.row_status;
                            temporaryCable.push(value)
                        })
                    })
                    this.setState({ cablestrack: temporaryCable }, () => {
                        var allmarkersdata = [];
                        for (var m = 0; m < this.state.selectedtracks.length; m++) {
                            var track = this.state.selectedtracks[m]['track'];

                            var markers = this.state.selectedtracks[m]['markerposition'];
                            for (var j = 0; j < markers.length; j++) {
                                allmarkersdata.push(markers[j]);
                            }
                            //alltracksdata.push(this.state.selectedtracks[i]);
                            this.setState({ recenter: track[0]['data'][0] })
                        }
                        //this.setState({ track: alltracksdata });
                        this.setState({ mappedmarkers: allmarkersdata });
                    });

                })
            } else {
                let tempTracksShow = this.state.tracksShow.filter((val) => {
                    return this.state.selectAllTracks.includes(val.city)
                })
                this.setState({ selectedtracks: tempTracksShow }, () => {
                    var temporaryCable = [];
                    this.state.selectedtracks.forEach((val) => {
                        val.track.forEach((value) => {
                            value['row_status'] = val.row_status;
                            temporaryCable.push(value)
                        })
                    })
                    this.setState({ cablestrack: temporaryCable }, () => {
                        var allmarkersdata = [];
                        for (var m = 0; m < this.state.selectedtracks.length; m++) {
                            var track = this.state.selectedtracks[m]['track'];

                            var markers = this.state.selectedtracks[m]['markerposition'];
                            for (var j = 0; j < markers.length; j++) {
                                allmarkersdata.push(markers[j]);
                            }
                            //alltracksdata.push(this.state.selectedtracks[i]);
                            this.setState({ recenter: track[0]['data'][0] })
                        }
                        //this.setState({ track: alltracksdata });
                        this.setState({ mappedmarkers: allmarkersdata });
                    });
                })
            }
        })

    }

    regionClicked = (region) => {
        let tempRegionsOpen = this.state.regionsOpen
        if (tempRegionsOpen.includes(region)) {
            tempRegionsOpen = tempRegionsOpen.filter((val) => {
                return val !== region
            })
        } else {
            tempRegionsOpen.push(region)
        }
        this.setState({ regionsOpen: tempRegionsOpen }, () => {

        })

    }

    cityClicked = (city) => {
        let tempCitiesOpen = this.state.citiesOpen
        if (tempCitiesOpen.includes(city)) {
            tempCitiesOpen = tempCitiesOpen.filter((val) => {
                return val !== city
            })
        } else {
            tempCitiesOpen.push(city)
        }
        this.setState({ citiesOpen: tempCitiesOpen }, () => {

        })
    }

    plannedSiteSelectCity = (city) => {

        var tempTotalSelectedPlannedSites = this.state.totalSelectedPlannedSites;
        var tempPlannedSites = this.state.plannedSites;
        var tempPlannedSitesSelectedCitys = this.state.plannedSitesSelectedCitys;

        if (this.state.plannedSitesSelectedCitys.includes(city)) {

            tempTotalSelectedPlannedSites = tempTotalSelectedPlannedSites - tempPlannedSites[city].length
            tempPlannedSites[city] = [];
            tempPlannedSitesSelectedCitys = tempPlannedSitesSelectedCitys.filter((val) => {

                return val != city;
            })

            this.setState({ totalSelectedPlannedSites: tempTotalSelectedPlannedSites, plannedSitesSelectedCitys: tempPlannedSitesSelectedCitys, plannedSites: tempPlannedSites })

        } else {


            tempPlannedSitesSelectedCitys.push(city);

            this.setState({ plannedSitesSelectedCitys: tempPlannedSitesSelectedCitys, isLoading: true }, () => {

                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getPlannedSites', { city: city })
                    .then(res => {

                        let tempSites = [];
                        res.data.sites.forEach((val) => {
                            tempSites.push({ lat: parseFloat(val.latitude), lng: parseFloat(val.longitude) })
                        })

                        tempPlannedSites[city] = tempSites;
                        let recenter = tempSites[0];

                        tempTotalSelectedPlannedSites = tempTotalSelectedPlannedSites + tempPlannedSites[city].length
                        this.setState({ totalSelectedPlannedSites: tempTotalSelectedPlannedSites, isLoading: false, plannedSites: tempPlannedSites, recenter: recenter })

                    }).catch(err => console.log(err))
            })

        }
    }

    potentialSiteSelectRegion = (region) => {

        var tempTotalSelectedPotentialSites = this.state.totalSelectedPotentialSites;
        var tempPotentialSites = this.state.potentialSites;
        var tempPotentialSitesSelectedRegions = this.state.potentialSitesSelectedRegions;

        if (this.state.potentialSitesSelectedRegions.includes(region)) {

            tempTotalSelectedPotentialSites = tempTotalSelectedPotentialSites - tempPotentialSites[region].length
            tempPotentialSites[region] = [];
            tempPotentialSitesSelectedRegions = tempPotentialSitesSelectedRegions.filter((val) => {

                return val != region;
            })

            this.setState({ totalSelectedPotentialSites: tempTotalSelectedPotentialSites, potentialSitesSelectedRegions: tempPotentialSitesSelectedRegions, potentialSites: tempPotentialSites })

        } else {

            tempPotentialSitesSelectedRegions.push(region);

            this.setState({ potentialSitesSelectedRegions: tempPotentialSitesSelectedRegions, isLoading: true }, () => {

                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getPotentialSites', { region: region })
                    .then(res => {

                        let tempSites = [];
                        res.data.sites.forEach((val) => {
                            tempSites.push({ lat: parseFloat(val.Latitude), lng: parseFloat(val.Longitude) })
                        })

                        tempPotentialSites[region] = tempSites;

                        tempTotalSelectedPotentialSites = tempTotalSelectedPotentialSites + tempPotentialSites[region].length
                        this.setState({ totalSelectedPotentialSites: tempTotalSelectedPotentialSites, isLoading: false, potencialSites: tempPotentialSites })

                    }).catch(err => console.log(err))
            })

        }
    }

    test = (city) => {
        if (this.state.filteredDataResult.length !== 0) {
            alert('Warning!!! Currently applied filter will be removed')
        }
        this.setState({ isLoading2: true, filteredDataResult: [], filterApplied: false, selectedcables: [], selectedmarkers: [], reportShown: false }, () => {
            let tempTracksShow = this.state.selectedtracks;
            let tempSelectAllTracks = this.state.selectAllTracks;
            if (tempSelectAllTracks.includes(city)) {
                tempSelectAllTracks = tempSelectAllTracks.filter((val) => {
                    return val != city
                })
            } else {
                tempSelectAllTracks.push(city)
            }
            this.setState({ selectAllTracks: tempSelectAllTracks }, () => {

                if (this.state.selectAllTracks.includes(city)) {
                    console.log('calling axios', this.state.selectAllTracks)
                    Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/inspectionDashboardInitGetTracksCity', { city: city, cust_id: localStorage.getItem('cust_id') })
                        .then(res => {
                            data = res.data;
                            var alltracksdata = [];
                            //var allmarkersdata = [];
                            for (var i = 0; i < data.data.length; i++) {
                                var track = JSON.parse(data.data[i]['data']);
                                track.id = data.data[i]['id'];
                                track.row_status = data.data[i]['row_status'];
                                var trackdata = track.track;
                                alltracksdata.push(track);
                                if (i === data.data.length - 1) {
                                    this.setState({ recenter: trackdata[0]['data'][0], recenterPersistent: trackdata[0]['data'][0] })
                                }
                            }
                            tempTracksShow = [...tempTracksShow, ...alltracksdata]
                            console.log(tempTracksShow)
                            //this.setState({isLoading2: false, selectedtracks: tempTracksShow})
                            this.setState({ selectedtracks: tempTracksShow }, () => {
                                var allmarkersdata = [];
                                for (var m = 0; m < this.state.selectedtracks.length; m++) {
                                    var markers = this.state.selectedtracks[m]['markerposition'];
                                    allmarkersdata = [...allmarkersdata, ...markers];
                                }
                                this.setState({ mappedmarkers: allmarkersdata, isLoading2: false, zoom: 14 });
                            })
                        }).catch(err => {
                            console.log(err);
                            this.setState({ isLoading2: false });
                        })
                } else {
                    console.log('not calling axios', this.state.selectAllTracks)
                    let tempTracksShow = this.state.selectedtracks.filter((val) => {
                        return this.state.selectAllTracks.includes(val.city)
                    })
                    console.log(tempTracksShow)
                    this.setState({ isLoading2: false, selectedtracks: tempTracksShow }, () => {
                        var allmarkersdata = [];
                        for (var m = 0; m < this.state.selectedtracks.length; m++) {
                            var markers = this.state.selectedtracks[m]['markerposition'];
                            allmarkersdata = [...allmarkersdata, ...markers];
                        }
                        this.setState({ mappedmarkers: allmarkersdata, isLoading2: false, zoom: 14 });
                    })
                }
            })
        })

    }

    render() {

        var track = this.state.track;
        var zoom = this.state.zoom;

        const containerStyle = {
            width: '100%',
            height: 'calc(100% - 30px)'
        };
        return (
            <div style={{ height: 'calc(100vh - 50px)', width: '100vw', display: "flex", flexWrap: 'wrap', justifyContent: "center", overflow: 'hidden', position: 'relative' }} >

                {
                    this.state.otdrInfo.length !== 0 &&
                    <div className="otdrInfo">
                        <div onClick={() => { this.setState({ otdrInfo: [] }) }} style={{ textAlign: 'right', fontWeight: 'bold', cursor: 'pointer' }}>x</div>
                        <table>

                            <thead>
                                <tr>
                                    <th>City</th>
                                    <th>Distance (KM)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.otdrInfo.map((val, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{val.city}</td>
                                            <td>{val.length.toFixed(2)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>

                    </div>
                }

                {this.state.rowShown &&
                    <div className="ROW">
                        <div onClick={() => this.rowTypeClicked('NA')} style={{ border: '1px solid black', boxSizing: 'border-box', cursor: 'pointer' }}><span style={{ display: 'inline-block', height: '10px', width: '10px', background: this.state.RowColors['Not Available'].color }}></span><input type="checkbox" checked={this.state.RowColors['Not Available'].opacity === 0.4} /> <span>Not Available</span></div>
                        <div onClick={() => this.rowTypeClicked('A')} style={{ border: '1px solid black', boxSizing: 'border-box', cursor: 'pointer' }}><span style={{ display: 'inline-block', height: '10px', width: '10px', background: this.state.RowColors['Available'].color }}></span> <input type="checkbox" checked={this.state.RowColors['Available'].opacity === 0.4} /> <span>Available</span></div>
                        <div onClick={() => this.rowTypeClicked('IP')} style={{ border: '1px solid black', boxSizing: 'border-box', cursor: 'pointer' }}><span style={{ display: 'inline-block', height: '10px', width: '10px', background: this.state.RowColors['In Progress'].color }}></span> <input type="checkbox" checked={this.state.RowColors['In Progress'].opacity === 0.4} /> <span>In Progress</span></div>
                        <div onClick={() => this.rowTypeClicked('UL')} style={{ border: '1px solid black', boxSizing: 'border-box', cursor: 'pointer' }}><span style={{ display: 'inline-block', height: '10px', width: '10px', background: this.state.RowColors['under litigation'].color }}></span> <input type="checkbox" checked={this.state.RowColors['under litigation'].opacity === 0.4} /> <span>Under litigation</span></div>
                    </div>
                }

                {this.state.openDownloadWizard &&
                    <div className="downloadWizard" >
                        <div onClick={() => { this.setState({ openDownloadWizard: false }) }} style={{ height: '20px', width: 'calc(100% - 10px)', textAlign: 'right', paddingRight: '10px', fontWeight: 'bold', cursor: 'pointer' }}>x</div>
                        <div style={{ height: '20px', width: '100%', textAlign: 'center' }}>Download</div>
                        <div style={{ height: 'calc(100% - 90px)', marginTop: '10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '13px' }}>
                            <div style={{ height: '100%', width: '33.333%', boxSizing: 'border-box', borderRight: '1px solid black' }}>
                                <h5 style={{ margin: '0px', textAlign: 'center', height: '20px' }}>Cities</h5>
                                <div style={{ height: 'calc(100% - 20px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'flex-start', overflow: 'auto' }}>
                                    <div style={{ height: '30px', width: '100%', textAlign: 'center', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        <input onChange={() => this.selectAll('city')} type="checkbox" checked={this.state.cities.length == this.state.citiesForReport.length} /> Select All
                                    </div>
                                    {this.state.cities.map((val, index) => {
                                        return (
                                            <div key={index} title={val} style={{ height: '30px', width: '30%', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <input onChange={() => this.addCity(val.city)} type="checkbox" checked={this.state.citiesForReport.includes(val.city)} />
                                                {val.city}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div style={{ height: '100%', width: '33.333%', boxSizing: 'border-box', borderRight: '1px solid black' }}>
                                <h5 style={{ margin: '0px', textAlign: 'center', height: '20px' }}>N/W Elements</h5>
                                <div style={{ height: 'calc(100% - 20px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'flex-start', overflow: 'auto' }}>
                                    <div style={{ height: '30px', width: '100%', textAlign: 'center', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        <input onChange={() => this.selectAll('OFC')} type="checkbox" checked={this.state.ana.length == this.state.selectedmarkers.length} /> Select All
                                    </div>
                                    {this.state.ana.map((val, index) => {
                                        return (
                                            <div key={index} title={val} style={{ height: '30px', width: '30%', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <input onChange={() => this.addMarker(val)} type="checkbox" checked={this.state.selectedmarkers.includes('OFC/' + val)} />
                                                {val !== 'tower' &&
                                                    <span>{val}</span>
                                                }
                                                {val == 'tower' &&
                                                    <span>cell-site</span>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div style={{ height: '100%', width: '33.333%', boxSizing: 'border-box' }}>
                                <h5 style={{ margin: '0px', textAlign: 'center', height: '20px' }}>Cables</h5>
                                <div style={{ height: 'calc(100% - 20px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'flex-start', overflow: 'auto' }}>
                                    <div style={{ height: '30px', width: '100%', textAlign: 'center', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        <input onChange={() => this.selectAll('cable')} type="checkbox" checked={this.state.cables.length == this.state.selectedcables.length} /> Select All
                                    </div>
                                    {this.state.cables.map((val, index) => {
                                        return (
                                            <div key={index} title={val} style={{ height: '30px', width: '30%', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <input onChange={() => this.addCable(val)} type="checkbox" checked={this.state.selectedcables.includes(val)} /> {val}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div style={{ height: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', boxSizing: 'border-box', marginTop: '10px', marginBottom: '10px' }}>
                            <div onClick={() => this.downloadKML()} style={{ height: '100%', width: '20%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04b2d9', background: '#e0f4fa', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', borderRadius: '5px' }}>Download KML</div>
                            <div onClick={() => this.downloadReport2()} style={{ height: '100%', width: '20%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04b2d9', background: '#e0f4fa', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', borderRadius: '5px' }}>Download Report</div>
                            <div onClick={() => this.showReport()} style={{ height: '100%', width: '20%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04b2d9', background: '#e0f4fa', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', borderRadius: '5px' }}>Show Report</div>
                        </div>
                    </div>
                }

                {
                    this.state.isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: '10000000' }}>
                        <Spinner />
                        <div style={{ clear: 'both' }}></div>
                        <h6 style={{ textAlign: 'center', width: '100%' }}>Please Wait while we Load Your Data</h6>
                    </div>
                }

                {
                    this.state.isLoading2 &&
                    <div style={{ height: '100%', width: '100%', background: 'transparent', position: 'absolute', zIndex: '10000000' }}>
                        <Spinner />
                    </div>
                }

                {
                    this.state.filterWindowOpen &&
                    <div className="GisView_filterWindow" style={{ height: '40%', width: '60%', position: 'absolute', zIndex: '10000000' }}>
                        <div onClick={() => { this.setState({ filterWindowOpen: false }) }} style={{ position: 'absolute', height: '10px', width: '10px', top: '5px', right: '5px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa fa-close"></i></div>
                        <div title="Reset" onClick={() => this.resetFilter()} style={{ position: 'absolute', height: '10px', width: '10px', top: '5px', right: '25px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa fa-refresh"></i></div>
                        <h5 style={{ textAlign: 'center', height: '30px', margin: '0px' }}>Filters</h5>
                        <div style={{ height: 'calc(100% - 60px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ borderRight: '1px solid black', height: '100%', width: '50%', boxSizing: 'border-box' }}>
                                <h5 style={{ margin: '0px', textAlign: 'center', height: '30px' }}>N/W Elements</h5>
                                <div style={{ height: 'calc(100% - 30px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'flex-start', overflow: 'auto' }}>
                                    <div style={{ height: '30px', width: '100%', textAlign: 'center', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        <input onChange={() => this.selectAll('OFC')} type="checkbox" checked={this.state.ana.length == this.state.selectedmarkers.length} /> Select All
                                    </div>
                                    {this.state.ana.map((val, index) => {
                                        return (
                                            <div key={index} title={val} style={{ height: '30px', width: '30%', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <input onChange={() => this.addMarker(val)} type="checkbox" checked={this.state.selectedmarkers.includes('OFC/' + val)} />
                                                {val !== 'tower' &&
                                                    <span>{val}</span>
                                                }
                                                {val == 'tower' &&
                                                    <span>cell-site</span>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div style={{ height: '100%', width: '50%', boxSizing: 'border-box' }}>
                                <h5 style={{ margin: '0px', textAlign: 'center', height: '30px' }}>Cables</h5>
                                <div style={{ height: 'calc(100% - 30px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'flex-start', overflow: 'auto' }}>
                                    <div style={{ height: '30px', width: '100%', textAlign: 'center', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        <input onChange={() => this.selectAll('cable')} type="checkbox" checked={this.state.cables.length == this.state.selectedcables.length} /> Select All
                                    </div>
                                    {this.state.cables.map((val, index) => {
                                        return (
                                            <div key={index} title={val} style={{ height: '30px', width: '30%', marginTop: '5px', lineHeight: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <input onChange={() => this.addCable(val)} type="checkbox" checked={this.state.selectedcables.includes(val)} /> {val}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div title="Apply Filter" onClick={() => this.applyFilter()} style={{ textAlign: 'center', height: '20px', marginTop: '5px', marginBottom: '5px', borderRadius: '5px' }}><button style={{ color: '#04b2d9', background: '#e0f4fa', fontWeight: '13px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Apply Filter</button></div>
                    </div>
                }


                < div className={`mapSideBar ${this.state.sideBarHide ? "mapSideBarShorten" : ""}`}>
                    {
                        this.state.sideBarHide &&
                        <div onClick={() => this.showSideBar()} style={{ width: '100%', color: 'black', textAlign: 'center', cursor: 'pointer' }}>
                            <i className="fa fa-arrow-right"></i>
                        </div>
                    }
                    {
                        this.state.sideBarHide == false &&
                        <>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <div style={{ cursor: 'pointer', heigth: '20px', width: '50%', textAlign: 'left' }} title="Home"><Link to='/home'><i className="fa fa-home" style={{ color: 'black' }}></i></Link></div>
                                {/* {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === '2' }) &&
                                    <>
                                        <div style={{ cursor: 'pointer', heigth: '20px', width: '10%', textAlign: 'center' }} onClick={() => this.showImages()} title="Images">
                                            <i className="fa fa-image"></i>
                                        </div>
                                        <div className={`${this.state.markersShowArray.includes('N/W Elements') ? "filterApplied" : ""}`} style={{ cursor: 'pointer', heigth: '20px', width: '10%', textAlign: 'center' }} onClick={() => this.addToMarkers('N/W Elements')} title="N/W Elements"><i className="fa fa-sitemap" aria-hidden="true"></i></div>
                                    </>
                                }
                                {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === '1' }) &&
                                    <div className={`${this.state.markersShowArray.includes('Audits') ? "filterApplied" : ""}`} style={{ cursor: 'pointer', heigth: '20px', width: '10%', textAlign: 'center' }} onClick={() => this.addToMarkers('Audits')} title="Audits"><i className="fa fa-check-square-o"></i></div>
                                }
                                {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === '2' }) &&
                                    <>
                                        <div className={`${this.state.filterApplied > 0 ? "filterApplied" : ""}`} style={{ cursor: 'pointer', heigth: '20px', width: '10%', textAlign: 'center' }} onClick={() => { this.setState({ citiesForReport: [], selectedmarkers: [], selectedcables: [] }); this.openFilterWindow() }} title="Filters"><i className="fa fa-filter"></i></div>
                                        <div style={{ cursor: 'pointer', heigth: '20px', width: '10%', textAlign: 'center' }} onClick={() => { this.setState({ openDownloadWizard: true, reportShown: false, citiesForReport: [], selectedmarkers: [], selectedcables: [] }) }} title="Download & Reporting"><i className="fa fa-download"></i></div>
                                        <div style={{ cursor: 'pointer', heigth: '20px', width: '10%', textAlign: 'center' }} onClick={() => this.resetFilter()} title="Reset All"><i className="fa fa-refresh"></i></div>
                                    </>
                                } */}

                                <div style={{ cursor: 'pointer', heigth: '20px', width: '50%', textAlign: 'right' }} onClick={() => this.hideSideBar()} ><i className="fa fa-arrow-left" ></i></div>
                            </div>
                            <hr></hr>
                            {/* <OtdrMap /> */}
                            <div className="tracks">
                                {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                                    <>
                                        <div style={{ marginTop: 0, fontSize: '13px' }}>Inspected Network</div>

                                        {this.state.regions.map((val, index) => {
                                            return (
                                                <div key={index}>
                                                    <div onClick={() => this.regionClicked(val)} style={{ height: '40px', width: '88%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title={val}>
                                                        {this.state.regionsOpen.includes(val) &&
                                                            <span>
                                                                {val.charAt(0).toUpperCase() + val.slice(1)}

                                                                <i className="fa fa-angle-up" style={{ fontWeight: 'bold' }}></i>
                                                            </span>
                                                        }
                                                        {!this.state.regionsOpen.includes(val) &&
                                                            <span>
                                                                {val.charAt(0).toUpperCase() + val.slice(1)}

                                                                <i className="fa fa-angle-down" style={{ fontWeight: 'bold' }}></i>
                                                            </span>
                                                        }
                                                    </div>
                                                    {this.state.cities.map((val1, index1) => {
                                                        return (
                                                            <div key={index1}>
                                                                {val1.region === val && this.state.regionsOpen.includes(val) &&
                                                                    <div key={index1}>
                                                                        <div onClick={() => this.cityClicked(val1.city)} style={{ height: '40px', width: '88%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginLeft: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title={val1.city}>
                                                                            <span>
                                                                                <input type="checkbox" checked={this.state.selectAllTracks.includes(val1.city)} onChange={() => this.test(val1.city)} ></input>{val1.city}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                        <hr></hr>
                                    </>
                                }
                                {localStorage.getItem('cust_id') === '2' &&
                                    <>
                                        <div style={{ height: '40px', margin: '0', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => this.setState({ planned: !this.state.planned })}>
                                            Planned Sites {!this.state.planned && <i className="fa fa-angle-down" style={{ fontWeight: 'bold' }}></i>} {this.state.planned && <i className="fa fa-angle-up" style={{ fontWeight: 'bold' }}></i>}
                                        </div>
                                        {/* {this.state.planned &&
                                    <div style={{ height: '40px', cursor: 'pointer', marginLeft: '20px', display: 'flex', alignItems: 'center' }} onClick={() => this.setState({ plannedSitesShown: !this.state.plannedSitesShown })}>
                                        Sites {!this.state.plannedSitesShown && <i className="fa fa-angle-down" style={{ fontWeight: 'bold' }}></i>} {this.state.plannedSitesShown && <i className="fa fa-angle-up" style={{ fontWeight: 'bold' }}></i>}
                                    </div>
                                } */}
                                        {this.state.planned &&
                                            <>
                                                {this.state.plannedSitesCities.map((city, c_idx) => {
                                                    return (
                                                        <div key={c_idx}>
                                                            <div key={c_idx} style={{ height: '40px', marginLeft: '40px', width: 'calc(100% - 40px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                                                <div style={{ width: '12%', textAlign: 'left' }}> <input onChange={() => this.plannedSiteSelectCity(city)} checked={this.state.plannedSitesSelectedCitys.includes(city)} type="checkbox" /> </div>
                                                                <div style={{ width: '88%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={city}> {city} </div>
                                                                {/* <div style={{ width: '10%', textAlign: 'right', cursor: 'pointer' }} onClick={() => this.delete(val.name, val.id)}><i className="fa fa-times" ></i> </div> */}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                        <hr></hr>
                                        <div style={{ height: '40px', margin: '0', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => this.setState({ potential: !this.state.potential })}>
                                            Potential Sites {!this.state.potential && <i className="fa fa-angle-down" style={{ fontWeight: 'bold' }}></i>} {this.state.potential && <i className="fa fa-angle-up" style={{ fontWeight: 'bold' }}></i>}
                                        </div>
                                        {/* {this.state.potential &&
                                    <div style={{ height: '40px', cursor: 'pointer', marginLeft: '20px', display: 'flex', alignItems: 'center' }} onClick={() => this.setState({ potentialOperatorShown: !this.state.potentialOperatorShown })}>
                                        Sites {!this.state.potentialOperatorShown && <i className="fa fa-angle-down" style={{ fontWeight: 'bold' }}></i>} {this.state.potentialOperatorShown && <i className="fa fa-angle-up" style={{ fontWeight: 'bold' }}></i>}
                                    </div>
                                } */}
                                        {this.state.potential &&
                                            <div style={{ height: '40px', cursor: 'pointer', marginLeft: '40px', display: 'flex', alignItems: 'center' }} onClick={() => this.setState({ potentialSitesShown: !this.state.potentialSitesShown })}>
                                                CMO-1 {!this.state.potentialSitesShown && <i className="fa fa-angle-down" style={{ fontWeight: 'bold' }}></i>} {this.state.potentialSitesShown && <i className="fa fa-angle-up" style={{ fontWeight: 'bold' }}></i>}
                                            </div>
                                        }
                                        {this.state.potentialSitesShown &&
                                            <>
                                                {this.state.potentialSitesRegions.map((region, r_idx) => {
                                                    return (
                                                        <div key={r_idx}>
                                                            <div key={r_idx} style={{ height: '40px', marginLeft: '60px', width: 'calc(100% - 60px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                                                <div style={{ width: '12%', textAlign: 'left' }}> <input onChange={() => this.potentialSiteSelectRegion(region)} checked={this.state.potentialSitesSelectedRegions.includes(region)} type="checkbox" /> </div>
                                                                <div style={{ width: '88%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={region}> {region} </div>
                                                                {/* <div style={{ width: '10%', textAlign: 'right', cursor: 'pointer' }} onClick={() => this.delete(val.name, val.id)}><i className="fa fa-times" ></i> </div> */}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                        <hr></hr>
                                        <div style={{ height: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottom: '1px solid gray', alignItems: 'center' }}>
                                            <div style={{ width: '12%', textAlign: 'left' }}> <input type="checkbox" checked={this.state.otdrResults.length > 0} onChange={() => this.otdrResultsClicked()} /> </div>
                                            <div style={{ width: '88%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}> OTDR Results </div>
                                            {/* <div style={{ width: '10%', textAlign: 'right', cursor: 'pointer' }} onClick={() => this.delete(val.name, val.id)}><i className="fa fa-times" ></i> </div> */}
                                        </div>
                                        <div style={{ height: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottom: '1px solid gray', alignItems: 'center' }}>
                                            <div style={{ width: '12%', textAlign: 'left' }}> <input type="checkbox" checked={this.state.rowShown} onChange={() => this.setState({ rowShown: !this.state.rowShown })} /> </div>
                                            <div style={{ width: '88%', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}> Right Of Way </div>
                                            {/* <div style={{ width: '10%', textAlign: 'right', cursor: 'pointer' }} onClick={() => this.delete(val.name, val.id)}><i className="fa fa-times" ></i> </div> */}
                                        </div>
                                        {/* jUMP TO HERE */}
                                    </>
                                }


                            </div>
                        </>
                    }
                </div >

                <div className={`map ${this.state.sideBarHide ? "mapBigger" : ""}`}>
                    <div className="mapToolBar">
                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                            <>
                                <div style={{ cursor: 'pointer', width: '100%', textAlign: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', marginBottom: '10px'  }} onClick={() => this.showImages()} title="Images">
                                    <i className="fa fa-image"></i>
                                </div>
                                <div className={`${this.state.markersShowArray.includes('N/W Elements') ? "filterApplied" : ""}`} style={{ cursor: 'pointer', height: '40px', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', marginBottom: '10px' }} onClick={() => this.addToMarkers('N/W Elements')} title="N/W Elements"><i className="fa fa-sitemap" aria-hidden="true"></i></div>
                            </>
                        }
                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                            <div className={`${this.state.markersShowArray.includes('Audits') ? "filterApplied" : ""}`} style={{ cursor: 'pointer', height: '40px', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', marginBottom: '10px' }} onClick={() => this.addToMarkers('Audits')} title="Audits"><i className="fa fa-check-square-o"></i></div>
                        }
                        {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                            <>
                                <div className={`${this.state.filterApplied > 0 ? "filterApplied" : ""}`} style={{ cursor: 'pointer', height: '40px', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', marginBottom: '10px' }} onClick={() => { this.setState({ citiesForReport: [], selectedmarkers: [], selectedcables: [] }); this.openFilterWindow() }} title="Filters"><i className="fa fa-filter"></i></div>
                                <div style={{ cursor: 'pointer', height: '40px', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', marginBottom: '10px' }} onClick={() => { this.setState({ openDownloadWizard: true, reportShown: false, citiesForReport: [], selectedmarkers: [], selectedcables: [] }) }} title="Download & Reporting"><i className="fa fa-download"></i></div>
                                <div style={{ cursor: 'pointer', height: '40px', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', marginBottom: '10px' }} onClick={() => this.resetFilter()} title="Reset All"><i className="fa fa-refresh"></i></div>
                            </>
                        }
                    </div>
                    {/* <LoadScript
                        googleMapsApiKey="AIzaSyD6l5bH_gXHS6Qjxk4MdS_bDaqicwzI_uE"
                    > */}
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={this.state.recenter}
                            zoom={zoom}
                            labels={true}
                        >
                            {this.state.otdrResults.length > 0 &&
                                <OtdrMap otdrResults={this.state.otdrResults} otdrMapClicked={this.otdrMapClicked} />
                            }

                            {this.state.otdrFileLinkPosition.lat != 0 && this.state.otdrFileLinkPosition.lng != 0 &&
                                <InfoWindow
                                    onCloseClick={() => this.setState({ otdrFileLinkPosition: { lat: 0, lng: 0 } })}
                                    position={this.state.otdrFileLinkPosition}
                                >
                                    <div>
                                        <object data={this.state.otdrFileLink + '#toolbar=0'} type="application/pdf" width="500px" height="800px">
                                            <p>Alternative text - include a link <a href={this.state.otdrFileLink}>to the PDF!</a></p>
                                        </object>
                                    </div>

                                </InfoWindow>
                            }
                            {
                                this.state.selectedtracks.map((value3, index3) => {
                                    return (
                                        <div key={index3}>
                                            {value3.track.map((value2, index2) => {
                                                return (
                                                    <div key={index2}>
                                                        {this.state.filteredDataResult.length == 0 && this.state.rowShown === false &&
                                                            <div>
                                                                {value2.name.length == 1 &&

                                                                    <Polyline
                                                                        onMouseOver={(e) => this.pathClicked(e, value2.name)}
                                                                        onMouseOut={() => this.setState(
                                                                            {
                                                                                cableDetailsToShow: [],
                                                                                cableDetailsToShowPosition: { lat: 0, lng: 0 }
                                                                            }
                                                                        )}
                                                                        onClick={(e) => this.check(e)}
                                                                        path={value2.data}
                                                                        options={{
                                                                            strokeColor: colors[value2.color],
                                                                            strokeOpacity: 0.8,
                                                                            strokeWeight: 3,
                                                                            fillColor: colors[value2.color],
                                                                            fillOpacity: 0.35,
                                                                            clickable: true,
                                                                            draggable: false,
                                                                            editable: false,
                                                                            visible: true,
                                                                            radius: 30000,
                                                                            zIndex: 1
                                                                        }}
                                                                    />
                                                                }
                                                                {value2.name.length > 1 &&

                                                                    <Polyline
                                                                        onMouseOver={(e) => this.pathClicked(e, value2.name)}
                                                                        onMouseOut={() => this.setState(
                                                                            {
                                                                                cableDetailsToShow: [],
                                                                                cableDetailsToShowPosition: { lat: 0, lng: 0 }
                                                                            }
                                                                        )}
                                                                        path={value2.data}
                                                                        options={{
                                                                            strokeColor: '#000000',
                                                                            strokeOpacity: 0.8,
                                                                            strokeWeight: 7,
                                                                            fillColor: colors[value2.color],
                                                                            fillOpacity: 0.35,
                                                                            clickable: true,
                                                                            draggable: false,
                                                                            editable: false,
                                                                            visible: true,
                                                                            radius: 30000,
                                                                            zIndex: 1
                                                                        }}
                                                                    />
                                                                }
                                                            </div>
                                                        }
                                                        {this.state.filteredDataResult.length > 0 && this.state.rowShown === false &&
                                                            <Polyline
                                                                onMouseOver={(e) => this.pathClicked(e, value2.name)}
                                                                onMouseOut={() => this.setState(
                                                                    {
                                                                        cableDetailsToShow: [],
                                                                        cableDetailsToShowPosition: { lat: 0, lng: 0 }
                                                                    }
                                                                )}
                                                                path={value2.data}
                                                                options={{
                                                                    strokeColor: colors[value2.color],
                                                                    strokeOpacity: 0.8,
                                                                    strokeWeight: 3,
                                                                    fillColor: colors[value2.color],
                                                                    fillOpacity: 0.35,
                                                                    clickable: true,
                                                                    draggable: false,
                                                                    editable: false,
                                                                    visible: true,
                                                                    radius: 30000,
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                        }
                                                        {this.state.rowShown &&
                                                            <>
                                                                <Polyline
                                                                    path={value2.data}
                                                                    options={{
                                                                        strokeColor: this.state.RowColors[value3.row_status].color,
                                                                        strokeOpacity: this.state.RowColors[value3.row_status].opacity,
                                                                        strokeWeight: 16,
                                                                        fillColor: colors[value2.color],
                                                                        fillOpacity: 0.35,
                                                                        clickable: true,
                                                                        draggable: false,
                                                                        editable: false,
                                                                        visible: true,
                                                                        radius: 30000,
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                                <Polyline
                                                                    onMouseOver={(e) => this.pathClicked(e, value2.name)}
                                                                    onMouseOut={() => this.setState(
                                                                        {
                                                                            cableDetailsToShow: [],
                                                                            cableDetailsToShowPosition: { lat: 0, lng: 0 }
                                                                        }
                                                                    )}
                                                                    path={value2.data}
                                                                    options={{
                                                                        strokeColor: colors[value2.color],
                                                                        strokeOpacity: 1,
                                                                        strokeWeight: 3,
                                                                        fillColor: colors[value2.color],
                                                                        fillOpacity: 0.35,
                                                                        clickable: true,
                                                                        draggable: false,
                                                                        editable: false,
                                                                        visible: true,
                                                                        radius: 30000,
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                            </>
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })
                            }
                            {this.state.mappedmarkers.map((valuepre, index) => {
                                return (
                                    <div key={index}>
                                        {Object.entries(valuepre).map(([key, value]) => {
                                            return (
                                                <div key={key}>
                                                    {key !== 'detail' && key != 'id' && key !== 'subtrack' && key !== 'OFC/tower' && this.state.markersShowArray.includes('N/W Elements') &&
                                                        <div>
                                                            <Marker
                                                                onClick={() => this.markerClicked(value, valuepre.detail, valuepre)}
                                                                icon={{
                                                                    url: `https://joyndigital.com/Latitude/public/FiberAppMakrer/${key}.png`,
                                                                    scaledSize: { width: 20, height: 20 },
                                                                    anchor: { x: 5, y: 20 }
                                                                }}
                                                                title={key.substr(4)}
                                                                position={{
                                                                    lat: value[0],
                                                                    lng: value[1],

                                                                }}
                                                            />
                                                        </div>

                                                    }
                                                    {key == 'OFC/tower' && this.state.markersShowArray.includes('N/W Elements') &&
                                                        <div>
                                                            <Marker
                                                                onClick={() => this.markerClicked(value, valuepre.detail, valuepre)}
                                                                icon={{
                                                                    url: `https://joyndigital.com/Latitude/public/FiberAppMakrer/${key}.png`,
                                                                    scaledSize: { width: 40, height: 40 },
                                                                    anchor: { x: 5, y: 20 }
                                                                }}
                                                                title={key.substr(4)}
                                                                position={{
                                                                    lat: value[0],
                                                                    lng: value[1],

                                                                }}
                                                            />
                                                        </div>

                                                    }
                                                </div>
                                            );
                                        })}

                                    </div>
                                )
                            })}

                            {this.state.auditMarkers.map((value, index) => {
                                return (
                                    <div key={index}>
                                        {this.state.markersShowArray.includes('Audits') &&
                                            <div>
                                                <Marker
                                                    key={index}
                                                    onClick={() => this.auditMarkerClicked(value)}
                                                    icon={{
                                                        url: `https://joyndigital.com/Latitude/public/Audit/auditMarker.png`,
                                                        scaledSize: { width: 30, height: 30 },
                                                        anchor: { x: 5, y: 20 }
                                                    }}
                                                    position={value}
                                                />
                                            </div>
                                        }
                                    </div>
                                )
                            })}

                            {/* {this.state.plannedSites.map((value, index) => {
                                return (
                                        <Marker
                                            key={index}
                                            icon={{
                                                url: `planned.png`,
                                                scaledSize: { width: 30, height: 30 },
                                                anchor: { x: 5, y: 20 }
                                            }}
                                            title={'Planned Site' + ' ' + '|' + ' ' + 'Position => ' + 'Lat : ' + value.lat + " " + 'lng : ' + value.lng}
                                            position={value}
                                        />
                                )
                            })} */}

                            {Object.entries(this.state.plannedSites).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        {value.map((val, ind) => {
                                            return (
                                                <Marker
                                                    key={ind}
                                                    icon={{
                                                        url: `planned.png`,
                                                        scaledSize: { width: 30, height: 30 },
                                                        anchor: { x: 5, y: 20 }
                                                    }}
                                                    title={'Planned Site' + ' ' + '|' + ' ' + 'Position => ' + 'Lat : ' + val.lat + " " + 'lng : ' + val.lng}
                                                    position={val}
                                                />
                                            )
                                        })}
                                    </div>
                                )
                            })}

                            {Object.entries(this.state.potentialSites).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        {value.map((val, ind) => {
                                            return (
                                                <Marker
                                                    key={ind}
                                                    icon={{
                                                        url: `potential.png`,
                                                        scaledSize: { width: 30, height: 30 },
                                                        anchor: { x: 5, y: 20 }
                                                    }}
                                                    title={'Potential Site' + ' ' + '|' + ' ' + 'Position => ' + 'Lat : ' + val.lat + " " + 'lng : ' + val.lng}
                                                    position={val}
                                                />
                                            )
                                        })}
                                    </div>
                                )
                            })}

                            {/* {this.state.potentialSites.map((value, index) => {
                                return (
                                    <div>
                                        <Marker
                                            key={index}
                                            icon={{
                                                url: `potential.png`,
                                                scaledSize: { width: 30, height: 30 },
                                                anchor: { x: 5, y: 20 }
                                            }}
                                            title={'Potential Site'+ ' ' + '|' + ' ' + 'Position => ' + 'Lat : ' + value.lat + " " + 'lng : ' + value.lng}
                                            position={value}
                                        />
                                    </div>
                                )
                            })} */}

                            {this.state.detailsToShowPosition.lat != 0 && this.state.detailsToShowPosition.lng != 0 &&
                                <InfoWindow
                                    onCloseClick={() => this.infowindowclosed()}
                                    position={this.state.detailsToShowPosition}
                                >
                                    <div>
                                        {Object.keys(this.state.detailsToShow).length > 1 &&
                                            <table border='1'>
                                                {Object.entries(this.state.detailsToShow).map(([key, value]) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key}</td>
                                                            <td>{value}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </table>
                                        }
                                        {Object.keys(this.state.detailsToShow).length === 1 &&
                                            <table border='1'>
                                                {Object.entries(this.state.detailsToShow).map(([key, value]) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{value}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </table>
                                        }
                                    </div>

                                </InfoWindow>
                            }

                            {this.state.cableDetailsToShowPosition.lat != 0 && this.state.cableDetailsToShowPosition.lng != 0 && Array.isArray(this.state.cableDetailsToShow) &&
                                <InfoWindow
                                    onCloseClick={() => this.cableInfowindowclosed()}
                                    position={this.state.cableDetailsToShowPosition}
                                >
                                    <div>
                                        {this.state.cableDetailsToShow.map((detail, ind) => {
                                            return (
                                                <div key={ind}>
                                                    {ind + 1} - {detail}
                                                </div>
                                            )
                                        })}
                                    </div>

                                </InfoWindow>
                            }

                            {this.state.auditDetailsToShowPosition.lat != 0 && this.state.auditDetailsToShowPosition.lng != 0 &&
                                <InfoWindow
                                    onCloseClick={() => this.auditInfowindowclosed()}
                                    position={this.state.auditDetailsToShowPosition}
                                >
                                    <div>
                                        {this.state.auditDetailsToShow.map((detail, ind) => {
                                            return (
                                                <div key={ind}>
                                                    <div>Date :  {detail.month} </div>
                                                    {this.state.auditForms.map((value, index) => {

                                                        return (

                                                            <div key={index}>
                                                                {detail.question.some((item) => { return item.form == value.name }) &&
                                                                    <div>
                                                                        <div style={{ fontWeight: 'bold' }}>{value.name}</div>
                                                                        {value.checklists.map((value2, index2) => {
                                                                            return (
                                                                                <div key={index2}>
                                                                                    {detail.question.some((item) => { return item.checklist == value2.name }) &&
                                                                                        <div>
                                                                                            <div style={{ fontWeight: 'bold', marginLeft: '30px' }}>{value2.name}</div>
                                                                                            {value2.headings.map((value3, index3) => {

                                                                                                return (
                                                                                                    <div key={index3}>
                                                                                                        {detail.question.some((item) => { return item.heading == value3 }) &&
                                                                                                            <div>
                                                                                                                <div style={{ fontWeight: 'bold', marginLeft: '60px' }}>{value3}</div>
                                                                                                                {detail.question.map((q, i) => {

                                                                                                                    return (
                                                                                                                        <div key={i}>
                                                                                                                            {q.heading == value3 && q.checklist == value2.name && q.form == value.name &&
                                                                                                                                <div>
                                                                                                                                    <div style={{ marginLeft: '90px' }}>{q.name} <i style={{ cursor: 'pointer', fontSize: '10px' }} className="fa fa-image" onClick={() => { this.showAuditImage() }}></i></div>
                                                                                                                                    <div style={{ marginLeft: '120px', fontSize: '10px' }}>
                                                                                                                                        {q.checkoptions.map((choption, chind) => {
                                                                                                                                            return (
                                                                                                                                                <span key={chind}>{choption.name}<input onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', height: '10px', width: '10px' }} type="checkbox" defaultChecked={choption.id == q.c_co} /> </span>
                                                                                                                                            )
                                                                                                                                        })}

                                                                                                                                        {q.multiselectOptions.map((moption, mind) => {
                                                                                                                                            return (
                                                                                                                                                <span key={mind}>{moption.name}<input onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', height: '10px', width: '10px' }} type="checkbox" defaultChecked={q.m_so.includes(moption.id)} /> </span>
                                                                                                                                            )
                                                                                                                                        })}

                                                                                                                                        {q.texts.map((text, textind) => {
                                                                                                                                            return (
                                                                                                                                                <div key={textind}>
                                                                                                                                                    {text.name} : {q.text[text.id]}
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                        })}

                                                                                                                                        {q.dropdownoptions.map((doption, dind) => {
                                                                                                                                            return (
                                                                                                                                                <div key={dind}>
                                                                                                                                                    {doption.id == q.d_do &&
                                                                                                                                                        <div>
                                                                                                                                                            {doption.name}
                                                                                                                                                        </div>
                                                                                                                                                    }
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                        })}
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            }
                                                                                                                        </div>

                                                                                                                    )
                                                                                                                })}
                                                                                                            </div>
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>

                                </InfoWindow>
                            }
                        </GoogleMap>
                    {/* </LoadScript> */}
                    <div style={{ height: '30px', width: '100%', background: '#4162A6', color: 'white', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {this.state.totalSelectedPlannedSites > 0 &&
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                                Planned Sites | {this.state.totalSelectedPlannedSites}
                            </div>
                        }

                        {this.state.totalSelectedPotentialSites > 0 &&
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', fontSize: '13px' }}>
                                Potential Sites | {this.state.totalSelectedPotentialSites}
                            </div>
                        }
                    </div>
                </div>



                {
                    this.state.reportShown &&
                    <div className="GisView_report">
                        <div onClick={() => this.closeReport()} style={{ fontWeight: 'bold', marginRight: '20px', textAlign: 'right', cursor: 'pointer', margin: '0' }}>x</div>
                        {this.state.filteredDataResult.length === 0 &&
                            <div style={{ background: 'rgb(230, 97, 57)', color: "white", }}>
                                <h3>No Track Selected!</h3>
                                <p>Filters run against tracks. Please select tracks and apply filter again to generate report</p>
                            </div>
                        }
                        {this.state.filteredDataResult.length !== 0 &&
                            <div style={{ overflow: 'auto', height: 'calc(100% - 50px)', margin: '0' }}>

                                <div style={{ clear: 'both' }}></div>
                                <h4 style={{ marginTop: 0, textAlign: 'center', color: 'black' }}> Report </h4>

                                {this.state.summaryCables.length > 1 &&
                                    <div>
                                        <h5 style={{ textAlign: 'center', color: 'black' }}> Cable Types Summary </h5>
                                        <table>
                                            <tr>
                                                <th>Cable</th>
                                                <th>Length (KM)</th>
                                            </tr>
                                            {this.state.summaryCables.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.name}</td>
                                                        <td>{value.lenght.toFixed(2)}</td>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </div>
                                }

                                {this.state.summaryMarkers.length > 1 &&
                                    <div>
                                        <h5 style={{ textAlign: 'center', color: 'black' }}> N/W Elements Summary </h5>
                                        <table>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                            </tr>
                                            {this.state.summaryMarkers.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        {value.name != 'Total' &&
                                                            <>
                                                                {value.name !== 'OFC/tower' &&
                                                                    <td>{value.name.split("/").pop()}</td>
                                                                }
                                                                {value.name == 'OFC/tower' &&
                                                                    <td>cell-site</td>
                                                                }
                                                                <td>{value.quantity}</td>
                                                            </>
                                                        }
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </div>
                                }

                                {/* <h5 style={{ textAlign: 'center' }}> Cables/Elements per Track </h5>

                                {this.state.filteredDataResult.map((value, index) => {
                                    return (
                                        <div key={index} style={{ borderBottom: '1px solid white' }}>
                                            <h5 style={{ color: '#04b2d9' }}>{value.track}</h5>
                                            <h6 style={{ marginBottom: '0px', textAlign: 'center' }}>OFC</h6>
                                            <table style={{ width: '100%' }}>
                                                <tr>
                                                    <th style={{ textAlign: 'center', height: 'auto' }}>type</th>
                                                    <th style={{ textAlign: 'center', height: 'auto' }}>quantity</th>
                                                </tr>
                                                {value.markers.map((val, ind) => {
                                                    return (
                                                        <tr key={ind}>
                                                            {val.name !== 'OFC/tower' &&
                                                                <td>{val.name.split("/").pop()}</td>
                                                            }
                                                            {val.name == 'OFC/tower' &&
                                                                <td>cell-site</td>
                                                            }
                                                            <td style={{ textAlign: 'center' }}>{val.quantity}</td>
                                                        </tr>
                                                    )

                                                })}
                                            </table>

                                            <h6 style={{ marginBottom: '0px', textAlign: 'center' }}>Cables</h6>
                                            <table style={{ width: '100%' }}>
                                                <tr>
                                                    <th style={{ textAlign: 'center', height: 'auto' }}>name</th>
                                                    <th style={{ textAlign: 'center', height: 'auto' }}>length (km)</th>
                                                </tr>
                                                {value.cables.map((val2, ind2) => {
                                                    return (
                                                        <tr key={ind2}>
                                                            <td style={{ textAlign: 'center' }}>{val2.name}</td>
                                                            <td style={{ textAlign: 'center' }}>{val2.lenght.toFixed(2)}</td>
                                                        </tr>
                                                    )

                                                })}
                                            </table>
                                        </div>
                                    )
                                })} */}
                            </div>
                        }
                        {this.state.filteredDataResult.length !== 0 &&
                            <div style={{ height: '30px', width: '100%', textAlign: 'center', margin: '0' }}><button onClick={() => this.downloadReport(this.state.filteredDataResult, "Vehicle Report", true)}>Download Report</button></div>
                        }

                    </div>
                }

                {
                    this.state.imageShown &&
                    <div className="GisView_image">
                        <div onClick={() => this.closeImage()} style={{ fontWeight: 'bold', marginRight: '20px', cursor: 'pointer', position: 'fixed', right: '0', top: '60px' }}>x</div>
                        <div style={{ clear: 'both' }}></div>
                        <h5 style={{ marginTop: 0, textAlign: 'center' }}> Images of Selected Tracks </h5>
                        {this.state.selectedtracks.map((value, index) => {
                            return (
                                <div key={index}>
                                    <h5>{value.name}</h5>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>Name</th>
                                            <th style={{ textAlign: 'center' }}>Image</th>
                                        </tr>
                                        {value.trackmedia.map((val, ind) => {
                                            return (
                                                <tr key={ind} style={{ heigth: '100px', width: '100px' }}>
                                                    <td style={{ textAlign: 'center' }}>{val.name}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <a href={`${process.env.REACT_APP_FIBERIMAGES_BASE_URL}${value.name}/image/${val.name}`} target="_blank">
                                                            <img src={`${process.env.REACT_APP_FIBERIMAGES_BASE_URL}${value.name}/image/${val.name}`} style={{ height: '100px', width: '100px' }} />
                                                        </a>

                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </table>
                                </div>
                            )
                        })}
                    </div>
                }

                {
                    this.state.auditImageShown &&
                    <div className="GisView_image">
                        <div onClick={() => this.closeAuditImage()} style={{ float: 'right', fontWeight: 'bold', marginRight: '20px', cursor: 'pointer' }}>x</div>
                        <div style={{ clear: 'both' }}></div>
                        <h5 style={{ marginTop: 0, textAlign: 'center' }}> Images </h5>
                        <p style={{ textAlign: 'center' }}> no images for this question</p>
                    </div>
                }

            </div >
        )
    }

    componentWillUnmount() {
        clearInterval(myInterval)
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

            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/inspectionDashboardInit', { cust_id: localStorage.getItem('cust_id') }, config)
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
                    data = res.data;
                    console.log('checking', data);
                    this.state.ana = res.data.ana[0].data;
                    this.state.cables = res.data.cable[0].data;
                    var tempAuditMarkers = res.data.auditMarkers;
                    tempAuditMarkers = tempAuditMarkers.map(val => {
                        return JSON.parse(val)
                    })
                    this.setState({ auditMarkers: tempAuditMarkers });
                    this.setState({ isLoading: false })

                }).catch(err => {
                    console.log(err);
                    this.setState({ isLoading: false });
                    alert('Ambigious response from the server, Please check your internet Connection')
                })

        })
    }
}

export default GisView;