import { useState, useEffect } from "react";

import '../styles/OtdrConfig.css'

import Axios from 'axios';

import Spinner from '../components/Spinner'

import { useNavigate } from "react-router-dom";



function OtdrConfig(props) {

    const [isLoading, setIsLoading] = useState(true)
    const [isLoading2, setIsLoading2] = useState(false)

    const [otdrResults, setOtdrResults] = useState([])
    const [showOtdrWindow, setShowOtdrWindow] = useState(false)
    const [dataToInsert, setDataToInsert] = useState({
        city: '',
        area: '',
        latA: '',
        lngA: '',
        latB: '',
        lngB: '',
        length: ''
    })
    const [file, setFile] = useState('')
    const [id, setId] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        console.log(otdrResults)
    }, [otdrResults]);

    useEffect(() => {
        init();
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

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/otdrInit', {}, config)
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

                setOtdrResults(res.data)
                setIsLoading(false)
                setIsLoading2(false)
            }).catch(err => { alert('Ambigious response from server') })

    }

    const deleteClicked = (id) => {

        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/otdrDeleteFile', { id: id })
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { alert('Ambigious response from server') })

    }

    const addOtdr = () => {

        setIsLoading2(true)
        console.log(dataToInsert)
        let dataToSend = {}

        dataToSend['city'] = dataToInsert['city'];
        dataToSend['area'] = dataToInsert['area'];
        dataToSend['length'] = dataToInsert['length'];
        dataToSend['locA'] = JSON.stringify({ lat: parseFloat(dataToInsert['latA']), lng: parseFloat(dataToInsert['lngA']) });
        dataToSend['locB'] = JSON.stringify({ lat: parseFloat(dataToInsert['latB']), lng: parseFloat(dataToInsert['lngB']) });

        //console.log(dataToSend)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addOtdr', dataToSend)
            .then(res => {
                console.log(res.data)
                setShowOtdrWindow(false)
                init();
            }).catch(err => { alert('Ambigious response from server') })


    }

    const closeOtdrWizard = () => {

        setShowOtdrWindow(false)
        setDataToInsert({
            city: '',
            area: '',
            latA: '',
            lngA: '',
            latB: '',
            lngB: '',
            length: ''
        })
    }

    const enterData = (e, insertKey) => {

        console.log(e.target.value, insertKey)
        let temp = dataToInsert;

        temp[insertKey] = e.target.value

        setDataToInsert({ ...temp })
    }

    const changeHandler = (event, id) => {
        setFile(event.target.files[0])
        setId(id)

    };

    useEffect(() => {
        console.log(file)
        console.log(id)
        setIsLoading2(true)
        var bodyFormData = new FormData();

        bodyFormData.append('file', file);
        bodyFormData.append('id', id)

        Axios({
            method: "post",
            url: process.env.REACT_APP_BACKEND_BASE_URL + 'api/otdrUploadFile',
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                console.log(response.data);
                init()
            })
            .catch(function (error) {
                //handle error
                console.log(error);
            });
    }, [file, id]);

    const deleteEntry = (id) => {
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/otdrDeleteEntry', { id: id })
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { alert('Ambigious response from server') })

    }

    return (
        <>
            <div className="OtdrConfig_Wrapper">
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
                <div className="fixTableHead" style={{ height: '100%' }}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>City</th>
                                <th>Area</th>
                                <th>Length (kM)</th>
                                <th>End A</th>
                                <th>End B</th>
                                <th>File</th>

                            </tr>

                        </thead>

                        <tbody>
                            {otdrResults.map((item, index) => {
                                return (
                                    <tr>
                                        <td><i onClick={() => deleteEntry(item.id)} className="fa fa-trash" title="delete"></i></td>
                                        <td>{item.city}</td>
                                        <td>{item.area}</td>
                                        <td>{item.length}</td>
                                        <td>{item.locA}</td>
                                        <td>{item.locB}</td>
                                        <td>
                                            {item.pdf_file !== null &&
                                                <>
                                                    <a href={`https://www.joynsoftware.com/backend/public/otdrResults/${item.pdf_file}`} target='__blank'>View</a>
                                                    |
                                                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => deleteClicked(item.id)}>Delete</span>
                                                </>
                                            }
                                            {item.pdf_file === null &&
                                                <>
                                                    {/* <input type="file" name="file" onChange={(e) => changeHandler(e)} /> */}
                                                    <label style={{ color: 'blue' }} for="fileInput">Select file</label>
                                                    <input type="file" id="fileInput" name="file" style={{ display: 'none' }} onChange={(e) => changeHandler(e, item.id)} />
                                                </>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>

                {showOtdrWindow &&
                    <div className="OtdrConfig_addOtdrWizard">
                        <div style={{ color: 'white', height: '30px', fontWeight: 'bold', textAlign: 'right', cursor: 'pointer' }} onClick={() => closeOtdrWizard()}>x</div>
                        <div style={{ height: 'calc(100% - 60px)', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'flex-start', overflow: 'auto' }}>
                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>City</div>
                                <input type="text" onChange={(e) => enterData(e, 'city')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Area</div>
                                <input type="text" onChange={(e) => enterData(e, 'area')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>End A (Lat)</div>
                                <input type="text" onChange={(e) => enterData(e, 'latA')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>End A (Lng)</div>
                                <input type="number" onChange={(e) => enterData(e, 'lngA')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>End B (Lat)</div>
                                <input type="number" onChange={(e) => enterData(e, 'latB')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>End B (Lng)</div>
                                <input type="number" onChange={(e) => enterData(e, 'lngB')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                            <div style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Length</div>
                                <input type="number" onChange={(e) => enterData(e, 'length')} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                            </div>

                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => addOtdr()}>Add</button>
                        </div>
                    </div>
                }
            </div>

            <div className="OtdrConfig_BottomBar">
                <button style={{ height: '90%', width: '20%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowOtdrWindow(true) }}>Add Otdr Result</button>
            </div>
        </>

    )
}

export default OtdrConfig