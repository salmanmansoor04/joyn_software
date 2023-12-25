import React from 'react'
import Axios from 'axios'

import '../styles/Issues.css'

class Issues extends React.Component {

    state = {
        issues: [],
        issuesPersistent: [],
        filterObject: {
            ActionRequireds: [],
            Criticalitys: [],
            Duedates: [],
            Issues: [],
            logDates: [],
            loggedBys: [],
            Remarks: [],
            Statuses: [],
        },
        filterObjectPersistent: {
            ActionRequireds: [],
            Criticalitys: [],
            Duedates: [],
            Issues: [],
            logDates: [],
            loggedBys: [],
            Remarks: [],
            Statuses: [],
        },
        openFilter: '',
        showFilterIcon: ''
    }

    removeTime = (date) => {
        console.log(date);
        if(date !== null && date !== undefined){
            var d = date;
            d = d.split(' ')[0];
            return d
        }
        return
    }

    filter = () => {

        let temp = this.state.issuesPersistent;

        temp = temp.filter((val) => {
            return this.state.filterObject.Issues.includes(val['Issue'])
                && this.state.filterObject.logDates.includes(val['Log Date'])
                && this.state.filterObject.loggedBys.includes(val['Logged By'])
                && this.state.filterObject.Criticalitys.includes(val['Criticality'])
                && this.state.filterObject.ActionRequireds.includes(val['Action Required'])
                && this.state.filterObject.Duedates.includes(val['Due Date'])
                && this.state.filterObject.Statuses.includes(val['Status'])
                && this.state.filterObject.Remarks.includes(val['Remarks'])
        })

        this.setState({ issues: temp })

    }

