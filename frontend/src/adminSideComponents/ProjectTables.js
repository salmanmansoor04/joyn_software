import { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../styles/ProjectTables.css'

import Spinner from '../components/Spinner'


function ProjectTables(props) {

    const [isLoading, setIsLoading] = useState(true)
    const [isLoading2, setIsLoading2] = useState(false)

    const [tables, setTables] = useState([])
    const [fields, setFields] = useState([])
    const [options, setOptions] = useState([])
    const [selectedTable, setSelectedTable] = useState('')
    const [d_id, setD_id] = useState('')
    const [field_name, setField_name] = useState('')
    const [field_type, setField_type] = useState('')
    const [table_name, setTable_name] = useState('')
    const [showAddFieldWizard, setShowAddFieldWizard] = useState(false)
    const [showAddTableWizard, setShowAddTableWizard] = useState(false)

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

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTables', { cust_id: localStorage.getItem('cust_id') }, config)
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
                console.log('response', res.data)
                setTables([...res.data.forms])
                setIsLoading(false)


            }).catch(err => { alert('Ambigious response from server') })
    }

    const tableSelected = (e) => {
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/init', { form_id: e.target.value, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('response on table select', res.data)
                setFields([...res.data.fields])
                setOptions([...res.data.options])
                setSelectedTable(e.target.value)
                setIsLoading2(false)

            }).catch(err => { alert('Ambigious response from server') })
    }

    const addField = () => {
        setIsLoading2(true)
        setShowAddFieldWizard(false)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addField', { form_id: selectedTable, field_name: field_name, field_type: field_type, d_id: d_id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('field addition ', res.data)
                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/init', { form_id: selectedTable, cust_id: localStorage.getItem('cust_id') })
                    .then(res => {

                        console.log('response on table select', res.data)
                        setFields([...res.data.fields])
                        setOptions([...res.data.options])
                        setIsLoading2(false)

                    }).catch(err => { alert('Ambigious response from server') })

            }).catch(err => { alert('Ambigious response from server') })
    }

    const deleteClicked = (id, name, type) => {
        if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '2' }) === false){
            alert('Access Denied, no unauthorized access')
            return
        }
        setIsLoading2(true)

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/deleteField', { form_id: selectedTable, name: name, type: type, id: id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('field addition ', res.data)
                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/init', { form_id: selectedTable, cust_id: localStorage.getItem('cust_id') })
                    .then(res => {

                        console.log('response on table select', res.data)
                        setFields([...res.data.fields])
                        setOptions([...res.data.options])
                        setIsLoading2(false)

                    }).catch(err => { alert('Ambigious response from server') })

            }).catch(err => { alert('Ambigious response from server') })
    }

    const addTable = () => {
        console.log(table_name);
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addTable', { name: table_name, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                setShowAddTableWizard(false)
                init();

            }).catch(err => { alert('Ambigious response from server') })
    }

    return (
        <>
            <div className="ProjectTables_wrapper">
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
                {fields.length === 0 &&
                    <div className="ProjectTables_alertBox">
                        Please Select a Table
                    </div>
                }

                <div style={{ height: '100%', width: '25%', boxSizing: 'border-box', paddingLeft: '30px', paddingRight: '30px' }}>
                    {fields.some((val) => { return val.field_type === 'text' }) &&
                        <>

                            <div style={{ color: '#00799e', background: '#bbe6f3', borderRadius: '10px', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px' }}>
                                <h6 style={{ textAlign: 'center', marginTop: '0' }}>Text Fields</h6>
                                {fields.map((val, index) => {
                                    return (
                                        <div key={index}>
                                            {val.field_type === 'text' &&
                                                <div>{val.field_name} <span style={{ fontSize: '11px', cursor: 'pointer' }} onClick={() => deleteClicked(val.id, val.field_name, val.field_type)}><i className="fa fa-trash"></i></span></div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                </div>
                <div style={{ height: '100%', width: '25%', boxSizing: 'border-box', paddingLeft: '30px', paddingRight: '30px' }}>
                    {fields.some((val) => { return val.field_type === 'dropdown' }) &&
                        <>

                            <div style={{ color: '#00799e', background: '#bbe6f3', borderRadius: '10px', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px' }}>
                                <h6 style={{ textAlign: 'center', marginTop: '0' }}>Dropdown Fields </h6>
                                {fields.map((val, index) => {
                                    return (
                                        <div key={index}>
                                            {val.field_type === 'dropdown' &&
                                                <div>
                                                    {val.field_name}
                                                    <span style={{ letterSpacing: '10px', marginLeft: '10px', fontSize: '15px' }}>
                                                        <span style={{ fontSize: '11px', cursor: 'pointer' }} onClick={() => { 
                                                            if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '2' }) === false){
                                                                alert('Access Denied, no unauthorized access')
                                                                return
                                                            }
                                                            setShowAddFieldWizard(true); 
                                                            setField_type('option'); 
                                                            setD_id(val.id) 
                                                        }}>
                                                            <i className="fa fa-plus"></i>
                                                        </span>
                                                        <span style={{ fontSize: '11px', cursor: 'pointer' }} onClick={() => deleteClicked(val.id, val.field_name, val.field_type)}><i className="fa fa-trash"></i></span>
                                                    </span>
                                                    <div style={{ marginLeft: '20px', background: '#e0f4fa', marginRight: '20px', borderRadius: '10px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '10px' }}>
                                                        {options.map((val1, index1) => {
                                                            return (
                                                                <div key={index1}>
                                                                    {val1.destination_id === val.id &&
                                                                        <div>{val1.field_name} <span style={{ fontSize: '11px', cursor: 'pointer' }} onClick={() => deleteClicked(val1.id, val1.field_name, val1.field_type)}><i className="fa fa-trash"></i></span></div>
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
                        </>
                    }
                </div>
                <div style={{ height: '100%', width: '25%', boxSizing: 'border-box', paddingLeft: '30px', paddingRight: '30px' }}>
                    {fields.some((val) => { return val.field_type === 'date' }) &&
                        <>
                            <div style={{ color: '#00799e', background: '#bbe6f3', borderRadius: '10px', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px' }}>
                                <h6 style={{ textAlign: 'center', marginTop: '0' }}>Date Fields</h6>
                                {fields.map((val, index) => {
                                    return (
                                        <div key={index}>
                                            {val.field_type === 'date' &&
                                                <div>{val.field_name} <span style={{ fontSize: '11px', cursor: 'pointer' }} onClick={() => deleteClicked(val.id, val.field_name, val.field_type)}><i className="fa fa-trash"></i></span></div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                </div>
                <div style={{ height: '100%', width: '25%', boxSizing: 'border-box', paddingLeft: '30px', paddingRight: '30px' }}>
                    {fields.some((val) => { return val.field_type === 'range' }) &&
                        <>
                            <div style={{ color: '#00799e', background: '#bbe6f3', borderRadius: '10px', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px' }}>
                                <h6 style={{ textAlign: 'center', marginTop: '0' }}>Range Fields</h6>
                                {fields.map((val, index) => {
                                    return (
                                        <div key={index}>
                                            {val.field_type === 'range' &&
                                                <div>{val.field_name} <span style={{ fontSize: '11px', cursor: 'pointer' }} onClick={() => deleteClicked(val.id, val.field_name, val.field_type)}><i className="fa fa-trash"></i></span></div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                </div>

                {showAddFieldWizard &&
                    <div className="ProjectTables_addFieldWizard">
                        <div onClick={() => { setShowAddFieldWizard(false) }} style={{ textAlign: 'right', fontWeight: 'bold', height: '20px', cursor: 'pointer' }}>x</div>
                        <div style={{ fontWeight: 'bold', height: '20px', textAlign: 'center', marginBottom: '10px' }}>Add {field_type} Field</div>
                        <div style={{ fontWeight: 'bold', height: 'calc(100% - 80px)', textAlign: 'center' }}>
                            <input type="text" onChange={(e) => setField_name(e.target.value)} />
                        </div>
                        <div style={{ fontWeight: 'bold', height: '30px', textAlign: 'center' }}>
                            <button onClick={() => addField()}>Add</button>
                        </div>
                    </div>
                }

                {showAddTableWizard &&
                    <div className="ProjectTables_addFieldWizard">
                        <div onClick={() => { setShowAddTableWizard(false) }} style={{ textAlign: 'right', fontWeight: 'bold', height: '20px', cursor: 'pointer' }}>x</div>
                        <div style={{ fontWeight: 'bold', height: '20px', textAlign: 'center', marginBottom: '10px' }}>Add Table</div>
                        <div style={{ fontWeight: 'bold', height: 'calc(100% - 80px)', textAlign: 'center' }}>
                            <input type="text" onChange={(e) => setTable_name(e.target.value)} />
                        </div>
                        <div style={{ fontWeight: 'bold', height: '30px', textAlign: 'center' }}>
                            <button onClick={() => addTable()}>Add</button>
                        </div>
                    </div>
                }

            </div>



            <div className="ProjectTables_bottombar">
                <span style={{ color: 'white', marginRight: '20px' }}>Select Table</span>
                <select onChange={(e) => tableSelected(e)} style={{ background: '#e0f4fa', color: '#04b2d9', cursor: 'pointer', fontWeight: 'bold', height: '90%', border: 'none' }}>
                    <option defaultValue={""} selected disabled></option>
                    {tables.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>{item.name}</option>
                        )
                    })}
                </select>

                <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer', marginLeft: '20px', marginRight: '20px' }} onClick={() => setShowAddTableWizard(true)}>Add New Table</button>

                {selectedTable !== '' && JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '2' }) &&
                    <span style={{ marginLeft: '20px', marginRight: '20px' }}>

                        <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowAddFieldWizard(true); setField_type('text') }}>Text Field</button>

                        <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowAddFieldWizard(true); setField_type('range') }}>Range Field</button>

                        <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowAddFieldWizard(true); setField_type('date') }}>Date Field</button>

                        <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowAddFieldWizard(true); setField_type('dropdown') }}>Dropdown Field</button>

                    </span>
                }

            </div>
        </>
    )
}

export default ProjectTables