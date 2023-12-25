import { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../styles/ProjectEntry.css'

function ProjectEntry(props) {

    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState([])
    const [persistentRows, setPersistentRows] = useState([])
    const [filterData, setFilterData] = useState({})
    const [filterApplied, setFilterApplied] = useState({})
    const [showFilterIcon, setShowFilterIcon] = useState('')
    const [openFilter, setOpenFilter] = useState('')
    const [dataToInsert, setDataToInsert] = useState({})
    const [fields, setFields] = useState([])
    const [options, setOptions] = useState([])
    const [showEntryForm, setShowEntryForm] = useState(false)
    const [entryStatus, setEntryStatus] = useState('entry')

    const [idToUpdate, setIdToUpdate] = useState('')

    const [tables, setTables] = useState([])
    const [form_id, setForm_id] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        let temp = {};
        fields.forEach((val) => {
            temp[val.field_name] = ''
        })
        setDataToInsert({ ...temp })
    }, [fields])

    useEffect(() => {
        filter();
    }, [filterApplied])

    useEffect(() => {
        setFilterApplied({ ...filterData })
    }, [filterData])

    useEffect(() => {

        if (persistentRows.length !== 0 && columns.length !== 0) {
            console.log('setting filter')
            let temp = {};
            columns.forEach((val) => {
                temp[val] = []
                persistentRows.forEach((val2) => {
                    if (temp[val].includes(val2[val]) === false) {
                        temp[val].push(val2[val])
                    }
                })
            })
            setFilterData({ ...temp })
        }

    }, [columns, persistentRows])

    const filter = () => {
        let tempRows = rows
        tempRows = persistentRows.filter((val) => {

            let status = true;

            for (let x in val) {
                if (x != 'id' && x != 'chronology' && x != 'prev_id' && x != 'dateEntered') {
                    status = status && filterApplied[x].includes(val[x])
                }
            }

            return status

        })

        console.log('rows', tempRows);

        setRows([...tempRows])
    }

    const addToFilter = (filterItemToEnter, filterObjectKey) => {
        console.log(filterItemToEnter)
        console.log(filterData[filterObjectKey])
        let tempFilterApplied = filterApplied
        if (tempFilterApplied[filterObjectKey].includes(filterItemToEnter)) {
            tempFilterApplied[filterObjectKey] = tempFilterApplied[filterObjectKey].filter((val) => {
                return val !== filterItemToEnter
            })
        } else {
            tempFilterApplied[filterObjectKey].push(filterItemToEnter)
        }

        setFilterApplied({ ...tempFilterApplied })
    }

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

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTables', {cust_id: localStorage.getItem('cust_id')}, config)
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
                setTables(res.data.forms)


            }).catch(err => { alert('Ambigious response from server') })
    }

    const getData = (e) => {

        let form_id = e.target.value

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getFieldsAndTable', { form_id: form_id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('response coming', res.data)
                setColumns([...res.data.columnNames])
                setRows([...res.data.data])
                setPersistentRows([...res.data.data])
                setFields([...res.data.fields])
                setOptions([...res.data.options])
                setForm_id(form_id)


            }).catch(err => { alert('Ambigious response from server') })
    }

    const enterData = (e, field_name) => {
        let temp = dataToInsert;
        temp[field_name] = e.target.value
        setDataToInsert({ ...temp })
    }

    const addEntry = () => {
        console.log(dataToInsert)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/formInsert', { data: dataToInsert, form_id: form_id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('response coming after insert', res.data)
                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getFieldsAndTable', { form_id: form_id, cust_id: localStorage.getItem('cust_id') })
                    .then(res => {

                        console.log('response coming', res.data)
                        setColumns([...res.data.columnNames])
                        setRows([...res.data.data])
                        setPersistentRows([...res.data.data])
                        setFields([...res.data.fields])
                        setOptions([...res.data.options])
                        setForm_id(form_id)
                        setShowEntryForm(false)


                    }).catch(err => { alert('Ambigious response from server') })


            }).catch(err => { alert('Ambigious response from server') })
    }

    const updateEntry = () => {
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/formUpdate', { data: dataToInsert, id: idToUpdate, form_id: form_id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('response coming after insert', res.data)
                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getFieldsAndTable', { form_id: form_id, cust_id: localStorage.getItem('cust_id') })
                    .then(res => {

                        console.log('response coming', res.data)
                        setColumns([...res.data.columnNames])
                        setRows([...res.data.data])
                        setPersistentRows([...res.data.data])
                        setFields([...res.data.fields])
                        setOptions([...res.data.options])
                        setForm_id(form_id)


                    }).catch(err => { alert('Ambigious response from server') })


            }).catch(err => { alert('Ambigious response from server') })
    }

    const closeForm = () => {
        let temp = {};
        fields.forEach((val) => {
            temp[val.field_name] = ''
        })
        setDataToInsert({ ...temp })
        setShowEntryForm(false)
    }

    const updateClicked = (item, id) => {
        setEntryStatus('update')
        setShowEntryForm(true)
        setIdToUpdate(id)
        let temp = {}
        for (let x in item) {
            if (x !== 'id') {
                temp[x] = item[x]
            }
        }
        setDataToInsert({ ...temp })
    }

    const deleteClicked = (id) => {
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/deleteEntry', { id: id, form_id: form_id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('response coming after insert', res.data)
                Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getFieldsAndTable', { form_id: form_id, cust_id: localStorage.getItem('cust_id') })
                    .then(res => {

                        console.log('response coming', res.data)
                        setColumns([...res.data.columnNames])
                        setRows([...res.data.data])
                        setPersistentRows([...res.data.data])
                        setFields([...res.data.fields])
                        setOptions([...res.data.options])
                        setForm_id(form_id)


                    }).catch(err => { alert('Ambigious response from server') })


            }).catch(err => { alert('Ambigious response from server') })
    }

    useEffect(() => {
        console.log(dataToInsert)
    }, [dataToInsert])

    return (
        <>
            <div className="ProjectEntryWrapper">
                {form_id === '' &&
                    <div className="ProjectTables_alertBox">
                        Please Select a Table
                    </div>
                }
                {form_id !== '' &&
                    <div className="fixTableHead" style={{ height: '100%' }}>
                        <table>
                            <thead>
                                <tr>
                                    {columns.map((item, index) => {

                                        return (
                                            <>
                                                {item !== 'id' &&
                                                    <th key={index} onMouseLeave={() => { setShowFilterIcon('') }} onMouseOver={() => { setShowFilterIcon(item) }} >
                                                        <div className={`${showFilterIcon === item ? "shorten" : ""}`}> {item} </div>
                                                        {showFilterIcon === item &&
                                                            <i className='fa fa-ellipsis-v filterIcon' onClick={() => { if (openFilter === item) { setOpenFilter('') } else { setOpenFilter(item) } }} title="Open Filter Window" style={{ cursor: 'pointer' }}></i>
                                                        }
                                                        {openFilter === item &&
                                                            <div className='filterBox'>
                                                                {filterData[item].map((item1, index1) => {
                                                                    return (
                                                                        <div key={index1}>
                                                                            <input onChange={() => addToFilter(item1, item)} type="checkbox" checked={filterApplied[item].includes(item1)} /> {item1}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        }
                                                    </th>
                                                }
                                            </>
                                        )
                                    })}
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>
                                {rows.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            {columns.map((item1, index1) => {
                                                return (
                                                    <>
                                                        {item1 !== 'id' &&
                                                            <td key={index1}>{item[item1]}</td>
                                                        }
                                                    </>
                                                )
                                            })}
                                            <td>
                                                <span style={{ cursor: 'pointer' }} title="Update" onClick={() => updateClicked(item, item.id)}>
                                                    <i className="fa fa-cog"></i>
                                                </span>
                                                <span style={{ cursor: 'pointer', marginLeft: '10px' }} title="Delete" onClick={() => deleteClicked(item.id)}>
                                                    <i className="fa fa-trash"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                    </div>
                }


                {showEntryForm &&
                    <div className="ProjectEntryForm">
                        <div style={{ color: 'white', height: '30px', fontWeight: 'bold', textAlign: 'right', cursor: 'pointer' }} onClick={() => closeForm()}>x</div>
                        <div style={{ height: 'calc(100% - 60px)', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'flex-start', overflow: 'auto' }}>
                            {fields.map((val, index) => {
                                return (
                                    <>
                                        {val.field_type === 'text' &&
                                            <div key={index} style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{val.field_name}</div>
                                                <input value={dataToInsert[val.field_name]} type="text" onChange={(e) => enterData(e, val.field_name)} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                                            </div>
                                        }
                                        {val.field_type === 'date' &&
                                            <div key={index} style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{val.field_name}</div>
                                                <input value={dataToInsert[val.field_name]} type="date" onChange={(e) => enterData(e, val.field_name)} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                                            </div>
                                        }
                                        {val.field_type === 'range' &&
                                            <div key={index} style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{val.field_name}</div>
                                                <input value={dataToInsert[val.field_name]} type="number" onChange={(e) => enterData(e, val.field_name)} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }} />
                                            </div>
                                        }
                                        {val.field_type === 'dropdown' &&
                                            <div key={index} style={{ width: '30%', border: '1px solid white', height: '40px', marginBottom: '10px' }}>
                                                <div style={{ height: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{val.field_name}</div>
                                                <select value={dataToInsert[val.field_name]} onChange={(e) => enterData(e, val.field_name)} style={{ height: 'calc(100% - 15px)', width: '100%', boxSizing: 'border-box', display: 'block' }}>
                                                    {options.map((val1, index1) => {
                                                        return (
                                                            <>
                                                                {val1.destination_id === val.id &&
                                                                    <option key={index1} value={val1.field_name}>{val1.field_name}</option>
                                                                }
                                                            </>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        }
                                    </>
                                )
                            })}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {entryStatus === 'entry' &&
                                <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => addEntry()}>Add</button>
                            }
                            {entryStatus === 'update' &&
                                <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => updateEntry()}>Update</button>
                            }

                        </div>
                    </div>
                }
            </div>
            <div className="ProjectEntryBottomBar">
                <span style={{ color: 'white', marginRight: '20px' }}>Select Table</span>
                <select onChange={(e) => getData(e)} style={{ background: '#e0f4fa', color: '#04b2d9', cursor: 'pointer', fontWeight: 'bold', height: '90%', border: 'none', marginRight: '20px' }}>
                    <option defaultValue={""} selected disabled></option>
                    {tables.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>{item.name}</option>
                        )
                    })}
                </select>

                {form_id !== '' &&
                    <button style={{ height: '90%', width: '10%', background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', cursor: 'pointer' }}
                     onClick={
                        () => { 
                            if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '3' }) === false){
                                alert('Access Denied, no unauthorized access')
                                return
                            }
                            setShowEntryForm(true); 
                            setEntryStatus('entry') 
                        
                        }
                        }
                    >
                        New Entry
                    </button>
                }

            </div>
        </>
    )
}

export default ProjectEntry