import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Polyline, Marker, Polygon, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import Axios from 'axios';

import Spinner from "./Spinner";

import '../styles/TaskCreation.css'

function TaskCreation(props) {

    const navigate = useNavigate();

    const [response, setResponse] = useState(null)

    const [destination, setDestination] = useState({lat: 33.506481948738525, lng: 73.11397394238158})
    const [origin, setOrigin] = useState({lat: 31.552628154855057, lng: 73.0614558656927})
    const [travelMode, setTravelMade] = useState('DRIVING')


    const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [snagTasks, setSnagTasks] = useState([]);
    const [customTasks, setCustomTasks] = useState([]);
    const [pjpTasks, setPjpTasks] = useState([]);
    const [tasksShow, setTasksShow] = useState([]);
    const [mapShow, setMapShow] = useState(false);
    const [mapAction, setMapAction] = useState(false);
    const [snagTasksShow, setSnagTasksShow] = useState([]);
    const [customTasksShow, setCustomTasksShow] = useState([]);
    const [pjpTasksShow, setPjpTasksShow] = useState([]);
    const [task, setTask] = useState({
        name: '',
        urgency: '',
        region: '',
        area: '',
        city: '',
        description: '',
        startDate: '',
        dueDate: '',
        Type: '',
        path: []
    })
    const [selectedPath, setSelectedPath] = useState([])
    const [taskType, setTaskType] = useState('')

    const [showTasksWizard, setShowTasksWizard] = useState(false);
    const [showMembersWizard, setShowMembersWizard] = useState(false);

    const [functions, setFunctions] = useState([])

    const [members, setMembers] = useState([])

    const [membersShow, setMembersShow] = useState([])

    const [selectedMembers, setSelectedMembers] = useState([])

    const [filter, setFilter] = useState([])

    const [isLoading, setIsLoading] = useState(true);

    const [memberFilter, setMemberFilter] = useState({
        region: 'All',
        city: 'All',
        function: 'All'
    })

    const [membersView, setMembersView] = useState([])

    const [membersViewShow, setMembersViewShow] = useState(false)

    const [snagsView, setSnagsView] = useState([])

    const [snagsViewShow, setSnagsViewShow] = useState(false)

    const [fetchingSnags, setFetchingSnags] = useState(false)

    const [selectedTask, setSelectedTask] = useState({})

    const [taskDetailWizardShown, setTaskDetailWizardShown] = useState(false)

    const [deleting, setDeleting] = useState(0);

    const [dateSort, setDateSort] = useState('')
    const [urgencySort, setUrgencySort] = useState('')

    const [addSnagTaskWindowShown, setSnagTaskWindowShown] = useState(false)

    const [center, setCenter] = useState({ lat: 33.50482154971537, lng: 73.06347117366387 });

    useEffect(async () => {
        init()
    }, []);

    useEffect(() => {
        console.log('inside use effect', tasks)
        setTask({
            name: '',
            urgency: '',
            region: '',
            area: '',
            city: '',
            description: '',
            startDate: '',
            dueDate: '',
            Type: '',
            path: []
        })
        setShowTasksWizard(false)
        setShowMembersWizard(false)
        showTasks()
    }, [tasks])

    useEffect(() => {
        console.log('inside use effect member filter', memberFilter)
        applyMemberFilter();
    }, [memberFilter])

    useEffect(() => {

        console.log('inside use effect members show', membersShow)

    }, [membersShow])

    useEffect(() => {

        console.log('inside use effect selected members and tasks', selectedMembers, tasks)

    }, [selectedMembers])

    const taskInput = (e, type) => {
        let tempObj = task
        if (type == 'name') {
            tempObj.name = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'urgency') {
            tempObj.urgency = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'region') {
            tempObj.region = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'city') {
            tempObj.city = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'area') {
            tempObj.area = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'startDate') {
            tempObj.startDate = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'dueDate') {
            tempObj.dueDate = e.target.value;
            setTask({ ...tempObj });
        }
        if (type == 'description') {
            tempObj.description = e.target.value;
            setTask({ ...tempObj });
        }
    }

    const addTask = () => {
        if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '8' }) === false){
            alert('Access Denied, no unauthorized access')
            return
        }
        let status = true
        for (let x in task) {
            if (x !== 'Type' && x !== 'path' && task[x] === '') {
                status = false
            }
        }
        if (status === false) {
            alert('All fields are necessary')
            return
        }
        if (taskType === 'PJP' && selectedPath.length === 0) {
            alert('Please enter the personal journey plan')
            return
        }
        let temp = task;
        temp.Type = taskType;
        temp.path = selectedPath
        console.log(temp)
        setIsLoading(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addTask', { task: temp, user_id: localStorage.getItem('id'), cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('task', res.data)
                init();

            }).catch(err => { alert('Ambigious response from server'); setIsLoading(false) })
    }

    const memberFilterHandleChange = (e, type) => {
        let tempMemberFilter = memberFilter
        if (type === 'city') {
            tempMemberFilter.city = e.target.value;
            setMemberFilter({ ...tempMemberFilter });
        }
        if (type === 'region') {
            tempMemberFilter.region = e.target.value;
            setMemberFilter({ ...tempMemberFilter });
        }
        if (type === 'function') {
            tempMemberFilter.function = e.target.value;
            setMemberFilter({ ...tempMemberFilter });
        }
    }

    const memberSelect = (val) => {

        let tempSelectedMembers = []

        if (tempSelectedMembers.some((value) => { return value.id === val.id }) === false) {
            tempSelectedMembers.push(val)
        } else {
            tempSelectedMembers = tempSelectedMembers.filter((val1) => {
                return val1.id !== val.id
            })
        }

        setSelectedMembers([...tempSelectedMembers])
    }

    const addMembersClicked = (index, type) => {
        //setShowMembersWizard(true);
        setSelectedTaskIndex(index);

        if (type === 'custom') {
            setSelectedMembers([...customTasks[index].members])
        }
        if (type === 'snag') {
            setSelectedMembers([...snagTasks[index].members])
        }
        if (type === 'pjp') {
            setSelectedMembers([...pjpTasks[index].members])
        }

    }

    const assignTask = () => {

        console.log('task', selectedTask)
        console.log('memebers', selectedMembers)
        if (selectedMembers.length === 0) {
            alert('Please Select a member')
            return
        }

        if (selectedTask.members.length > 0) {
            if (selectedMembers.some((value) => { return value.id == selectedTask.members[0].id })) {
                alert('task is already assigned to this member')
                return
            }
        }
        setIsLoading(true)

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/assignMembers', { task: selectedTask, members: selectedMembers })
            .then(res => {

                console.log(res.data)
                console.log(tasks)
                let temp = []
                setSelectedMembers([...temp])
                init()

            }).catch(err => { alert('Ambigious response from server'); setIsLoading(false) })

    }

    const applyMemberFilter = () => {

        let tempMembersShow = members;

        if (memberFilter.city === 'All' && memberFilter.region === 'All' && memberFilter.function === 'All') {
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city !== 'All' && memberFilter.region === 'All' && memberFilter.function === 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.city == memberFilter.city
            })
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city === 'All' && memberFilter.region !== 'All' && memberFilter.function === 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.region == memberFilter.region
            })
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city === 'All' && memberFilter.region === 'All' && memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == memberFilter.function
            })
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city !== 'All' && memberFilter.region !== 'All' && memberFilter.function === 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.city == memberFilter.city && val.region == memberFilter.region
            })
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city === 'All' && memberFilter.region !== 'All' && memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == memberFilter.function && val.region == memberFilter.region
            })
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city !== 'All' && memberFilter.region === 'All' && memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == memberFilter.function && val.city == memberFilter.city
            })
            setMembersShow([...tempMembersShow])
        }
        if (memberFilter.city !== 'All' && memberFilter.region !== 'All' && memberFilter.function !== 'All') {
            tempMembersShow = tempMembersShow.filter((val) => {
                return val.function == memberFilter.function && val.city == memberFilter.city && val.region == memberFilter.region
            })
            setMembersShow([...tempMembersShow])
        }

    }

    const showTasks = () => {

        let tempTasks = tasks

        let tempSnagTasks = tempTasks.filter((val) => {
            return val.Type === 'Snag'
        })

        let tempCustomTasks = tempTasks.filter((val) => {
            return val.Type === 'Custom'
        })

        let tempPjpTasks = tempTasks.filter((val) => {
            return val.Type === 'PJP'
        })

        console.log('1', tempTasks)
        console.log('2', tempSnagTasks)
        console.log('3', tempCustomTasks)
        console.log('4', tempPjpTasks)

        if (filter.length === 0) {
            setTasksShow([...tempTasks])
            setCustomTasks([...tempCustomTasks])
            setSnagTasks([...tempSnagTasks])
            setPjpTasks([...tempPjpTasks])
            setCustomTasksShow([...tempCustomTasks])
            setSnagTasksShow([...tempSnagTasks])
            setPjpTasksShow([...tempPjpTasks])
        } else {
            //to implement
        }
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

        console.log('config in task creation', config)
        console.log('local storage in task creation', localStorage.getItem('id'))

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTasks', { cust_id: localStorage.getItem('cust_id') }, config)
            .then(res => {

                console.log(res.data)
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
                setMembers([...res.data.members])
                setMembersShow([...res.data.members])
                setFunctions([...res.data.functions])
                res.data.tasks.forEach((val) => {
                    if (val.Type === 'PJP') {
                        val.path = JSON.parse(val.path)
                    }
                })
                setTasks([...res.data.tasks])
                setIsLoading(false)
                setTaskDetailWizardShown(false)
                setMapShow(false)
                let tempSelectedPath = []
                setSelectedPath([...tempSelectedPath])
                setDeleting(0)

            }).catch(err => { alert('Ambigious response from server'); setIsLoading(false) })
    }

    const showSnags = (id) => {

        setSnagsViewShow(true)
        setFetchingSnags(true)

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getSnags', { task_id: id })
            .then(res => {

                if (res.data == 'failed') {
                    { alert('Ambigious response from server'); setFetchingSnags(false); return }
                }

                setSnagsView([...res.data])

            }).catch(err => { alert('Ambigious response from server'); setFetchingSnags(false) })

    }

    useEffect(() => {

        setFetchingSnags(false)
    }, [snagsView])

    const showMembers = (members) => {

        setMembersView([...members])
        setMembersViewShow(true)
    }

    const deleteTask = (id) => {

        setDeleting(id);

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/taskDelete', { task_id: id })
            .then(res => {

                if (res.data === 'failed') {
                    alert("Some Issue Occured Please Try Again")
                }

                init()

            }).catch(err => alert(err.response.data.message))
    }

    const sortByDate = (type) => {
        console.log('working')
        if (type === 'custom') {
            let tempTasks = customTasks

            if (dateSort === '' || dateSort === 'desc') {
                tempTasks.sort((a, b) => {
                    return Date.parse(a.startDate) - Date.parse(b.startDate)
                });
                setDateSort('asc')
            }
            if (dateSort === 'asc') {
                tempTasks.sort((a, b) => {
                    return Date.parse(b.startDate) - Date.parse(a.startDate)
                });
                setDateSort('desc')
            }

            setCustomTasksShow([...tempTasks])
        }
        if (type === 'snag') {
            console.log('reaching here')
            let tempTasks = snagTasks
            console.log(snagTasks)

            if (dateSort === '' || dateSort === 'desc') {
                tempTasks.sort((a, b) => {
                    return Date.parse(a.startDate) - Date.parse(b.startDate)
                });
                setDateSort('asc')
            }
            if (dateSort === 'asc') {
                tempTasks.sort((a, b) => {
                    return Date.parse(b.startDate) - Date.parse(a.startDate)
                });
                setDateSort('desc')
            }

            setSnagTasksShow([...tempTasks])
        }
    }

    const sortByUrgency = (type) => {
        console.log('working')
        if (type === 'custom') {
            let tempTasks = customTasks
            if (urgencySort === '' || urgencySort === 'desc') {
                tempTasks.sort((a, b) => {
                    //return Date.parse( a.startDate ) - Date.parse( b.startDate )
                    if (a.urgency === 'High' && b.urgency === 'Medium') {
                        return -1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Medium') {
                        return 1
                    }
                    if (a.urgency === 'High' && b.urgency === 'Low') {
                        return -1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Low') {
                        return 1
                    }
                    if (a.urgency === 'Medium' && b.urgency === 'Low') {
                        return -1
                    }
                    if (b.urgency === 'Medium' && a.urgency === 'Low') {
                        return 1
                    }
                });
                setUrgencySort('asc')
            }
            if (urgencySort === 'asc') {
                tempTasks.sort((a, b) => {
                    //return Date.parse( a.startDate ) - Date.parse( b.startDate )
                    if (a.urgency === 'High' && b.urgency === 'Medium') {
                        return 1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Medium') {
                        return -1
                    }
                    if (a.urgency === 'High' && b.urgency === 'Low') {
                        return 1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Low') {
                        return -1
                    }
                    if (a.urgency === 'Medium' && b.urgency === 'Low') {
                        return 1
                    }
                    if (b.urgency === 'Medium' && a.urgency === 'Low') {
                        return -1
                    }
                });
                setUrgencySort('desc')
            }


            setCustomTasksShow([...tempTasks])
        }
        if (type === 'snag') {
            let tempTasks = snagTasks
            if (urgencySort === '' || urgencySort === 'desc') {
                tempTasks.sort((a, b) => {
                    //return Date.parse( a.startDate ) - Date.parse( b.startDate )
                    if (a.urgency === 'High' && b.urgency === 'Medium') {
                        return -1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Medium') {
                        return 1
                    }
                    if (a.urgency === 'High' && b.urgency === 'Low') {
                        return -1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Low') {
                        return 1
                    }
                    if (a.urgency === 'Medium' && b.urgency === 'Low') {
                        return -1
                    }
                    if (b.urgency === 'Medium' && a.urgency === 'Low') {
                        return 1
                    }
                });
                setUrgencySort('asc')
            }
            if (urgencySort === 'asc') {
                tempTasks.sort((a, b) => {
                    //return Date.parse( a.startDate ) - Date.parse( b.startDate )
                    if (a.urgency === 'High' && b.urgency === 'Medium') {
                        return 1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Medium') {
                        return -1
                    }
                    if (a.urgency === 'High' && b.urgency === 'Low') {
                        return 1
                    }
                    if (b.urgency === 'High' && a.urgency === 'Low') {
                        return -1
                    }
                    if (a.urgency === 'Medium' && b.urgency === 'Low') {
                        return 1
                    }
                    if (b.urgency === 'Medium' && a.urgency === 'Low') {
                        return -1
                    }
                });
                setUrgencySort('desc')
            }


            setSnagTasksShow([...tempTasks])
        }

    }

    const search = (e, type) => {

        const keyword = e.target.value.toLowerCase();

        if (type === 'custom') {
            let tempTasks = customTasks

            if (keyword === '') {
                setCustomTasksShow([...tempTasks])
            } else {
                tempTasks = tempTasks.filter(entry => Object.values(entry).some(val => String(val).toLowerCase().includes(keyword)));
                setCustomTasksShow([...tempTasks])
            }
        }
        if (type === 'snag') {
            let tempTasks = snagTasks
            if (keyword === '') {
                setSnagTasksShow([...tempTasks])
            } else {
                tempTasks = tempTasks.filter(entry => Object.values(entry).some(val => String(val).toLowerCase().includes(keyword)));
                setSnagTasksShow([...tempTasks])
            }
        }

    }

    const pathClicked = (e) => {
        if (mapAction === false) {
            return
        }
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log(position)
        let tempSelectedPath = selectedPath;
        tempSelectedPath.push(position)
        setSelectedPath([...tempSelectedPath])
    }

    const markerDragged = (e, index) => {
        if (mapAction === false) {
            return
        }
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log(position)
        let tempSelectedPath = selectedPath;
        tempSelectedPath[index] = position;
        setSelectedPath([...tempSelectedPath])
    }

    const markerDeleted = (index) => {
        if (mapAction === false) {
            return
        }
        let tempSelectedPath = selectedPath;
        tempSelectedPath = tempSelectedPath.filter((value, ind) => {
            return ind !== index
        })
        setSelectedPath([...tempSelectedPath])
    }

    const planClicked = (e, task) => {
        e.stopPropagation();
        setMapAction(false);
        setSelectedPath(task.path)
        setMapShow(true)
    }

    const directionsCallback = (response) => {
        console.log(response)

        if (response !== null) {
            if (response.status === 'OK') {
                setResponse({...response})
            } else {
                console.log('response: ', response)
            }
        }
    }


    return (
        <>
            <div className="TaskCreationWrapper">

                {isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: '10000000' }}>
                        <Spinner />
                        <div style={{ clear: 'both' }}></div>
                    </div>
                }

                {tasks.length === 0 &&
                    <div style={{ background: '#cce5ff', color: "black", textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <h3>No Existing Tasks</h3>
                        <p>Please click on the button below to add a new task</p>
                    </div>
                }

                {mapShow &&
                    <div className="TaskCreation_Map">
                        <div onClick={() => { let tempSelectedPath = []; setSelectedPath([...tempSelectedPath]); setMapShow(false) }} style={{ textAlign: 'right', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#e0f4fa', color: '#04b2d9', paddingRight: '10px' }}>x</div>
                        <LoadScript
                            googleMapsApiKey="AIzaSyD6l5bH_gXHS6Qjxk4MdS_bDaqicwzI_uE"
                        // libraries={["visualization"]}
                        >
                            <GoogleMap
                                onClick={(e) => pathClicked(e)}
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={center}
                                options={
                                    { fullscreenControl: false }
                                }
                                zoom={9}
                            >
                                {selectedPath.map((position, index) => {
                                    return (
                                        <Marker
                                            onDblClick={() => markerDeleted(index)}
                                            onDrag={(e) => markerDragged(e, index)}
                                            position={position}
                                            options={{
                                                draggable: true
                                            }}
                                        />
                                    )
                                })}
                                {/* <Polyline
                                    path={task.path}
                                /> */}
                                <Polygon
                                    paths={selectedPath}
                                />

                                <DirectionsService
                                    // required
                                    options={{
                                        destination: destination,
                                        origin: origin,
                                        travelMode: travelMode
                                    }}
                                    // required
                                    callback={directionsCallback}
                                // optional
                                />
                                {response !== null &&
                                    <DirectionsRenderer
                                        options={{
                                            directions: response,
                                            polylineOptions: { strokeColor: 'red' },
                                            suppressMarkers: true
                                        }}
                                    />

                                }
                            </GoogleMap>
                        </LoadScript>
                    </div>
                }

                <div className="TasksCreation_tasks_Outer">

                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                        <>
                            <div style={{ borderRight: '1px solid lightgray', width: '50%', height: '40px', boxSizing: 'border-box', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', paddingTop: '10px' }}>
                                <span style={{ fontSize: '16px' }}>Tasks</span>
                                <span style={{ float: 'right' }}>
                                    <span><input onChange={(e) => search(e, 'custom')} placeholder="Search" style={{ marginRight: '20px' }} type="text"></input></span>
                                    <span onClick={() => { setShowTasksWizard(true); setTaskType('Custom') }} title="Add New Task" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-plus" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByDate('custom')} title="Sort By Date" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-calendar" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByUrgency('custom')} title="Sort By Urgency" style={{ marginRight: '10px', cursor: 'pointer' }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                </span>
                            </div>
                            <div style={{ borderRight: '1px solid lightgray', width: '50%', height: '40px', boxSizing: 'border-box', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', paddingTop: '10px' }}>
                                <span style={{ fontSize: '16px' }}>Snags</span>
                                <span style={{ float: 'right' }}>
                                    <span><input onChange={(e) => search(e, 'snag')} placeholder="Search" style={{ marginRight: '20px' }} type="text"></input></span>
                                    <span onClick={() => { navigate("/snagreporting") }} title="Add New Task" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-plus" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByDate('snag')} title="Sort By Date" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-calendar" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByUrgency('snag')} title="Sort By Urgency" style={{ marginRight: '10px', cursor: 'pointer' }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                </span>
                            </div>
                            {/* <div style={{ width: '33.33%', height: '40px', boxSizing: 'border-box', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', paddingTop: '10px' }}>
                                <span style={{ fontSize: '16px' }}>PJP</span>
                                <span style={{ float: 'right' }}>
                                    <span><input onChange={(e) => search(e, 'custom')} placeholder="Search" style={{ marginRight: '20px' }} type="text"></input></span>
                                    <span onClick={() => { setShowTasksWizard(true); setTaskType('PJP') }} title="Add New Task" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-plus" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByDate('custom')} title="Sort By Date" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-calendar" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByUrgency('custom')} title="Sort By Urgency" style={{ marginRight: '10px', cursor: 'pointer' }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                </span>
                            </div> */}
                        </>
                    }
                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) === false &&
                        <>
                            <div style={{ width: '100%', height: '30px', boxSizing: 'border-box', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                                Tasks
                                <span style={{ float: 'right' }}>
                                    <span><input onChange={(e) => search(e, 'custom')} placeholder="Search" style={{ marginRight: '20px' }} type="text"></input></span>
                                    <span onClick={() => {setShowTasksWizard(true); setTaskType('Custom')}} title="Add New Task" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-plus" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByDate('custom')} title="Sort By Date" style={{ marginRight: '20px', cursor: 'pointer' }}><i class="fa fa-calendar" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                    <span onClick={() => sortByUrgency('custom')} title="Sort By Urgency" style={{ marginRight: '10px', cursor: 'pointer' }}><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <i className="fa fa-sort" aria-hidden="true"></i></span>
                                </span>
                            </div>
                        </>
                    }

                    <div className={`${JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) ? "TasksCreation_tasks_flexbox" : "TasksCreation_tasks_flexbox_onlyTasks"}`}>
                        {customTasksShow.map((item, index) => {
                            return (
                                <div key={index} className={`${JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === '1' }) ? "TasksCreation_tasks_Inner" : "TasksCreation_tasks_Inner_onlyTasks"}`} onClick={() => { setSelectedTask(item); setTaskDetailWizardShown(true); addMembersClicked(index, 'custom') }}>
                                    <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', color: 'black' }}>
                                        {item.name}
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                        Urgency : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.urgency}</span>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '12px', height: '16.666%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                        <div>From: <span style={{ fontSize: '12px', fontWeight: 'normal', marginBottom: '5px' }}>{item.startDate.split(' ')[0]}</span></div>
                                        <div>To: <span style={{ fontSize: '12px', fontWeight: 'normal' }}>{item.dueDate.split(' ')[0]}</span></div>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                        Status : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.status}</span>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                        Assigned By : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.assigned_by_name}</span>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', boxSizing: 'border-box', paddingRight: '10px' }}>
                                        {item.members.length === 0 &&
                                            <>
                                                <div style={{ color: 'red', fontWeight: 'normal' }}>* Unassigned</div>
                                                <div style={{ height: '20px', width: '20px', borderRadius: '20px', background: 'red' }}></div>
                                            </>
                                        }
                                        {item.members.length !== 0 &&
                                            <div style={{ height: '25px', width: '25px', borderRadius: '25px', background: '#ff5722', color: 'white', fontWeight: 'bold', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span>{item.members[0].name.toUpperCase().split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')}</span>
                                            </div>
                                        }

                                    </div>
                                </div>
                            )
                        })}

                    </div>

                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 }) &&
                        <div className="TasksCreation_tasks_flexbox">

                            {snagTasksShow.map((item, index) => {
                                return (
                                    <div key={index} className="TasksCreation_tasks_Inner" onClick={() => { setSelectedTask(item); setTaskDetailWizardShown(true); addMembersClicked(index, 'snag') }}>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', color: 'black' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            Urgency : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.urgency}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            <div>From: <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.startDate.split(' ')[0]}</span></div>
                                            <div>To: <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.dueDate.split(' ')[0]}</span></div>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            Status : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.status}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            Assigned By : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.assigned_by_name}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', boxSizing: 'border-box', paddingRight: '10px' }}>
                                            {item.members.length === 0 &&
                                                <>
                                                    <div style={{ color: 'red', fontWeight: 'normal' }}>* Unassigned</div>
                                                    <div style={{ height: '20px', width: '20px', borderRadius: '20px', background: 'red' }}></div>
                                                </>
                                            }
                                            {item.members.length !== 0 &&
                                                <div style={{ height: '25px', width: '25px', borderRadius: '25px', background: '#ff5722', color: 'white', fontWeight: 'bold', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {item.members[0].name.toUpperCase().split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')}
                                                </div>
                                            }

                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    }

                    {/* {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === '2' }) &&
                        <div className="TasksCreation_tasks_flexbox">

                            {pjpTasksShow.map((item, index) => {
                                return (
                                    <div key={index} className="TasksCreation_tasks_Inner" onClick={() => { setSelectedTask(item); setTaskDetailWizardShown(true); addMembersClicked(index, 'pjp') }}>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', color: 'black' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            Urgency : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.urgency}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            <div>From: <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.startDate.split(' ')[0]}</span></div>
                                            <div>To: <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.dueDate.split(' ')[0]}</span></div>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            Status : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.status}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', paddingLeft: '10px' }}>
                                            Assigned By : <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.assigned_by_name}</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '13px', height: '16.666%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', paddingRight: '10px' }}>
                                            <div onClick={(e) => planClicked(e, item)} style={{ color: 'blue', textDecoration: 'underline', marginLeft: '20px' }}>PJP</div>
                                            {item.members.length === 0 &&
                                                <>
                                                    <div style={{ color: 'red', fontWeight: 'normal' }}>* Unassigned</div>
                                                    <div style={{ height: '20px', width: '20px', borderRadius: '20px', background: 'red' }}></div>
                                                </>
                                            }
                                            {item.members.length !== 0 &&
                                                <div style={{ height: '25px', width: '25px', borderRadius: '25px', background: '#ff5722', color: 'white', fontWeight: 'bold', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {item.members[0].name.toUpperCase().split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')}
                                                </div>
                                            }

                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    } */}

                </div>

                {taskDetailWizardShown &&
                    <div className='TaskCreation_taskDetailWizard'>
                        <div onClick={() => setTaskDetailWizardShown(false)} style={{ height: '20px', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> x </div>
                        <div style={{ height: 'calc(100% - 50px)', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '13px' }}>
                            <div style={{ height: '100%', width: '50%', boxSizing: 'border-box', borderRight: '1px solid white', overflow: 'auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', paddingLeft: '20px' }}>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 'bold' }}>Name</div>
                                    <div>{selectedTask.name}</div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 'bold' }}>Region</div>
                                    <div>{selectedTask.region}</div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 'bold' }}>City</div>
                                    <div>{selectedTask.city}</div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 'bold' }}>Description</div>
                                    <div>{selectedTask.description}</div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontWeight: 'bold' }}>Status</div>
                                    <div>{selectedTask.status}</div>
                                </div>
                                {selectedTask.Type === 'PJP' &&
                                    <div style={{ width: '100%' }}>
                                        <div style={{ fontWeight: 'bold' }}>PJP</div>
                                        <div onClick={(e) => planClicked(e, selectedTask)} style={{ color: 'greenyellow', textDecoration: 'underline' }}>Map</div>
                                    </div>
                                }
                                {selectedTask.members.length === 0 &&
                                    <div style={{ color: 'red', width: '100%' }}>* Unassigned</div>
                                }

                            </div>
                            <div style={{ height: '100%', width: '50%', boxSizing: 'border-box' }}>
                                <div className="TeamCreationInputFieldsContainer">
                                    <div className="TeamCreationInputField">
                                        <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Region</div>
                                        <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                            <select onChange={(e) => memberFilterHandleChange(e, 'region')} defaultValue={'All'} style={{ width: '90%' }}>
                                                <option value="All">All</option>
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="Central">Central</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="TeamCreationInputField" >
                                        <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>City</div>
                                        <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                            <select onChange={(e) => memberFilterHandleChange(e, 'city')} defaultValue={'All'} style={{ width: '90%' }}>
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
                                    <div className="TeamCreationInputField" >
                                        <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Function</div>
                                        <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                            <select onChange={(e) => memberFilterHandleChange(e, 'function')} defaultValue={'All'} style={{ width: '90%' }}>
                                                <option value='All'>All</option>
                                                {functions.map((val, index) => {
                                                    return (
                                                        <option key={index} value={val.name}>{val.name}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="TeamCreationInputFieldsContainer" style={{ top: '25%', maxHeight: '200px', overflow: 'auto' }}>
                                    {membersShow.map((val, index) => {
                                        return (
                                            <div key={index} style={{ width: '30%', marginTop: '10px', marginBottom: '10px' }}>
                                                <input onChange={() => memberSelect(val)} type="checkbox" checked={selectedMembers.some((value) => { return value.id == val.id })} />{val.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div onClick={() => assignTask()} style={{ height: '30px', textAlign: 'center', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> <button style={{ background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold' }}>Assign Task</button> </div>
                    </div>
                }

                {showTasksWizard &&

                    <div className="TeamCreationMemberWizard" style={{ top: '25%' }}>
                        <div onClick={() => { setShowTasksWizard(false); let tempSelectedPath = []; setSelectedPath([...tempSelectedPath]); setMapShow(false) }} style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> x </div>
                        <div className="TeamCreationInputFieldsContainer">
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Task Name</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => taskInput(e, 'name')} style={{ width: '90%' }} type='text' />
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Urgency</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={'DEFAULT'} onChange={(e) => taskInput(e, 'urgency')} style={{ width: '90%' }}>
                                        <option value="DEFAULT" disabled>--Select Urgency--</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Region</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={'DEFAULT'} onChange={(e) => taskInput(e, 'region')} style={{ width: '90%' }}>
                                        <option value="DEFAULT" disabled>--Select Region--</option>
                                        <option value="North">North</option>
                                        <option value="South">South</option>
                                        <option value="Central">Central</option>
                                    </select>
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>City</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={'DEFAULT'} onChange={(e) => taskInput(e, 'city')} style={{ width: '90%' }}>
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
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Area</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => taskInput(e, 'area')} style={{ width: '90%' }} type="text" />
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Start Date</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => taskInput(e, 'startDate')} style={{ width: '90%' }} type="date" />
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Due Date</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => taskInput(e, 'dueDate')} style={{ width: '90%' }} type="date" />
                                </div>
                            </div>
                            {taskType === 'PJP' &&
                                <div className="TeamCreationInputField">
                                    <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>PJP</div>
                                    <div onClick={() => { setMapShow(!mapShow); setMapAction(true) }} style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                        <span style={{ color: 'greenyellow', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>Map</span>
                                    </div>
                                </div>
                            }
                            <div className="TeamCreationInputField" style={{ width: '80%', height: '200px' }}>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Description</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <textarea onChange={(e) => taskInput(e, 'description')} style={{ width: '90%', height: '170px' }}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="TeamCreationButton">
                            <button onClick={() => addTask()} style={{ background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Add</button>
                        </div>
                    </div>

                }

            </div>

            {/* <div className="TaskCreationBottomBar">
                <button onClick={() => setShowTasksWizard(true)} style={{ color: 'white', background: 'transparent', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Create New Task</button>
                <span onClick={() => sortByDate()} style={{ color: 'white', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Sort By Date <i className="fa fa-sort" aria-hidden="true"></i></span>
                <span onClick={() => sortByUrgency()} style={{ color: 'white', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Sort By Urgency <i className="fa fa-sort" aria-hidden="true"></i></span>
                <span style={{ color: 'white', height: '90%', cursor: 'pointer', marginLeft: '20px' }}><input onChange={(e) => search(e)} type="text" placeholder="Search" ></input></span>
            </div> */}

            {showMembersWizard &&

                <div className="TeamCreationMemberWizard">
                    <div onClick={() => setShowMembersWizard(false)} style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> x </div>
                    <h4 style={{ margin: '0px', padding: '0px' }}>Filter</h4>
                    <div className="TeamCreationInputFieldsContainer">
                        <div className="TeamCreationInputField">
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Region</div>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                <select onChange={(e) => memberFilterHandleChange(e, 'region')} defaultValue={'All'} style={{ width: '90%' }}>
                                    <option value="All">All</option>
                                    <option value="North">North</option>
                                    <option value="South">South</option>
                                    <option value="Central">Central</option>
                                </select>
                            </div>
                        </div>
                        <div className="TeamCreationInputField" >
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>City</div>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                <select onChange={(e) => memberFilterHandleChange(e, 'city')} defaultValue={'All'} style={{ width: '90%' }}>
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
                        <div className="TeamCreationInputField" >
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Function</div>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                <select onChange={(e) => memberFilterHandleChange(e, 'function')} defaultValue={'All'} style={{ width: '90%' }}>
                                    <option value='All'>All</option>
                                    {functions.map((val, index) => {
                                        return (
                                            <option key={index} value={val.name}>{val.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="TeamCreationInputFieldsContainer" style={{ top: '25%', maxHeight: '200px', overflow: 'auto' }}>
                        {membersShow.map((val, index) => {
                            return (
                                <div key={index} style={{ width: '30%', marginTop: '10px', marginBottom: '10px' }}>
                                    <input onChange={() => memberSelect(val)} type="checkbox" checked={selectedMembers.some((value) => { return value.id == val.id })} />{val.name}
                                </div>
                            )
                        })}
                    </div>
                    <button onClick={() => assignTask()} style={{ color: 'white', background: 'rgb(59, 89, 152)', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Assign Task</button>
                </div>

            }

            {membersViewShow &&

                <div className="TeamCreationMemberWizard" style={{ height: '30%' }}>

                    <div onClick={() => setMembersViewShow(false)} style={{ height: '30px', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> x </div>
                    <div style={{ height: 'calc(100% - 30px)', overflow: 'auto' }}>
                        <table>
                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                </tr>

                            </thead>

                            <tbody>

                                {membersView.map((val, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{val.name}</td>
                                            <td>{val.email}</td>
                                            <td>{val.number}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>

            }

            {snagsViewShow &&
                <div className="TeamCreationMemberWizard" style={{ height: '30%' }}>

                    <div onClick={() => setSnagsViewShow(false)} style={{ height: '30px', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}>
                        {fetchingSnags &&
                            <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                        }

                        x
                    </div>
                    <div style={{ height: 'calc(100% - 30px)', overflow: 'auto' }}>
                        <table>
                            <thead>

                                <tr>
                                    <th>Snag</th>
                                    <th>Category</th>
                                    <th>Severity</th>
                                    <th>Remarks</th>
                                </tr>

                            </thead>

                            <tbody>

                                {snagsView.map((val, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{val.q_name}</td>
                                            <td>{val.form_name}</td>
                                            <td>{val.severity}</td>
                                            <td>{val.Remarks}</td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                    </div>

                </div>

            }
        </>
    )
}

export default TaskCreation