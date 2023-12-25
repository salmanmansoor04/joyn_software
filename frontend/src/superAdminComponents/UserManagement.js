import { useState, useEffect } from "react";
import Axios from 'axios';

import '../styles/UserManagement.css'

import Spinner from '../components/Spinner'

function UserManagement(props) {

    const [users, setUsers] = useState([])

    const [roles, setRoles] = useState(['Super Admin', 'Admin'])

    const [organizations, setOrganizations] = useState(['Joyn', 'Facebook'])

    const [permissions, setPermissions] = useState(['edit', 'update'])

    const [userEntryShown, setUserEntryShown] = useState(false)

    const [organizationEntryShown, setOrganizationEntryShown] = useState(false)

    const [roleEntryShown, setRoleEntryShown] = useState(false)

    const [openTab, setOpenTab] = useState('users')

    const [isLoading, setIsLoading] = useState(true)

    const [isLoading2, setIsLoading2] = useState(false)

    const [userToEnter, setUserToEnter] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        role: '',
        organization: '',
    })

    const [organizationToEnter, setOrganizationToEnter] = useState({
        name: ''
    })

    const [roleToEnter, setRoleToEnter] = useState({
        name: ''
    })

    const [selectedPermissions, setSelectedPermissions] = useState([])

    const [entryState, setEntryState] = useState('add')

    const [idToUpdate, setIdToUpdate] = useState(0)

    const userEntry = (e, val) => {
        console.log(val, e.target.value)
        let temp = userToEnter;
        temp[val] = e.target.value;
        setUserToEnter({ ...temp })
    }

    const organizationEntry = (e, val) => {
        let temp = organizationToEnter;
        temp[val] = e.target.value;
        setOrganizationToEnter({ ...temp })
    }

    const roleEntry = (e, val) => {
        let temp = roleToEnter;
        temp[val] = e.target.value;
        setRoleToEnter({ ...temp })
    }

    const permissionsClicked = (value) => {
        let temp = selectedPermissions;

        if (temp.some((val) => { return val.id === value.id })) {
            temp = temp.filter((item) => {
                return item.id !== value.id
            })
        } else {
            temp.push(value)
        }

        console.log(temp);

        setSelectedPermissions([...temp])
    }

    const submitUser = () => {
        setIsLoading2(true)
        if (entryState === 'add') {
            console.log(userToEnter)
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/register', userToEnter)
                .then(res => {

                    console.log(res.data)
                    init();

                }).catch(err => { console.log(err) })
        }
        if (entryState === 'update') {
            console.log(userToEnter)
            let temp = userToEnter;
            temp.id = idToUpdate;
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementUserUpdate', temp)
                .then(res => {

                    console.log(res.data)
                    init();

                }).catch(err => { console.log(err) })
        }
    }

    useEffect(() => {
        init()
    }, []);

    const submitRole = () => {
        console.log(roleToEnter)
        console.log(selectedPermissions)
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementEnterRole', { name: roleToEnter.name, id: idToUpdate, entryState: entryState, permissions: selectedPermissions })
            .then(res => {

                console.log(res.data)
                init();

            }).catch(err => { console.log(err) })
    }

    const submitOrganization = () => {
        setIsLoading2(true)
        //console.log(organizationToEnter)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementEnterOrganization', { name: organizationToEnter.name, id: idToUpdate, entryState: entryState })
            .then(res => {

                console.log(res.data)
                init();

            }).catch(err => { console.log(err) })

    }

    const roleUpdateClicked = (item) => {
        console.log(item)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementGetRolesPermission', { id: item.id })
            .then(res => {
                let tempRoleToEnter = {
                    name: item.name
                }
                setRoleToEnter({ ...tempRoleToEnter })
                setSelectedPermissions([...res.data])
                setEntryState('update')
                setRoleEntryShown(true)
                setIdToUpdate(item.id)

            }).catch(err => { console.log(err) })
    }

    const userUpdateClicked = (item) => {
        console.log(item)
        let tempUserToEnter = {
            name: item.name,
            email: item.email,
            username: item.username,
            password: '',
            role: item.role,
            organization: item.cust_id,
        }
        setUserEntryShown(true)
        setIdToUpdate(item.id)
        setUserToEnter({ ...tempUserToEnter })
        setEntryState('update');
    }

    const roleDeleteClicked = (item) => {
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementDelete', { id: item.id, type: 'role' })
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { console.log(err) })
    }

    const organizationDeleteClicked = (item) => {
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementDelete', { id: item.id, type: 'organization' })
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { console.log(err) })
    }

    const userDeleteClicked = (item) => {
        setIsLoading2(true)
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementDelete', { id: item.id, type: 'user' })
            .then(res => {
                console.log(res.data)
                init();
            }).catch(err => { console.log(err) })
    }



    const init = () => {
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/SAuserManagementInit')
            .then(res => {

                let temp = res.data.users;
                let temp2 = res.data.roles;
                let temp3 = res.data.organizations;
                temp.sort(function (a, b) { return b.id - a.id });
                temp2.sort(function (a, b) { return b.id - a.id });
                temp3.sort(function (a, b) { return b.id - a.id });
                console.log(res.data)
                setUsers([...temp])
                setRoles([...temp2])
                setOrganizations([...temp3])
                setPermissions([...res.data.permissions])
                setIsLoading(false)
                setIsLoading2(false)
                clearEntryStates();
                clearShowStates();

            }).catch(err => { console.log(err) })
    }

    const clearEntryStates = () => {
        let tempUserToEnter = {
            name: '',
            email: '',
            username: '',
            password: '',
            role: '',
            organization: '',
        }

        let tempOrganizationToEnter = {
            name: ''
        }

        let tempRoleToEnter = {
            name: ''
        }

        let tempSelectedPermissions = []

        setUserToEnter({ ...tempUserToEnter })
        setOrganizationToEnter({ ...tempOrganizationToEnter })
        setRoleToEnter({ ...tempRoleToEnter })
        setSelectedPermissions([...tempSelectedPermissions])
        setEntryState('add')

    }

    const clearShowStates = () => {
        setUserEntryShown(false)
        setOrganizationEntryShown(false)
        setRoleEntryShown(false)
    }

    return (
        <div className="UserManagement_wrapper">
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
            <div className="UserManagement_top">
                <div onClick={() => { setOpenTab('users'); clearShowStates() }} className="UserManagement_top_inner">
                    <i style={{ width: '30px', fontSize: '25px' }} className="fa fa-user-circle-o"></i>
                    <span>Users</span>
                </div>
                <div onClick={() => { setOpenTab('organizations'); clearShowStates() }} className="UserManagement_top_inner">
                    <i style={{ width: '30px', fontSize: '25px' }} className="fa fa-users"></i>
                    <span>Organizations</span>
                </div>
                <div onClick={() => { setOpenTab('roles'); clearShowStates() }} className="UserManagement_top_inner">
                    <i style={{ width: '30px', fontSize: '25px' }} className="fa fa-lock"></i>
                    <span>Roles and Privileges</span>
                </div>
            </div>
            {openTab === 'users' &&
                <div className="UserManagement_usersTab">
                    <div className="UserManagement_usersList_TopBar">
                        <div className="UserManagement_usersList_TopBar_left">
                            <span style={{ marginLeft: '30px', fontWeight: 'bold' }}>List Of Users</span>
                        </div>
                        <div className="UserManagement_usersList_TopBar_right">
                            <span style={{ cursor: 'pointer', padding: '5px', borderRadius: '5px', background: '#4162A6', color: 'white', fontSize: '13px' }} onClick={() => { setUserEntryShown(!userEntryShown); setEntryState('add'); clearEntryStates() }}>
                                <i className="fa fa-plus"></i> New
                            </span>
                        </div>
                    </div>
                    {userEntryShown &&
                        <div className="UserManagement_userEntry">
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Name</div>
                                <div className="UserManagement_inputField_field">
                                    <input value={userToEnter.name} onChange={(e) => userEntry(e, 'name')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }} type="text" />
                                </div>
                            </div>
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Email</div>
                                <div className="UserManagement_inputField_field">
                                    <input value={userToEnter.email} onChange={(e) => userEntry(e, 'email')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }} type="text" />
                                </div>
                            </div>
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Username</div>
                                <div className="UserManagement_inputField_field">
                                    <input value={userToEnter.username} onChange={(e) => userEntry(e, 'username')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }} type="text" />
                                </div>
                            </div>
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Password</div>
                                <div className="UserManagement_inputField_field">
                                    <input value={userToEnter.password} onChange={(e) => userEntry(e, 'password')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }} type="text" />
                                </div>
                            </div>
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Role</div>
                                <div className="UserManagement_inputField_field">
                                    <select defaultValue={userToEnter.role} onChange={(e) => userEntry(e, 'role')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }}>
                                        <option disabled value=''>Select Role</option>
                                        {roles.map((item, index) => {
                                            return (
                                                <option value={item.id}>{item.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Organization</div>
                                <div className="UserManagement_inputField_field">
                                    <select defaultValue={userToEnter.organization} onChange={(e) => userEntry(e, 'organization')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }}>
                                        <option disabled value=''>Select Organization</option>
                                        {organizations.map((item, index) => {
                                            return (
                                                <option value={item.id}>{item.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="UserManagement_organizationEntry_addButton">
                                <button onClick={() => submitUser()}>Submit</button>
                            </div>
                        </div>
                    }
                    <div className="UserManagement_usersList">
                        <div className="fixTableHead" style={{ height: '100%' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Organization</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>{item.organization}</td>
                                                <td>{item.roleName}</td>
                                                <td>
                                                    <i onClick={() => userUpdateClicked(item)} title="Update" className="fa fa-pencil-square-o" style={{ cursor: 'pointer' }}></i>
                                                    <i onClick={() => userDeleteClicked(item)} title="Delete" className="fa fa-trash" style={{ marginLeft: '10px', cursor: 'pointer' }}></i>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }

            {openTab === 'organizations' &&
                <div className="UserManagement_usersTab">
                    <div className="UserManagement_usersList_TopBar">
                        <div className="UserManagement_usersList_TopBar_left">
                            <span style={{ marginLeft: '30px', fontWeight: 'bold' }}>List Of Organizations</span>
                        </div>
                        <div className="UserManagement_usersList_TopBar_right">
                            <span style={{ cursor: 'pointer', padding: '5px', borderRadius: '5px', background: '#4162A6', color: 'white', fontSize: '13px' }} onClick={() => { setOrganizationEntryShown(!organizationEntryShown); setEntryState('add'); clearEntryStates() }}>
                                <i className="fa fa-plus"></i> New
                            </span>
                        </div>
                    </div>
                    {organizationEntryShown &&
                        <div className="UserManagement_organizationEntry">
                            <div className="UserManagement_inputField">
                                <div className="UserManagement_inputField_heading">Name</div>
                                <div className="UserManagement_inputField_field">
                                    <input value={organizationToEnter.name} onChange={(e) => organizationEntry(e, 'name')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }} type="text" />
                                </div>
                            </div>
                            <div className="UserManagement_organizationEntry_addButton">
                                <button onClick={() => submitOrganization()}>Submit</button>
                            </div>
                        </div>
                    }
                    <div className="UserManagement_usersList">
                        <div className="fixTableHead">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {organizations.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>
                                                    <i onClick={() => {
                                                        setEntryState('update')
                                                        setOrganizationEntryShown(true)
                                                        setIdToUpdate(item.id)
                                                        let temp = { name: item.name }
                                                        setOrganizationToEnter({ ...temp })
                                                    }} title="Update" className="fa fa-pencil-square-o" style={{ cursor: 'pointer' }}></i>
                                                    <i onClick={() => organizationDeleteClicked(item)} title="Delete" className="fa fa-trash" style={{ marginLeft: '10px', cursor: 'pointer' }}></i>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }

            {openTab === 'roles' &&
                <div className="UserManagement_usersTab">
                    <div className="UserManagement_usersList_TopBar">
                        <div className="UserManagement_usersList_TopBar_left">
                            <span style={{ marginLeft: '30px', fontWeight: 'bold' }}>List Of Roles</span>
                        </div>
                        <div className="UserManagement_usersList_TopBar_right">
                            <span style={{ cursor: 'pointer', padding: '5px', borderRadius: '5px', background: '#4162A6', color: 'white', fontSize: '13px' }} onClick={() => { setRoleEntryShown(!roleEntryShown);; setEntryState('add'); clearEntryStates() }}>
                                <i className="fa fa-plus"></i> New
                            </span>
                        </div>
                    </div>
                    {roleEntryShown &&
                        <div className="UserManagement_roleEntry">
                            <div className="UserManagement_roleEntry_left">
                                <div className="UserManagement_inputField">
                                    <div className="UserManagement_inputField_heading">Name</div>
                                    <div className="UserManagement_inputField_field">
                                        <input value={roleToEnter.name} onChange={(e) => roleEntry(e, 'name')} style={{ height: '100%', width: '100%', padding: '0px', boxSizing: 'border-box' }} type="text" />
                                    </div>
                                </div>
                                <div className="UserManagement_organizationEntry_addButton">
                                    <button onClick={() => submitRole()}>Submit</button>
                                </div>
                            </div>
                            <div className="UserManagement_roleEntry_right">
                                <h3 style={{ margin: '0px', marginBottom: '10px', fontSize: '13px' }}>Permissions</h3>
                                <div style={{ marginLeft: '20px' }}>
                                    {permissions.map((item, index) => {
                                        return (
                                            <div>
                                                <input checked={selectedPermissions.some((val) => { return val.id === item.id })} onClick={() => permissionsClicked(item)} type='checkbox' /> {item.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                    <div className="UserManagement_usersList">
                        <div className="fixTableHead">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {roles.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>
                                                    <i onClick={() => roleUpdateClicked(item)} title="Update" className="fa fa-pencil-square-o" style={{ cursor: 'pointer' }}></i>
                                                    <i onClick={() => roleDeleteClicked(item)} title="Delete" className="fa fa-trash" style={{ marginLeft: '10px', cursor: 'pointer' }}></i>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }


        </div>
    )
}

export default UserManagement