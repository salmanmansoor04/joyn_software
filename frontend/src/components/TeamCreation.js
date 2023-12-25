import { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../styles/TeamCreation.css'

import Spinner from "./Spinner";

function TeamCreation(props) {
    const navigate = useNavigate();

    const [functions, setFunctions] = useState([]);
    const [members, setMembers] = useState([]);
    const [membersShow, setMembersShow] = useState([]);
    const [functionName, setfunctionName] = useState('');
    const [selectedFunction, setSelectedFunction] = useState('All');
    const [member, setMember] = useState({
        name: '',
        email: '',
        number: '',
        region: '',
        city: '',
        function: ''
    })
    const [functionWizardShown, setFunctionWizardShown] = useState(false);
    const [memberWizardShown, setMemberWizardShown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const [id, setId] = useState(0);

    const [type, setType] = useState('');

    const [functionDisplayName, setFunctionDisplayName] = useState('');

    useEffect(() => {
        console.log('init');
        init();
    }, []);

    useEffect(() => {
        console.log('inside useEffect', functions)
        setFunctionWizardShown(false)
    }, [functions]);

    useEffect(() => {
        console.log('inside useEffect', members, selectedFunction)
        setMember({
            name: '',
            email: '',
            number: '',
            region: '',
            city: '',
            function: ''
        })
        setMemberWizardShown(false)
        showMembers()
    }, [members, selectedFunction]);

    const handleSubmit = (e) => {
        setSelectedFunction(e.target.value)
    }

    const typingFunction = (e) => {
        setfunctionName(e.target.value)
    }

    const addFunction = () => {
        if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '7' }) === false){
            alert('Access Denied, no unauthorized access')
            return
        }
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addFunction', { function: functionName, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                console.log('function', res.data)
                init();

            }).catch(err => alert(err.response.data.message))
    }

    const memberInput = (e, type) => {
        let tempObj = member
        if (type == 'name') {
            tempObj.name = e.target.value;
            setMember(tempObj);
        }
        if (type == 'email') {
            tempObj.email = e.target.value;
            setMember(tempObj);
        }
        if (type == 'number') {
            tempObj.number = e.target.value;
            setMember(tempObj);
        }
        if (type == 'region') {
            tempObj.region = e.target.value;
            setMember(tempObj);
        }
        if (type == 'city') {
            tempObj.city = e.target.value;
            setMember(tempObj);
        }
        if (type == 'function') {
            tempObj.function = e.target.value;
            setMember(tempObj);
        }

    }

    const showMembers = () => {

        let tempMembers = members

        if (selectedFunction === 'All') {
            setMembersShow([...tempMembers])
        } else {

            tempMembers = tempMembers.filter((val) => {

                return val.function == selectedFunction
            })

            setMembersShow([...tempMembers])
        }
    }

    const addMember = () => {
        if(JSON.parse(localStorage.getItem('permissions')).some((val) => { return val.id === '7' }) === false){
            alert('Access Denied, no unauthorized access')
            return
        }
        setIsLoading(true);
        console.log(member);
        //setMembers([...members, member])
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/addMember', { member: member, crudType: type, member_id: id, cust_id: localStorage.getItem('cust_id') })
            .then(res => {

                if (res.data === 'failed') {
                    alert('Ambigious response from server'); setIsLoading(false); return
                }
                init();

            }).catch(err => { alert('Ambigious response from server, Could not complete action'); setIsLoading(false) })
    }

    const updateClicked = (item) => {
        console.log(item)
        setMember({
            name: item.name,
            email: item.email,
            number: item.number,
            region: item.region,
            city: item.city,
            function: item.functionId
        })
        setId(item.id)
        setMemberWizardShown(true)
        setType('update')
        setFunctionDisplayName(item.function)
    }

    const deleteClicked = (id) => {
        setIsLoading(true);
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/memberDelete', { id: id })
            .then(res => {

                init();

            }).catch(err => { alert('Ambigious response from server, Could not complete action'); setIsLoading(false) })
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

        console.log('config in team creation', config)
        console.log('local storage in team creation', localStorage.getItem('id'))

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getMembers', {cust_id: localStorage.getItem('cust_id')}, config)
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

                if (res.data.members.length === 0) {
                    setShowAlert(true)
                } else {
                    setShowAlert(false)
                }
                setMembers([...res.data.members])
                setFunctions([...res.data.functions])
                setIsLoading(false)

            }).catch(err => { console.log(err) })
    }

    return (
        <>
            <div className="TeamCreationWrapper">

                {isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', zIndex: '10000000' }}>
                        <Spinner />
                        <div style={{ clear: 'both' }}></div>
                    </div>
                }

                {showAlert &&

                    <div style={{ background: '#cce5ff', color: "black", textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <h3>No Existing Teams</h3>
                        <p>Please click on the button below to add a new team</p>
                    </div>

                }

                <div className="fixTableHead" style={{ height: '100%' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Number</th>
                                <th>Email</th>
                                <th>Region</th>
                                <th>City</th>
                                <th>Function</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {membersShow.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.number}</td>
                                        <td>{item.email}</td>
                                        <td>{item.region}</td>
                                        <td>{item.city}</td>
                                        <td>{item.function}</td>
                                        <td> <span style={{ cursor: 'pointer' }} onClick={() => updateClicked(item)}>Update</span> | <span style={{ cursor: 'pointer' }} onClick={() => deleteClicked(item.id)}>Delete</span></td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>

                {memberWizardShown &&

                    <div className="TeamCreationMemberWizard" style={{transform: 'translateY(30px)', height: '40%'}}>
                        <div onClick={() => {
                            setMemberWizardShown(false); setMember({
                                name: '',
                                email: '',
                                number: '',
                                region: '',
                                city: '',
                                function: ''
                            })
                            setFunctionDisplayName('')
                        }} style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> x </div>
                        <div className="TeamCreationInputFieldsContainer">
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Member Name</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => memberInput(e, 'name')} style={{ width: '90%' }} defaultValue={member.name} type='text' />
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Email</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => memberInput(e, 'email')} style={{ width: '90%' }} defaultValue={member.email} type='email' />
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Phone Number</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <input onChange={(e) => memberInput(e, 'number')} style={{ width: '90%' }} defaultValue={member.number} type='number' />
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Region</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={member.region} onChange={(e) => memberInput(e, 'region')} style={{ width: '90%' }}>
                                        <option value={member.region} disabled>{member.region}</option>
                                        <option value="North">North</option>
                                        <option value="South">South</option>
                                        <option value="Central">Central</option>
                                    </select>
                                </div>
                            </div>
                            <div className="TeamCreationInputField">
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>City</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={member.city} onChange={(e) => memberInput(e, 'city')} style={{ width: '90%' }}>
                                        <option value={member.city} disabled>{member.city}</option>
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
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Function</div>
                                <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                    <select defaultValue={functionDisplayName} onChange={(e) => memberInput(e, 'function')} style={{ width: '90%' }}>
                                        <option value={functionDisplayName} disabled>{functionDisplayName}</option>
                                        {functions.map((value, index) => {
                                            return (
                                                <option key={index} value={value.id}>{value.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="TeamCreationButton">
                            <button onClick={() => addMember()} style={{ background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Add</button>
                        </div>
                    </div>

                }

            </div>

            <div className="TeamCreationBottomBar">
                <span style={{ color: 'white', background: 'transparent', height: '100%', cursor: 'pointer', marginRight: '5px' }}>Function</span>
                <select defaultValue={'All'} onChange={(e) => handleSubmit(e)} style={{ color: 'white', background: 'transparent', height: '90%', border: '2px solid white', cursor: 'pointer' }}>
                    <option style={{ color: 'black' }} value={'All'}>All</option>
                    {functions.map((value, index) => {
                        return (
                            <option key={index} style={{ color: 'black' }} value={value.name}>{value.name}</option>
                        )
                    })}
                </select>
                <button onClick={() => setFunctionWizardShown(true)} style={{ color: 'white', background: 'transparent', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Create New Function</button>
                <button onClick={() => { setMemberWizardShown(true); setType('add') }} style={{ color: 'white', background: 'transparent', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Add Member</button>
            </div>

            {functionWizardShown &&

                <div className="TeamCreationFunctionCreateWizard">
                    <div onClick={() => setFunctionWizardShown(false)} style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', cursor: 'pointer' }}> x </div>
                    <div className="TeamCreationInputFieldsContainer">
                        <div className="TeamCreationInputField" style={{ width: '50%' }}>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '20px', textAlign: 'center' }}>Function Name</div>
                            <div style={{ margin: '0', padding: '0', width: '100%', height: '30px', textAlign: 'center' }}>
                                <input onChange={(e) => typingFunction(e)} style={{ width: '90%' }} type='text' />
                            </div>
                        </div>
                    </div>
                    <div className="TeamCreationButton">
                        <button onClick={() => addFunction()} style={{ background: '#e0f4fa', color: '#04b2d9', fontWeight: 'bold', height: '90%', border: '2px solid white', cursor: 'pointer', marginLeft: '20px' }}>Add</button>
                    </div>
                </div>

            }
        </>
    )
}

export default TeamCreation