    addToFilter = (type, val) => {

        if (type == 'Issue') {

            let temp = this.state.filterObject;

            if (temp.Issues.includes(val)) {
                temp.Issues = temp.Issues.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Issues.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }
        if (type == 'LogDate') {

            let temp = this.state.filterObject;

            if (temp.logDates.includes(val)) {
                temp.logDates = temp.logDates.filter((value) => {
                    return value !== val
                })
            } else {
                temp.logDates.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }
        if (type == 'LoggedBy') {

            let temp = this.state.filterObject;

            if (temp.loggedBys.includes(val)) {
                temp.loggedBys = temp.loggedBys.filter((value) => {
                    return value !== val
                })
            } else {
                temp.loggedBys.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }
        if (type == 'Criticality') {

            let temp = this.state.filterObject;

            if (temp.Criticalitys.includes(val)) {
                temp.Criticalitys = temp.Criticalitys.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Criticalitys.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

        if (type == 'ActionRequired') {

            let temp = this.state.filterObject;

            if (temp.ActionRequireds.includes(val)) {
                temp.ActionRequireds = temp.ActionRequireds.filter((value) => {
                    return value !== val
                })
            } else {
                temp.ActionRequireds.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

        if (type == 'DueDate') {

            let temp = this.state.filterObject;

            if (temp.Duedates.includes(val)) {
                temp.Duedates = temp.Duedates.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Duedates.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

        if (type == 'Status') {

            let temp = this.state.filterObject;

            if (temp.Statuses.includes(val)) {
                temp.Statuses = temp.Statuses.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Statuses.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

        if (type == 'Remarks') {

            let temp = this.state.filterObject;

            if (temp.Remarks.includes(val)) {
                temp.Remarks = temp.Remarks.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Remarks.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

    }

    openFilter = (type) => {
        if (this.state.openFilter == '') {
            this.setState({ openFilter: type })
        } else {
            this.setState({ openFilter: '' })
        }
    }

    selectAll = (type) => {

        if (type === 'Issue') {
            if (this.state.filterObject.Issues.length === this.state.filterObjectPersistent.Issues.length) {
                let temp = this.state.filterObject;
                temp.Issues = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Issues;
                temp.Issues = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }
        if (type === 'LogDate') {
            if (this.state.filterObject.logDates.length === this.state.filterObjectPersistent.logDates.length) {
                let temp = this.state.filterObject;
                temp.logDates = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.logDates;
                temp.logDates = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }
        if (type === 'LoggedBy') {
            if (this.state.filterObject.loggedBys.length === this.state.filterObjectPersistent.loggedBys.length) {
                let temp = this.state.filterObject;
                temp.loggedBys = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.loggedBys;
                temp.loggedBys = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }
        if (type === 'Criticality') {
            if (this.state.filterObject.Criticalitys.length === this.state.filterObjectPersistent.Criticalitys.length) {
                let temp = this.state.filterObject;
                temp.Criticalitys = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Criticalitys;
                temp.Criticalitys = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

        if (type === 'ActionRequired') {
            if (this.state.filterObject.ActionRequireds.length === this.state.filterObjectPersistent.ActionRequireds.length) {
                let temp = this.state.filterObject;
                temp.ActionRequireds = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.ActionRequireds;
                temp.ActionRequireds = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

        if (type === 'DueDate') {
            if (this.state.filterObject.Duedates.length === this.state.filterObjectPersistent.Duedates.length) {
                let temp = this.state.filterObject;
                temp.Duedates = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Duedates;
                temp.Duedates = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

        if (type === 'Status') {
            if (this.state.filterObject.Statuses.length === this.state.filterObjectPersistent.Statuses.length) {
                let temp = this.state.filterObject;
                temp.Statuses = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Statuses;
                temp.Statuses = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

        if (type === 'Remarks') {
            if (this.state.filterObject.Remarks.length === this.state.filterObjectPersistent.Remarks.length) {
                let temp = this.state.filterObject;
                temp.Remarks = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Remarks;
                temp.Remarks = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

 

    }

    render() {
        return (
            <div className='Risks_wrapper'>
                <table>
                    <thead>
                        <tr>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Issue'})}}><div className={`${this.state.showFilterIcon === 'Issue'  ? "shorten" : ""}`}>Issue</div>
                            {this.state.showFilterIcon === 'Issue' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Issue')}></i>
                            }
                                {this.state.openFilter === 'Issue' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Issue')} checked={this.state.filterObjectPersistent.Issues.length == this.state.filterObject.Issues.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Issues.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Issue', item)} checked={this.state.filterObject.Issues.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Log Date'})}}><div className={`${this.state.showFilterIcon === 'Log Date'  ? "shorten" : ""}`}>Log Date</div>
                            {this.state.showFilterIcon === 'Log Date' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('LogDate')}></i>
                            }
                                {this.state.openFilter === 'LogDate' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('LogDate')} checked={this.state.filterObjectPersistent.logDates.length == this.state.filterObject.logDates.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.logDates.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('LogDate', item)} checked={this.state.filterObject.logDates.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Logged By'})}}><div className={`${this.state.showFilterIcon === 'Logged By'  ? "shorten" : ""}`}>Logged By </div>
                            {this.state.showFilterIcon === 'Logged By' && 
                            <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('LoggedBy')}></i>
                            }
                                {this.state.openFilter === 'LoggedBy' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('LoggedBy')} checked={this.state.filterObjectPersistent.loggedBys.length == this.state.filterObject.loggedBys.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.loggedBys.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('LoggedBy', item)} checked={this.state.filterObject.loggedBys.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Criticality'})}}><div className={`${this.state.showFilterIcon === 'Criticality'  ? "shorten" : ""}`}>Criticality</div>
                            {this.state.showFilterIcon === 'Criticality' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Criticality')}></i>
                            }
                                {this.state.openFilter === 'Criticality' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Criticality')} checked={this.state.filterObjectPersistent.Criticalitys.length == this.state.filterObject.Criticalitys.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Criticalitys.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Criticality', item)} checked={this.state.filterObject.Criticalitys.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Action Required'})}}><div className={`${this.state.showFilterIcon === 'Action Required'  ? "shorten" : ""}`}>Action Required</div>
                            {this.state.showFilterIcon === 'Action Required' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('ActionRequired')}></i>
                            }
                                {this.state.openFilter === 'ActionRequired' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('ActionRequired')} checked={this.state.filterObjectPersistent.ActionRequireds.length == this.state.filterObject.ActionRequireds.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.ActionRequireds.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('ActionRequired', item)} checked={this.state.filterObject.ActionRequireds.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Due Date'})}}><div className={`${this.state.showFilterIcon === 'Due Date'  ? "shorten" : ""}`}>Due Date</div>
                            {this.state.showFilterIcon === 'Due Date' &&
                            <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('DueDate')}></i>
                            }
                                {this.state.openFilter === 'DueDate' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('DueDate')} checked={this.state.filterObjectPersistent.Duedates.length == this.state.filterObject.Duedates.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Duedates.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('DueDate', item)} checked={this.state.filterObject.Duedates.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Status'})}}><div className={`${this.state.showFilterIcon === 'Status'  ? "shorten" : ""}`}>Status</div>
                            {this.state.showFilterIcon === 'Status' &&
                            <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Status')}></i>
                            }
                                {this.state.openFilter === 'Status' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Status')} checked={this.state.filterObjectPersistent.Statuses.length == this.state.filterObject.Statuses.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Statuses.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Status', item)} checked={this.state.filterObject.Statuses.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Remarks'})}}><div className={`${this.state.showFilterIcon === 'Remarks'  ? "shorten" : ""}`}>Remarks</div>
                            {this.state.showFilterIcon === 'Remarks' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Remarks')}></i>
                            }
                                {this.state.openFilter === 'Remarks' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Remarks')} checked={this.state.filterObjectPersistent.Remarks.length == this.state.filterObject.Remarks.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Remarks.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Remarks', item)} checked={this.state.filterObject.Remarks.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.issues.map((val, index) => {
                            return (
                                <tr key={index}>
                                    <td>{val['Issue']}</td>
                                    <td>{val['Log Date']}</td>
                                    <td>{val['Logged By']}</td>
                                    <td>{val['Criticality']}</td>
                                    <td>{val['Action Required']}</td>
                                    <td>{val['Due Date']}</td>
                                    <td>{val['Status']}</td>
                                    <td>{val['Remarks']}</td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </div>
        )
    }

    async componentDidMount() {

        this.props.updatePathname(window.location.href)
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

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/issuesInit', {}, config)
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

                console.log(this.removeTime('2022-02-04 19:00:00'));

                console.log(res.data);
                let issues = res.data.issues;
                issues = issues.map((val) => {
                    val['Log Date'] = this.removeTime(val['Log Date'])
                    val['Due Date'] = this.removeTime(val['Due Date'])
                    return val
                })
                let issues2 = res.data.issues;
                issues2 = issues2.map((val) => {
                    val['Log Date'] = this.removeTime(val['Log Date'])
                    val['Due Date'] = this.removeTime(val['Due Date'])
                    return val
                })
                this.setState({ issues: issues, issuesPersistent: issues2 }, () => {

                    let temp = {
                        ActionRequireds: [],
                        Criticalitys: [],
                        Duedates: [],
                        Issues: [],
                        logDates: [],
                        loggedBys: [],
                        Remarks: [],
                        Statuses: [],
                    }
                    let temp2 = {
                        ActionRequireds: [],
                        Criticalitys: [],
                        Duedates: [],
                        Issues: [],
                        logDates: [],
                        loggedBys: [],
                        Remarks: [],
                        Statuses: [],
                    }
                    this.state.issues.forEach((val) => {
                        if (!temp.Issues.includes(val['Issue']) && !temp2.Issues.includes(val['Issue'])) {
                            temp.Issues.push(val['Issue'])
                            temp2.Issues.push(val['Issue'])
                        }
                        if (!temp.logDates.includes(val['Log Date']) && !temp2.logDates.includes(val['Log Date'])) {
                            temp.logDates.push(val['Log Date'])
                            temp2.logDates.push(val['Log Date'])
                        }
                        if (!temp.loggedBys.includes(val['Logged By']) && !temp2.loggedBys.includes(val['Logged By'])) {
                            temp.loggedBys.push(val['Logged By'])
                            temp2.loggedBys.push(val['Logged By'])
                        }
                        if (!temp.Criticalitys.includes(val['Criticality']) && !temp2.Criticalitys.includes(val['Criticality'])) {
                            temp.Criticalitys.push(val['Criticality'])
                            temp2.Criticalitys.push(val['Criticality'])
                        }
                        if (!temp.ActionRequireds.includes(val['Action Required']) && !temp2.ActionRequireds.includes(val['Action Required'])) {
                            temp.ActionRequireds.push(val['Action Required'])
                            temp2.ActionRequireds.push(val['Action Required'])
                        }
                        if (!temp.Duedates.includes(val['Due Date']) && !temp2.Duedates.includes(val['Due Date'])) {
                            temp.Duedates.push(val['Due Date'])
                            temp2.Duedates.push(val['Due Date'])
                        }
                        if (!temp.Statuses.includes(val['Status']) && !temp2.Statuses.includes(val['Status'])) {
                            temp.Statuses.push(val['Status'])
                            temp2.Statuses.push(val['Status'])
                        }

                        if (!temp.Remarks.includes(val['Remarks']) && !temp2.Remarks.includes(val['Remarks'])) {
                            temp.Remarks.push(val['Remarks'])
                            temp2.Remarks.push(val['Remarks'])
                        }
                    })

                    this.setState({ filterObject: temp, filterObjectPersistent: temp2 }, () => {
                        console.log('persistent', this.state.filterObjectPersistent)
                    })
                });


            }).catch(err => console.log(err))
    }

}

export default Issues;