import { useState, useEffect, useRef } from "react";

import '../styles/JourneyPlan.css'

import Axios from 'axios'

import { GoogleMap, LoadScript, OverlayView, Polyline, Marker, Polygon, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { faPeopleArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";

function JourneyPlan(props) {

    const location = useLocation();

    const [directions, setDirections] = useState([])

    const [map, setMap] = useState(null)

    const [zoom, setZoom] = useState(12)

    const [journeyPlanWizardShown, setJourneyPlanWizardShown] = useState(false)

    const [journeyPlans, setJourneyPlans] = useState([])

    const [teamMembers, setTeamMembers] = useState([])

    const [selectedJourneyPlan, setSelectedJourneyPlan] = useState(null)

    const [selectedTeamMembers, setSelectedTeamMembers] = useState([])

    const [center, setCenter] = useState({ lat: 33.50482154971537, lng: 73.06347117366387 });

    const [city, setCity] = useState('');

    const [journeyName, setJourneyName] = useState('');

    const [markers, setMarkers] = useState([]);

    const [addingAreaActive, setAddingAreaActive] = useState(false);
    const [addingLocationsActive, setAddingLocationsActive] = useState(false);

    const [areas, setAreas] = useState([]);

    const [areaName, setAreaName] = useState('')
    const [areaPoints, setAreaPoints] = useState([])

    const [locations, setLocations] = useState([]);
    const [previousLocations, setPreviousLocations] = useState([]);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [jpState, setJpState] = useState('');

    const [auto, setAuto] = useState(false)
    const [routesAdded, setRoutesAdded] = useState(false)

    const [enterNameLocation, setEnterNameLocation] = useState({index: null, position:{ lat: 0, lng: 0 }})

    const colors = { complete: 'green', incomplete: 'red' }

    const clearAllStates2 = () => {
        let tempAreas = []
        let tempAreaPoints = []
        let tempLocations = []
        let tempDirections = []
        let tempTeamMembers = []

        setLocations([...tempLocations])
        setAreaPoints([...tempAreaPoints])
        setAreas([...tempAreas])
        setSelectedJourneyPlan(null)
        setAreaName('')
        setJourneyName('')
        setStartDate('')
        setEndDate('')
        setAddingAreaActive(false)
        setAddingLocationsActive(false)
        setAuto(false)
        setRoutesAdded(false)
        setDirections([...tempDirections])
        setSelectedTeamMembers([...tempTeamMembers])
    }

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/journeyPlanInit', { cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('init', res.data)
                res.data.journeyPlans.forEach((val) => {
                    val.areas = JSON.parse(val.areas)
                    val.locations = JSON.parse(val.locations)
                    val.directions = JSON.parse(val.directions)
                })
                setJourneyPlans([...res.data.journeyPlans]);
                setTeamMembers([...res.data.teamMembers]);
                clearAllStates2();

            }).catch(err => { console.log(err); alert('Ambigious response from server, Could not complete action'); })
    }

    const pathClicked = (e) => {
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log('position', position)
        if (addingAreaActive && jpState === 'adding') {
            addAreaPoints(position)
        }
        if (addingLocationsActive && jpState === 'adding') {
            addLocations(position)
        }
    }

    const addAreaPoints = (position) => {
        let tempPoints = areaPoints;
        tempPoints.push(position);
        setAreaPoints([...tempPoints])
    }

    const addLocations = (position) => {
        if (auto) {
            if (locations.length === 4) {
                alert('Only 4 Locations are allowed')
                return
            }
        }
        let tempPosition = { position: position, status: 'incomplete', starting: false }
        setLocations(prevLoc => {
            setPreviousLocations([...prevLoc])
            let tempLocations = locations;
            tempLocations.push(tempPosition);
            return [...tempLocations]
        })
    }


    const citySelected = (e) => {
        setCity(e.target.value);
    }

    useEffect(() => {
        console.log('check city', city)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/inspectionDashboardInitGetTracksCity', { city: city, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                let tempMarkers = []
                res.data.data = res.data.data.forEach((item, index) => {
                    item.data = JSON.parse(item.data)
                    item.data.markerposition.forEach((val) => {
                        for (let x in val) {
                            if (x == 'OFC/tower') {
                                let temp = { name: x, location: { lat: val[x][0], lng: val[x][1] } }
                                tempMarkers.push(temp)
                            }
                        }
                    })
                })

                setMarkers([...tempMarkers])
                let tempCenter = {}
                if (tempMarkers.length > 0) {
                    tempCenter = tempMarkers[tempMarkers.length - 1].location
                    setCenter({ ...tempCenter })
                }

            }).catch(err => {
                console.log(err);
            })
    }, [city])

    useEffect(() => {
        console.log('check markers', markers)
    }, [markers])

    const addArea = () => {
        if (areaName === '' || areaPoints.length === 0) {
            alert('Enter the area name and select area on the map')
            return
        }
        console.log('area Name', areaName)
        console.log('area Points', areaPoints)
        let tempAreas = areas
        let tempArea = {
            name: areaName,
            points: areaPoints,
            status: 'incomplete'
        }
        tempAreas.push(tempArea)
        setAreas([...tempAreas])
        setAreaName('')
        let tempAreaPoints = []
        setAreaPoints([...tempAreaPoints])
        setAddingAreaActive(false)
        console.log((window.google.maps.geometry.spherical.computeArea(areaPoints) * 0.000001).toFixed(2))
    }

    useEffect(() => {
        console.log('areas', areas)
    }, [areas])

    const areaPointDragged = (e, index) => {
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log(position)
        let tempAreaPoints = areaPoints;
        tempAreaPoints[index] = position;
        setAreaPoints([...tempAreaPoints])
    }

    const areaPointDeleted = (index) => {
        let tempAreaPoints = areaPoints;
        tempAreaPoints = tempAreaPoints.filter((value, ind) => {
            return ind !== index
        })
        setAreaPoints([...tempAreaPoints])
    }

    const locationDeleted = (index) => {
        if (index === locations.length - 1) {
            setLocations(prevLoc => {
                setPreviousLocations([...prevLoc])
                let tempLocations = locations;
                tempLocations = tempLocations.filter((value, ind) => {
                    return ind !== index
                })
                return [...tempLocations]
            })
        } else {
            alert('Please Start Deleting from the last location')
        }
    }

    const addJourneyPlan = () => {
        if (JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '11' }) === false) {
            alert('Access Denied, no unauthorized access')
            return
        }
        console.log(journeyName)
        console.log(areas)
        console.log(locations)
        console.log(startDate)
        console.log(endDate)

        const dataToSend = {
            name: journeyName,
            areas: areas,
            locations: locations,
            directions: directions,
            teamMembers: selectedTeamMembers,
            startDate: startDate,
            endDate: endDate,
            cust_id: localStorage.getItem('cust_id')
        }

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/journeyPlanInsert', dataToSend)
            .then(res => {

                alert('Journey plane entered successfully')
                setJourneyPlanWizardShown(false)
                init();

            }).catch(err => { console.log(err); alert('Ambigious response from server, Could not complete action'); })
    }

    const journeySelected = (e) => {
        setJpState('view')
        setSelectedJourneyPlan(e.target.value)
    }

    useEffect(() => {
        if (selectedJourneyPlan !== null) {
            setAreas(journeyPlans[selectedJourneyPlan].areas)
            setLocations(journeyPlans[selectedJourneyPlan].locations)
            setDirections(journeyPlans[selectedJourneyPlan].directions)
            setJourneyName(journeyPlans[selectedJourneyPlan].name)
            setStartDate(journeyPlans[selectedJourneyPlan].startDate)
            setEndDate(journeyPlans[selectedJourneyPlan].endDate)
            setSelectedTeamMembers(journeyPlans[selectedJourneyPlan].teamMembers)
            setJourneyPlanWizardShown(true)
            setCenter(journeyPlans[selectedJourneyPlan].locations[0].position)
        }
    }, [selectedJourneyPlan])

    useEffect(() => {
        if (jpState === 'adding' && !auto) {
            if (locations.length > 1) {
                var directionsService = new window.google.maps.DirectionsService();
                let tempDirections = directions
                if (locations.length > previousLocations.length) {
                    var request = {
                        origin: locations[locations.length - 2].position,
                        destination: locations[locations.length - 1].position,
                        travelMode: 'DRIVING'
                    };
                    directionsService.route(request, function (result, status) {
                        if (status == 'OK') {
                            console.log('checking temporary', result)
                            let temp = { directions: result, status: 'incomplete', destination: locations[locations.length - 1].position }
                            // setDirections(state => [...result])
                            tempDirections.push(temp)
                            setDirections([...tempDirections])
                        }
                    });
                }
                if (locations.length < previousLocations.length) {
                    tempDirections = tempDirections.filter((val) => {
                        console.log(val)
                        return val.destination.lat !== previousLocations[previousLocations.length - 1].position.lat && val.destination.lng !== previousLocations[previousLocations.length - 1].position.lng
                    })
                    setDirections([...tempDirections])
                }
            }
            if (locations.length == 1) {
                let tempDirections = []
                setDirections([...tempDirections])
            }
        }
    }, [locations])

    useEffect(() => {
        if (directions.length > 0) {
            console.log('------directions-------', directions)
            // directions[0].directions.routes[0].overview_path.forEach((val) => {
            //     console.log('direction lat lng', val.lat())
            // })
        }
    }, [directions])



    const teamMemberClicked = (item) => {

        console.log(item)
        let temp = [];
        temp.push(item);
        setSelectedTeamMembers([...temp])

    }

    useEffect(() => {
        console.log('checking', selectedTeamMembers)
    }, [selectedTeamMembers])

    const removeTime = (date) => {
        console.log(date);
        if (date !== null && date !== undefined) {
            var d = date;
            d = d.split(' ')[0];
            return d
        }
        return
    }

    const createAutoJourneyPlan = async () => {

        //console.log(locations)
        if (locations.some((val) => { return val.starting })) {
            let tempLocations = locations;
            let newLocations = [];
            let indexToRemove = null;

            tempLocations.forEach((val) => {
                if (val.starting) {
                    newLocations.push(val)
                    indexToRemove = tempLocations.findIndex(object => {
                        return object.position.lat === val.position.lat && object.position.lng === val.position.lng;
                    });
                }
            })

            tempLocations.splice(indexToRemove, 1);

            let num = tempLocations.length;

            for (let i = 1; i <= num; i++) {
                let smallestDistance = Infinity;
                let smallestDistancePosition = {};
                for (let val of tempLocations) {
                    const distance = await roadDistance(newLocations[newLocations.length - 1].position, val.position);
                    console.log('calculated Distance', distance)
                    if (distance < smallestDistance) {
                        smallestDistance = distance
                        smallestDistancePosition = val
                    }
                }
                console.log('smallest Distance', smallestDistance)
                console.log('smallest Distance Position', smallestDistancePosition)
                newLocations.push(smallestDistancePosition)
                indexToRemove = tempLocations.findIndex(object => {
                    return object.position.lat === smallestDistancePosition.position.lat && object.position.lng === smallestDistancePosition.position.lng;
                });
                tempLocations.splice(indexToRemove, 1);
            }

            console.log(tempLocations);
            console.log(newLocations)

            setLocations([...newLocations])
            setRoutesAdded(true)
        } else {
            alert('Please Select a starting location first')
        }

    }

    useEffect(() => {
        if (routesAdded) {
            createRoutes();
        }
    }, [routesAdded])

    const createRoutes = async () => {
        let tempDirections = []
        for (let i = 0; i < locations.length; i++) {
            if (i < locations.length - 1) {
                let result = await getDirections(locations[i].position, locations[i + 1].position)
                let temp = { directions: result, status: 'incomplete', destination: locations[locations.length - 1].position }
                tempDirections.push(temp)
            }
        }
        setDirections(tempDirections)
    }

    const startingLocationsSelect = (index) => {
        let tempLocations = locations;

        if (tempLocations[index].starting) {
            tempLocations[index].starting = false
        } else {
            tempLocations = tempLocations.map((val, ind) => {
                if (ind === index) {
                    val.starting = true
                } else {
                    val.starting = false
                }
                return val
            })
        }

        setLocations([...tempLocations])
    }

    async function roadDistance(origin, destination) {
        //Creates a polyline
        const directionsService = new window.google.maps.DirectionsService();
        const request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING',
        };
        return new Promise(resolve => directionsService.route(request,
            function (result, status) {
                if (status === "OK") {
                    resolve(result.routes[0].legs[0].distance.value)
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            })
        );
    }

    async function getDirections(origin, destination) {
        //Creates a polyline
        const directionsService = new window.google.maps.DirectionsService();
        const request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING',
        };
        return new Promise(resolve => directionsService.route(request,
            function (result, status) {
                if (status === "OK") {
                    resolve(result)
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            })
        );
    }

    useEffect(() => {
        console.log('enterNameLocation', enterNameLocation)
    }, [enterNameLocation])

    return (
        <>
            <div className="JourneyPlan_wrapper">
                {journeyPlanWizardShown &&
                    <div className="JourneyPlan_enterPJPwizard">
                        <div onClick={() => { setJourneyPlanWizardShown(false); clearAllStates2(); }} style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '10px', cursor: 'pointer' }}>x</div>
                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Journey Plan</div>

                        <div className="TeamCreationInputField" style={{ width: '90%', marginLeft: '50%', transform: 'translateX(-50%)' }}>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Name</div>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                <input value={journeyName} onChange={(e) => setJourneyName(e.target.value)} style={{ width: '90%' }} type='text' />
                            </div>
                        </div>

                        <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Areas</span>
                            <span onClick={() => { setAddingAreaActive(!addingAreaActive); setAddingLocationsActive(false) }} style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                {!addingAreaActive && jpState === 'adding' &&
                                    <><i className="fa fa-plus" style={{ marginLeft: '15px', fontSize: '14px' }}></i></>
                                }
                                {addingAreaActive && jpState === 'adding' &&
                                    <><i className="fa fa-minus" style={{ marginLeft: '15px', fontSize: '14px' }}></i></>
                                }
                            </span>
                        </div>
                        {addingAreaActive && jpState === 'adding' &&
                            <div className="JourneyPlan_area_wizard">
                                <div style={{ textAlign: 'center', fontSize: 'small' }}>Enter Area Name and make area on the map by clicking on the map</div>
                                <div className="TeamCreationInputField" style={{ width: '90%', marginLeft: '50%', transform: 'translateX(-50%)' }}>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Area Name</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <input value={areaName} onChange={(e) => setAreaName(e.target.value)} style={{ width: '90%' }} type='text' />
                                    </div>
                                </div>
                                <button onClick={() => addArea()} style={{ background: '#4162a6', color: 'white', fontWeight: 'bold', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px', padding: '5px', paddingTop: '2px', paddingBottom: '2px' }}>Add</button>
                            </div>
                        }
                        <ul style={{ marginTop: '0px' }}>
                            {areas.map((item) => {
                                return (
                                    <li>{item.name}</li>
                                )
                            })}
                        </ul>

                        <hr></hr>

                        <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Locations</span>
                            <span onClick={() => { setAddingLocationsActive(!addingLocationsActive); setAddingAreaActive(false) }} style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                {!addingLocationsActive && jpState === 'adding' &&
                                    <><i className="fa fa-plus" style={{ marginLeft: '15px', fontSize: '14px' }}></i></>
                                }
                                {addingLocationsActive && jpState === 'adding' &&
                                    <><i className="fa fa-minus" style={{ marginLeft: '15px', fontSize: '14px' }}></i></>
                                }
                            </span>
                        </div>
                        {addingLocationsActive &&
                            <div style={{ textAlign: 'center' }}>
                                <input onChange={() => { setAuto(false); setRoutesAdded(false); setLocations([]); setDirections([]) }} type="checkbox" checked={!auto} /> Simple
                                <input onChange={() => { setAuto(true); setRoutesAdded(false); setLocations([]); setDirections([]) }} type="checkbox" checked={auto} /> Automated
                            </div>
                        }

                        {addingLocationsActive && jpState === 'adding' && !auto &&
                            <div style={{ textAlign: 'center', fontSize: 'small' }}>Enter Locations by clicking on the map, order of entry will be the order of priority. Routes will be created with subsequent locations</div>
                        }
                        {addingLocationsActive && jpState === 'adding' && auto &&
                            <div style={{ textAlign: 'center', fontSize: 'small' }}>Enter Locations by clicking on the map, after locations are selected, select the starting location by double clicking on the location, then press the button to Create automated journey plan</div>
                        }
                        <ul style={{ marginTop: '0px' }}>
                            {locations.map((item, index) => {
                                return (
                                    <li>Location {index + 1}</li>
                                )
                            })}
                        </ul>
                        {addingLocationsActive && jpState === 'adding' && auto &&
                            <div style={{ textAlign: 'center', fontSize: 'small' }}>
                                <button onClick={() => createAutoJourneyPlan()} style={{ background: '#4162a6', width: '50%', color: 'white', fontWeight: 'bold', height: '90%', border: '2px solid white', cursor: 'pointer', padding: '5px' }}>Create Journey Plan</button>
                            </div>
                        }

                        <hr></hr>

                        {jpState === 'adding' &&
                            <>
                                <div className="TeamCreationInputField" style={{ width: '90%', marginLeft: '50%', transform: 'translateX(-50%)' }}>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Start Date</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <input value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '90%' }} type='date' />
                                    </div>
                                </div>

                                <div className="TeamCreationInputField" style={{ width: '90%', marginLeft: '50%', transform: 'translateX(-50%)' }}>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>End Date</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <input value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '90%' }} type='date' />
                                    </div>
                                </div>
                            </>
                        }
                        {jpState !== 'adding' &&
                            <>
                                <div className="TeamCreationInputField" style={{ width: '90%', marginLeft: '50%', transform: 'translateX(-50%)' }}>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Start Date</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <span>{removeTime(startDate)}</span>
                                    </div>
                                </div>

                                <div className="TeamCreationInputField" style={{ width: '90%', marginLeft: '50%', transform: 'translateX(-50%)' }}>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>End Date</div>
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <span>{removeTime(endDate)}</span>
                                    </div>
                                </div>
                            </>
                        }

                        <hr></hr>

                        <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Team Members</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {teamMembers.map((item, index) => {
                                    return (
                                        <div style={{ width: '50%', fontSize: 'small', textAlign: 'center' }}>
                                            <input checked={selectedTeamMembers.some((val) => { return val.id === item.id })} onClick={() => teamMemberClicked(item)} type="checkbox" />{item.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <hr></hr>

                        {jpState === 'adding' &&
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={() => addJourneyPlan()} style={{ background: '#4162a6', width: '50%', color: 'white', fontWeight: 'bold', height: '90%', border: '2px solid white', cursor: 'pointer', padding: '5px' }}>Add Journey Plan</button>
                            </div>
                        }

                    </div>
                }
                <div className="JourneyPlan_map">
                    {/* <LoadScript
                    googleMapsApiKey="AIzaSyD6l5bH_gXHS6Qjxk4MdS_bDaqicwzI_uE"
                > */}
                    <GoogleMap
                        onClick={(e) => pathClicked(e)}
                        onLoad={map => { setMap(map) }}
                        // onZoomChanged={() => zoomChanged()}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={center}
                        options={
                            { fullscreenControl: false }
                        }
                        zoom={zoom}
                    >

                        {markers.map((item, index) => {
                            return (
                                <Marker
                                    key={index}
                                    icon={{
                                        url: `https://joyndigital.com/Latitude/public/FiberAppMakrer/${item.name}.png`,
                                        scaledSize: { width: 30, height: 30 },
                                        anchor: { x: 5, y: 20 }
                                    }}
                                    position={item.location}
                                    options={{
                                        clickable: false,
                                    }}

                                />
                            )
                        })}

                        <Polygon
                            paths={areaPoints}
                            options={{
                                fillColor: 'grey',
                                fillOpacity: 0.5,
                                strokeColor: "black",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                clickable: false,
                                draggable: false,
                                editable: false,
                                geodesic: false,
                                zIndex: 1
                            }}
                        />

                        {areaPoints.map((position, index) => {
                            return (
                                <Marker
                                    onRightClick={() => areaPointDeleted(index)}
                                    onDrag={(e) => areaPointDragged(e, index)}
                                    position={position}
                                    icon={{
                                        url: `cross.png`,
                                        scaledSize: { width: 30, height: 30 },
                                        anchor: { x: 15, y: 15 }
                                    }}
                                    options={{
                                        draggable: true
                                    }}
                                />
                            )
                        })}

                        {jpState === 'view' &&
                            <>
                                {locations.map((item, index) => {
                                    return (
                                        <>
                                            <Marker
                                                position={item.position}
                                                icon={{
                                                    url: `${item.status}.png`,
                                                    scaledSize: { width: 30, height: 30 },
                                                    anchor: { x: 5, y: 20 }
                                                }}
                                            />
                                            {!auto &&
                                                <OverlayView
                                                    position={item.position}
                                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                                >
                                                    <div style={{ background: '#4162a6', color: 'white', marginLeft: '25px', marginTop: '-40px', padding: '10px', padding: '5px 5px 5px 5px' }}>
                                                        {`Location ${index + 1}`}
                                                    </div>
                                                </OverlayView>
                                            }

                                        </>
                                    )
                                })}
                            </>
                        }
                        {jpState === 'adding' && !auto &&
                            <>
                                {locations.map((item, index) => {
                                    return (
                                        <>
                                            <Marker
                                                onRightClick={() => locationDeleted(index)}
                                                onClick={() => {
                                                    let temp = {index: index, position: item.position}
                                                    setEnterNameLocation({...temp})
                                                }}
                                                position={item.position}
                                                icon={{
                                                    url: `${item.status}.png`,
                                                    scaledSize: { width: 30, height: 30 },
                                                    anchor: { x: 5, y: 20 }
                                                }}
                                            />
                                            <OverlayView
                                                position={item.position}
                                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                            >
                                                <div style={{ background: '#4162a6', color: 'white', marginLeft: '25px', marginTop: '-40px', padding: '5px 5px 5px 5px' }}>
                                                    {`Location ${index + 1}`}
                                                </div>
                                            </OverlayView>

                                        </>
                                    )
                                })}
                            </>
                        }

                        {jpState === 'adding' && auto &&
                            <>
                                {locations.map((item, index) => {
                                    return (
                                        <>
                                            <Marker
                                                onRightClick={() => locationDeleted(index)}
                                                onDblClick={() => startingLocationsSelect(index)}
                                                position={item.position}
                                                icon={{
                                                    url: `${item.status}.png`,
                                                    scaledSize: { width: 30, height: 30 },
                                                    anchor: { x: 5, y: 20 }
                                                }}
                                            />
                                            {item.starting &&
                                                <OverlayView
                                                    position={item.position}
                                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                                >
                                                    <div style={{ background: '#4162a6', color: 'white', marginLeft: '25px', marginTop: '-40px', padding: '5px 5px 5px 5px' }}>
                                                        Location 1
                                                    </div>
                                                </OverlayView>
                                            }

                                        </>
                                    )
                                })}
                            </>
                        }

                        {enterNameLocation.index != null && jpState === 'adding' &&
                            <InfoWindow
                                onCloseClick={() => { let temp = {index: null, position: {lat: 0, lng: 0}}; setEnterNameLocation({...temp})}}
                                position={enterNameLocation.position}
                            >
                                <div>
                                    <input type="text" />
                                </div>

                            </InfoWindow>
                        }

                        {jpState === 'adding' && auto && routesAdded &&
                            <>
                                {locations.map((item, index) => {
                                    return (
                                        <>
                                            <Marker
                                                onRightClick={() => locationDeleted(index)}
                                                onClick={() => {
                                                    let temp = {index: index, position: item.position}
                                                    setEnterNameLocation({...temp})
                                                }}
                                                position={item.position}
                                                icon={{
                                                    url: `${item.status}.png`,
                                                    scaledSize: { width: 30, height: 30 },
                                                    anchor: { x: 5, y: 20 }
                                                }}
                                            />
                                            <OverlayView
                                                position={item.position}
                                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                            >
                                                <div style={{ background: '#4162a6', color: 'white', marginLeft: '25px', marginTop: '-40px', padding: '5px 5px 5px 5px' }}>
                                                    {`Location ${index + 1}`}
                                                </div>
                                            </OverlayView>

                                        </>
                                    )
                                })}
                            </>
                        }


                        {directions.map((item, index) => {
                            return (
                                <DirectionsRenderer
                                    options={{
                                        directions: item.directions,
                                        polylineOptions: { strokeColor: colors[item.status] },
                                        suppressMarkers: true,
                                        preserveViewport: true
                                    }}
                                />
                            )
                        })}


                        {areas.map((item, index) => {
                            return (
                                <Polygon
                                    paths={item.points}
                                    const options={{
                                        fillColor: colors[item.status],
                                        fillOpacity: 0.5,
                                        strokeColor: "black",
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                        clickable: false,
                                        draggable: false,
                                        editable: false,
                                        geodesic: false,
                                        zIndex: 1
                                    }}
                                />
                            )
                        })}

                    </GoogleMap>
                    {/* </LoadScript> */}
                </div>
                <div className="JourneyPlan_BottomBar">
                    {/* <span style={{ marginLeft: '10px', marginRight: '10px', color: 'white' }}>Select City</span>
                <select defaultValue={city} onChange={(e) => citySelected(e)} style={{ background: 'transparent', color: 'white', border: '2px solid white', height: '100%' }}>
                    <option value={city} disabled>{city}</option>
                    <option style={{ color: 'black' }} value="Islamabad">Islamabad</option>
                    <option style={{ color: 'black' }} value="Rawalpindi">Rawalpindi</option>
                    <option style={{ color: 'black' }} value="Peshawar">Peshawar</option>
                    <option style={{ color: 'black' }} value="Faisalabad">Faisalabad</option>
                    <option style={{ color: 'black' }} value="Gujranwala">Gujranwala</option>
                    <option style={{ color: 'black' }} value="Sialkot">Sialkot</option>
                    <option style={{ color: 'black' }} value="Sargodah">Sargodah</option>
                    <option style={{ color: 'black' }} value="Multan">Multan</option>
                </select> */}
                    <button onClick={() => { setJourneyPlanWizardShown(true); setJpState('adding'); clearAllStates2() }} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px', color: 'white', border: '2px solid white', height: '100%', background: 'transparent' }}>
                        Enter a Journey Plan
                    </button>
                    <span style={{ marginLeft: '10px', marginRight: '10px', color: 'white' }}>Select Journey Plan</span>

                    <select defaultValue={'Choose Journey Plan'} onChange={(e) => journeySelected(e)} style={{ background: 'transparent', color: 'white', border: '2px solid white', height: '100%' }}>
                        <option value={'Choose Journey Plan'} disabled>Choose Journey Plan</option>
                        {journeyPlans.map((item, index) => {
                            return (
                                <option style={{ color: 'black' }} value={index}>{item.name}</option>
                            )
                        })}
                    </select>

                    <button onClick={() => { clearAllStates2(); setJourneyPlanWizardShown(false) }} style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px', color: 'white', border: '2px solid white', height: '100%', background: 'transparent', float: 'right' }}>
                        Clear
                    </button>
                </div>
            </div>
        </>
    )
}

export default JourneyPlan