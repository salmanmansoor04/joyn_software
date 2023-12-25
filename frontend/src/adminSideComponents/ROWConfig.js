import { useState, useEffect } from "react";
import React from 'react'
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';

import '../styles/ROWConfig.css'

import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'

function ROWConfig(props) {

    const [view, setView] = useState('tabular')
    const [isLoading, setIsLoading] = useState(true)
    const [isLoading2, setIsLoading2] = useState(false)

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [tracks, setTracks] = useState([])
    const [row_detail, setRow_detail] = useState({
        Status: '',
        Authority: '',
        Applied_Date: '',
        Approval_Date: '',
        cost_km: ''
    })
    const [trackId, setTrackId] = useState('')

    const [showRowDetailWizard, setShowRowDetailWizard] = useState(false)

    const [actionStatus, setActionStatus] = useState('add')

    const [row_detail_id, setRow_detail_id] = useState('')

    const [recenter, setRecenter] = useState({ 'lat': 33, 'lng': 74 })

    const [InfoPosition, setInfoPosition] = useState({ 'lat': 0, 'lng': 0 })

    const [Info, setInfo] = useState({
        trackName: '',
        row_Status: '',
        trackId: '',
        row_detail: ''
    })

    let RowColors = {
        'Available': '#3BC10D',
        'Not Available': '#FD0F0F',
        'In Progress': '#F3FF00',
        'under litigation': '#FFAE00'
    }

    const navigate = useNavigate();

    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        props.updatePathname(window.location.href)
        var auth = await props.authChecker(localStorage.getItem("access_token_expiry"), localStorage.getItem("refresh_token_expiry"));
        console.log(auth)
        if (auth === 'login') {
            alert('Session has expired you need to login again')
            localStorage.removeItem("access_token_expiry");
            localStorage.removeItem("refresh_token_expiry");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("id");
            navigate("/");
            return
        }


        let config = {
            headers: {
                'X-Access-Token': localStorage.getItem("access_token"),
                'X-Refresh-Token': localStorage.getItem("refresh_token"),
                'X-User-ID': localStorage.getItem("id"),
            }
        }

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/rowInit', {}, config)
            .then(res => {
                if (res.data === 'login') {
                    //alert('No Unauthorized Access');
                    localStorage.removeItem("access_token_expiry");
                    localStorage.removeItem("refresh_token_expiry");
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("id");
                    navigate("/");
                    return
                }
                console.log(res.data)
                setCities(res.data)
                setIsLoading(false)
            }).catch(err => { alert('Ambigious response from server') })
    }

    const citySelected = (e) => {
        setSelectedCity(e.target.value)
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTracks', { city: e.target.value })
            .then(res => {
                console.log(res.data)
                let temp = [];
                res.data.forEach((val) => {

                    let temporary = {};
                    temporary['name'] = JSON.parse(val.data).name
                    temporary['id'] = val.id
                    temporary['row_status'] = val.row_status
                    temporary['row_detail'] = val.row_detail
                    temporary['data'] = JSON.parse(val.data)

                    temp.push(temporary)

                });

                setRecenter(temp[0].data.track[0].data[0])
                setTracks([...temp])
                setIsLoading2(false)
            }).catch(err => { alert('Ambigious response from server') })
    }

    useEffect(() => {
        console.log(tracks)
    }, [tracks]);

    const enterData = (e, insertId) => {
        console.log(insertId, e.target.value)
        let temp = row_detail;
        temp[insertId] = e.target.value
        setRow_detail(temp)
    }

    const addROW = () => {
        console.log('detail', row_detail)
        console.log('trackId', trackId)
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addRowStatus', { trackid: trackId, data: row_detail })
            .then(res => {
                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTracks', { city: selectedCity })
                    .then(res => {
                        let temp = [];
                        res.data.forEach((val) => {

                            let temporary = {};
                            temporary['name'] = JSON.parse(val.data).name
                            temporary['id'] = val.id
                            temporary['row_status'] = val.row_status
                            temporary['row_detail'] = val.row_detail
                            temporary['data'] = JSON.parse(val.data)

                            temp.push(temporary);

                        });

                        setShowRowDetailWizard(false)
                        setRow_detail({
                            Status: '',
                            Authority: '',
                            Applied_Date: '',
                            Approval_Date: '',
                            cost_km: ''
                        })
                        setTracks([...temp])
                        setIsLoading2(false)
                        setInfoPosition({ lat: 0, lng: 0 })
                    }).catch(err => { alert('Ambigious response from server') })
            }).catch(err => { alert('Ambigious response from server') })
    }

    const updateClicked = (row_detail, trackId) => {
        setRow_detail_id(row_detail)
        setTrackId(trackId)
        setActionStatus('update')
        setIsLoading2(true)
        console.log(row_detail)

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getRowDetail', { detail_id: row_detail })
            .then(res => {
                let data = res.data[0]
                console.log(res.data)
                let temp = {
                    Status: data.Status,
                    Authority: data.Authority,
                    Applied_Date: data.Applied_Date,
                    Approval_Date: data.Approval_Date,
                    cost_km: data['cost/km']
                }
                setShowRowDetailWizard(true)
                setRow_detail(temp)
                setIsLoading2(false)
            }).catch(err => { alert('Ambigious response from server'); console.log(err) })
    }

    const updateROW = () => {
        console.log(row_detail_id)
        console.log(row_detail)

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/updateRowStatus', { data: row_detail, row_detail_id: row_detail_id, trackid: trackId })
            .then(res => {

                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTracks', { city: selectedCity })
                    .then(res => {
                        let temp = [];
                        res.data.forEach((val) => {

                            let temporary = {};
                            temporary['name'] = JSON.parse(val.data).name
                            temporary['id'] = val.id
                            temporary['row_status'] = val.row_status
                            temporary['row_detail'] = val.row_detail
                            temporary['data'] = JSON.parse(val.data)

                            temp.push(temporary);

                        });

                        setShowRowDetailWizard(false)
                        setRow_detail({
                            Status: '',
                            Authority: '',
                            Applied_Date: '',
                            Approval_Date: '',
                            cost_km: ''
                        })
                        setTracks([...temp])
                        setIsLoading2(false)
                        setInfoPosition({ lat: 0, lng: 0 })
                    }).catch(err => { alert('Ambigious response from server') })

            }).catch(err => { alert('Ambigious response from server'); console.log(err) })
    }

    const closeRowWizard = () => {

        setShowRowDetailWizard(false)
        setRow_detail({
            Status: '',
            Authority: '',
            Applied_Date: '',
            Approval_Date: '',
            cost_km: ''
        })
    }

    const pathHovered = (e, name, row, id, row_detail) => {
        let temp = {
            trackName: name,
            row_Status: row,
            trackId: id,
            row_detail: row_detail
        }
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setInfoPosition({ ...position })
        setInfo({ ...temp })

        // console.log(temp);
        // console.log(position)
    }

    return (
        <>
            <div className="ROWConfig_wrapper">
                {isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                        <Spinner />
                    </div>
                }
                {isLoading2 &&
                    <div style={{ height: '100%', width: '100%', background: 'transparent', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                        <Spinner />
                    </div>
                }
                <div style={{ position: 'relative', height: '30px', width: '100%',background: '#e0f4fa', color: '#04b2d9', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontWeight: 'bold' }}>
                    <div onClick={() => {setView('tabular')}} style={{cursor: 'pointer', height: '100%', width: '50%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Tabular View</div>
                    <div onClick={() => {setView('map')}}  style={{cursor: 'pointer', height: '100%', width: '50%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Map View</div>
                    <div className={`${view === 'map' ? "segmentControlBarRight" : "segmentControlBarLeft"}`}></div>
                </div>
                {view === 'map' &&
                    <div className="ROWConfig_mapView">
                        {/* <LoadScript
                            googleMapsApiKey="AIzaSyD6l5bH_gXHS6Qjxk4MdS_bDaqicwzI_uE"
                        > */}
                            <GoogleMap
                                mapContainerStyle={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                center={recenter}
                                zoom={13}
                                labels={true}
                            >
                                {InfoPosition.lat != 0 && InfoPosition.lng != 0 &&
                                    <InfoWindow
                                        onCloseClick={() => setInfoPosition({ lat: 0, lng: 0 })}
                                        position={InfoPosition}
                                    >
                                        <div>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><span style={{ fontWeight: 'bold' }}>Name</span></td>
                                                        <td>{Info.trackName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span style={{ fontWeight: 'bold' }}>Row Status</span></td>
                                                        <td>{Info.row_Status}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div>
                                                {Info.row_Status === 'Not Available' &&
                                                    <button onClick={() => { setShowRowDetailWizard(true); setTrackId(Info.trackId); setActionStatus('add') }}>Add ROW</button>
                                                }
                                                {Info.row_Status !== 'Not Available' &&
                                                    <button onClick={() => updateClicked(Info.row_detail, Info.trackId)}>Update ROW</button>
                                                }
                                            </div>
                                        </div>

                                    </InfoWindow>
                                }
                                {tracks.map((val, ind) => {
                                    return (
                                        <>
                                            {val.data.track.map((val1, ind1) => {
                                                return (
                                                    <Polyline
                                                        onClick={(e) => pathHovered(e, val.name, val.row_status, val.id, val.row_detail)}
                                                        // onMouseOut={() => setInfoPosition({ lat: 0, lng: 0 })}
                                                        //onClick={(e) => this.check(e)}
                                                        title={val.row_status}
                                                        path={val1.data}
                                                        options={{
                                                            strokeColor: RowColors[val.row_status],
                                                            strokeOpacity: 0.8,
                                                            strokeWeight: 6,
                                                            fillOpacity: 0.35,
                                                            clickable: true,
                                                            draggable: false,
                                                            editable: false,
                                                            visible: true,
                                                            radius: 30000,
                                                            zIndex: 1
                                                        }}
                                                    />
                                                )
                                            })}
                                        </>
                                    )
                                })}
                            </GoogleMap>
                        {/* </LoadScript> */}

                    </div>
                }
                {view === 'tabular' &&
                    <div className="fixTableHead" style={{ height: 'calc(100% - 30px)' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ROW Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>
                                {tracks.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.row_status}</td>
                                            <td>
                                                {item.row_status === 'Not Available' &&
                                                    <button onClick={() => { setShowRowDetailWizard(true); setTrackId(item.id); setActionStatus('add') }}>Add ROW</button>
                                                }
                                                {item.row_status !== 'Not Available' &&
                                                    <button onClick={() => updateClicked(item.row_detail, item.id)}>Update ROW</button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                    </div>
                }
                {showRowDetailWizard &&
                    <div className="ROWConfig_addDetailWizard">
                        <div style={{ color: 'white', height: '30px', fontWeight: 'bold', textAlign: 'right', cursor: 'pointer' }} onClick={() => closeRowWizard()}>x</div>
                        <div style={{ height: 'calc(100% - 60px)', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'flex-start', overflow: 'auto' }}>
                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Status</div>
                                <select defaultValue={row_detail.Status} onChange={(e) => enterData(e, 'Status')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }}>
                                    <option value={row_detail.Status} disabled>{row_detail.Status}</option>
                                    <option value='Available'>Available</option>
                                    <option value='under litigation'>under litigation</option>
                                    <option value='In Progress'>In Progress</option>
                                </select>
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Authority</div>
                                <input defaultValue={row_detail.Authority} type="text" onChange={(e) => enterData(e, 'Authority')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Applied Date</div>
                                <input defaultValue={row_detail.Applied_Date} type="date" onChange={(e) => enterData(e, 'Applied_Date')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Approval Date</div>
                                <input defaultValue={row_detail.Approval_Date} type="date" onChange={(e) => enterData(e, 'Approval_Date')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>cost/km</div>
                                <input defaultValue={row_detail.cost_km} type="text" onChange={(e) => enterData(e, 'cost_km')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {actionStatus === 'add' &&
                                <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => addROW()}>Add</button>
                            }
                            {actionStatus === 'update' &&
                                <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => updateROW()}>Update</button>
                            }
                        </div>
                    </div>
                }
            </div>
            <div className="ROWConfig_bottomBar">
                <span style={{ color: 'white', marginRight: '20px' }}>Select City</span>
                <select onChange={(e) => citySelected(e)} style={{ background: '#e0f4fa', color: '#04b2d9', cursor: 'pointer', fontWeight: 'bold', height: '90%', border: 'none' }}>
                    <option defaultValue={""} selected disabled></option>
                    {cities.map((item, index) => {
                        return (
                            <option key={index} value={item.city}>{item.city}</option>
                        )
                    })}
                </select>
            </div>
        </>
    )
}

export default ROWConfig