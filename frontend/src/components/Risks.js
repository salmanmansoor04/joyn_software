import React from 'react'

import Axios from 'axios'

import '../styles/Risks.css'



class Risks extends React.Component {

    state = {
        risks: [],
        risksPersistent: [],
        filterObject: {
            Risks: [],
            ImpactedTasks: [],
            ImpactOnProjects: [],
            Probabilitys: [],
            Mitigations: [],
            Deadlines: [],
            Statuses: [],
            Responsibilities: [],
            Duedates: [],
            Remarks: []
        },
        filterObjectPersistent: {
            Risks: [],
            ImpactedTasks: [],
            ImpactOnProjects: [],
            Probabilitys: [],
            Mitigations: [],
            Deadlines: [],
            Statuses: [],
            Responsibilities: [],
            Duedates: [],
            Remarks: []
        },
        openFilter: '',

        showFilterIcon : ''
    }

    removeTime = (date) => {
        var d = date;
        d = d.split(' ')[0];
        return d
    }

    filter = () => {

        let temp = this.state.risksPersistent;

        temp = temp.filter((val) => {
            return this.state.filterObject.Risks.includes(val['Risk'])
                && this.state.filterObject.ImpactedTasks.includes(val['Impacted Task'])
                && this.state.filterObject.ImpactOnProjects.includes(val['Impact_on_Project'])
                && this.state.filterObject.Probabilitys.includes(val['Probability'])
                && this.state.filterObject.Mitigations.includes(val['Mitigation/Contingency'])
                && this.state.filterObject.Deadlines.includes(val['Action Deadline'])
                && this.state.filterObject.Statuses.includes(val['Status'])
                && this.state.filterObject.Responsibilities.includes(val['Responsibility'])
                && this.state.filterObject.Duedates.includes(val['Due Date'])
                && this.state.filterObject.Remarks.includes(val['Remarks'])
        })

        this.setState({ risks: temp })

    }

    addToFilter = (type, val) => {

        if (type == 'Risk') {

            let temp = this.state.filterObject;

            if (temp.Risks.includes(val)) {
                temp.Risks = temp.Risks.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Risks.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }
        if (type == 'ImpactedTask') {

            let temp = this.state.filterObject;

            if (temp.ImpactedTasks.includes(val)) {
                temp.ImpactedTasks = temp.ImpactedTasks.filter((value) => {
                    return value !== val
                })
            } else {
                temp.ImpactedTasks.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }
        if (type == 'ImpactOnProject') {

            let temp = this.state.filterObject;

            if (temp.ImpactOnProjects.includes(val)) {
                temp.ImpactOnProjects = temp.ImpactOnProjects.filter((value) => {
                    return value !== val
                })
            } else {
                temp.ImpactOnProjects.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }
        if (type == 'Probability') {

            let temp = this.state.filterObject;

            if (temp.Probabilitys.includes(val)) {
                temp.Probabilitys = temp.Probabilitys.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Probabilitys.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

        if (type == 'Mitigation') {

            let temp = this.state.filterObject;

            if (temp.Mitigations.includes(val)) {
                temp.Mitigations = temp.Mitigations.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Mitigations.push(val)
            }

            this.setState({ filterObject: temp }, () => {

                console.log('persistent', this.state.filterObjectPersistent)
                console.log('current', this.state.filterObject)
                this.filter();
            })
        }

        if (type == 'Deadline') {

            let temp = this.state.filterObject;

            if (temp.Deadlines.includes(val)) {
                temp.Deadlines = temp.Deadlines.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Deadlines.push(val)
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

        if (type == 'Responsibility') {

            let temp = this.state.filterObject;

            if (temp.Responsibilities.includes(val)) {
                temp.Responsibilities = temp.Responsibilities.filter((value) => {
                    return value !== val
                })
            } else {
                temp.Responsibilities.push(val)
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

        if (type === 'Risk') {
            if (this.state.filterObject.Risks.length === this.state.filterObjectPersistent.Risks.length) {
                let temp = this.state.filterObject;
                temp.Risks = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Risks;
                temp.Risks = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }
        if (type === 'ImpactedTask') {
            if (this.state.filterObject.ImpactedTasks.length === this.state.filterObjectPersistent.ImpactedTasks.length) {
                let temp = this.state.filterObject;
                temp.ImpactedTasks = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.ImpactedTasks;
                temp.ImpactedTasks = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }
        if (type === 'ImpactOnProject') {
            if (this.state.filterObject.ImpactOnProjects.length === this.state.filterObjectPersistent.ImpactOnProjects.length) {
                let temp = this.state.filterObject;
                temp.ImpactOnProjects = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.ImpactOnProjects;
                temp.ImpactOnProjects = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }
        if (type === 'Probability') {
            if (this.state.filterObject.Probabilitys.length === this.state.filterObjectPersistent.Probabilitys.length) {
                let temp = this.state.filterObject;
                temp.Probabilitys = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Probabilitys;
                temp.Probabilitys = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

        if (type === 'Mitigation') {
            if (this.state.filterObject.Mitigations.length === this.state.filterObjectPersistent.Mitigations.length) {
                let temp = this.state.filterObject;
                temp.Mitigations = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Mitigations;
                temp.Mitigations = temp2;
                this.setState({ filterObject: temp })
            }

            console.log('persistent', this.state.filterObjectPersistent)
            console.log('current', this.state.filterObject)
            this.filter();

        }

        if (type === 'Deadline') {
            if (this.state.filterObject.Deadlines.length === this.state.filterObjectPersistent.Deadlines.length) {
                let temp = this.state.filterObject;
                temp.Deadlines = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Deadlines;
                temp.Deadlines = temp2;
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

        if (type === 'Responsibility') {
            if (this.state.filterObject.Responsibilities.length === this.state.filterObjectPersistent.Responsibilities.length) {
                let temp = this.state.filterObject;
                temp.Responsibilities = []
                this.setState({ filterObject: temp })
            } else {
                let temp = this.state.filterObject;
                let temp2 = this.state.filterObjectPersistent.Responsibilities;
                temp.Responsibilities = temp2;
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
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Risk'})}}><div className={`${this.state.showFilterIcon === 'Risk'  ? "shorten" : ""}`}>Risk</div>
                                {this.state.showFilterIcon === 'Risk' &&
                                    <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Risk')}></i>
                                }
                                {this.state.openFilter === 'Risk' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Risk')} checked={this.state.filterObjectPersistent.Risks.length == this.state.filterObject.Risks.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Risks.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Risk', item)} checked={this.state.filterObject.Risks.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Impacted Task'})}}><div className={`${this.state.showFilterIcon === 'Impacted Task'  ? "shorten" : ""}`}>Impacted Task</div> 
                            {this.state.showFilterIcon === 'Impacted Task' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('ImpactedTask')}></i>
                            }
                            
                                {this.state.openFilter === 'ImpactedTask' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('ImpactedTask')} checked={this.state.filterObjectPersistent.ImpactedTasks.length == this.state.filterObject.ImpactedTasks.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.ImpactedTasks.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('ImpactedTask', item)} checked={this.state.filterObject.ImpactedTasks.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Impact On Project'})}}><div className={`${this.state.showFilterIcon === 'Impact On Project'  ? "shorten" : ""}`}>Impact On Project</div>
                            {this.state.showFilterIcon === 'Impact On Project' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('ImpactOnProject')}></i>
                            }
                                {this.state.openFilter === 'ImpactOnProject' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('ImpactOnProject')} checked={this.state.filterObjectPersistent.ImpactOnProjects.length == this.state.filterObject.ImpactOnProjects.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.ImpactOnProjects.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('ImpactOnProject', item)} checked={this.state.filterObject.ImpactOnProjects.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Probability'})}}><div className={`${this.state.showFilterIcon === 'Probability'  ? "shorten" : ""}`}>Probability</div>
                            {this.state.showFilterIcon === 'Probability' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Probability')}></i>
                            }
                                {this.state.openFilter === 'Probability' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Probability')} checked={this.state.filterObjectPersistent.Probabilitys.length == this.state.filterObject.Probabilitys.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Probabilitys.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Probability', item)} checked={this.state.filterObject.Probabilitys.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Mitigation/Contingency'})}}><div className={`${this.state.showFilterIcon === 'Mitigation/Contingency'  ? "shorten" : ""}`}>Mitigation/Contingency</div>
                            {this.state.showFilterIcon === 'Mitigation/Contingency' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Mitigation')}></i>
                            }
                                {this.state.openFilter === 'Mitigation' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Mitigation')} checked={this.state.filterObjectPersistent.Mitigations.length == this.state.filterObject.Mitigations.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Mitigations.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Mitigation', item)} checked={this.state.filterObject.Mitigations.includes(item)} /> {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </th>
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Action Deadline'})}}><div className={`${this.state.showFilterIcon === 'Action Deadline'  ? "shorten" : ""}`}>Action Deadline</div>
                            {this.state.showFilterIcon === 'Action Deadline' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Deadline')}></i>
                            }
                                {this.state.openFilter === 'Deadline' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Deadline')} checked={this.state.filterObjectPersistent.Deadlines.length == this.state.filterObject.Deadlines.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Deadlines.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Deadline', item)} checked={this.state.filterObject.Deadlines.includes(item)} /> {item}
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
                            <th onMouseLeave={() => {this.setState({showFilterIcon: '', openFilter: ''})}} onMouseOver={() => {this.setState({showFilterIcon: 'Responsibility'})}}><div className={`${this.state.showFilterIcon === 'Responsibility'  ? "shorten" : ""}`}>Responsibility</div>
                            {this.state.showFilterIcon === 'Responsibility' &&
                                <i className="fa fa-ellipsis-v filterIcon" style={{ cursor: 'pointer' }} onClick={() => this.openFilter('Responsibility')}></i>
                            }
                                {this.state.openFilter === 'Responsibility' &&
                                    <div className='filterBox'>
                                        {/* <div style={{ textAlign: 'center', width: '100%' }}>
                                            <input type="text" placeholder='search' onChange={(e) => this.search(e, 'category')} style={{ display: 'inline-block', width: '80%' }} />
                                        </div> */}
                                        <div>
                                            <input type="checkbox" onChange={() => this.selectAll('Responsibility')} checked={this.state.filterObjectPersistent.Responsibilities.length == this.state.filterObject.Responsibilities.length} /> Select All
                                        </div>
                                        {this.state.filterObjectPersistent.Responsibilities.map((item, index) => {
                                            return (
                                                <div className='filterBoxInner' title={item} key={index}>
                                                    <input type="checkbox" onChange={() => this.addToFilter('Responsibility', item)} checked={this.state.filterObject.Responsibilities.includes(item)} /> {item}
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
                        {this.state.risks.map((val, index) => {
                            return (
                                <tr key={index}>
                                    <td>{val['Risk']}</td>
                                    <td>{val['Impacted Task']}</td>
                                    <td>{val['Impact_on_Project']}</td>
                                    <td>{val['Probability']}</td>
                                    <td>{val['Mitigation/Contingency']}</td>
                                    <td>{val['Action Deadline']}</td>
                                    <td>{val['Status']}</td>
                                    <td>{val['Responsibility']}</td>
                                    <td>{val['Due Date']}</td>
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

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/risksInit', {}, config)
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

                console.log(res.data);
                let risks = res.data.risks;
                risks = risks.map((val) => {
                    if(val['Action Deadline'] != null){
                        val['Action Deadline'] = this.removeTime(val['Action Deadline'])
                    }
                    if(val['Due Date'] != null){
                        val['Due Date'] = this.removeTime(val['Due Date'])
                    }
                    return val
                })
                let risks2 = res.data.risks;
                this.setState({ risks: risks, risksPersistent: risks2 }, () => {

                    let temp = {
                        Risks: [], ImpactedTasks: [], ImpactOnProjects: [], Probabilitys: [], Mitigations: [], Deadlines: [], Statuses: [], Responsibilities: [], Duedates: [], Remarks: []
                    }
                    let temp2 = {
                        Risks: [], ImpactedTasks: [], ImpactOnProjects: [], Probabilitys: [], Mitigations: [], Deadlines: [], Statuses: [], Responsibilities: [], Duedates: [], Remarks: []
                    }
                    this.state.risks.forEach((val) => {
                        if (!temp.Risks.includes(val['Risk']) && !temp2.Risks.includes(val['Risk'])) {
                            temp.Risks.push(val['Risk'])
                            temp2.Risks.push(val['Risk'])
                        }
                        if (!temp.ImpactedTasks.includes(val['Impacted Task']) && !temp2.ImpactedTasks.includes(val['Impacted Task'])) {
                            temp.ImpactedTasks.push(val['Impacted Task'])
                            temp2.ImpactedTasks.push(val['Impacted Task'])
                        }
                        if (!temp.ImpactOnProjects.includes(val['Impact_on_Project']) && !temp2.ImpactOnProjects.includes(val['Impact on Project'])) {
                            temp.ImpactOnProjects.push(val['Impact_on_Project'])
                            temp2.ImpactOnProjects.push(val['Impact_on_Project'])
                        }
                        if (!temp.Probabilitys.includes(val['Probability']) && !temp2.Probabilitys.includes(val['Probability'])) {
                            temp.Probabilitys.push(val['Probability'])
                            temp2.Probabilitys.push(val['Probability'])
                        }
                        if (!temp.Mitigations.includes(val['Mitigation/Contingency']) && !temp2.Mitigations.includes(val['Mitigation/Contingency'])) {
                            temp.Mitigations.push(val['Mitigation/Contingency'])
                            temp2.Mitigations.push(val['Mitigation/Contingency'])
                        }
                        if (!temp.Deadlines.includes(val['Action Deadline']) && !temp2.Deadlines.includes(val['Action Deadline'])) {
                            temp.Deadlines.push(val['Action Deadline'])
                            temp2.Deadlines.push(val['Action Deadline'])
                        }
                        if (!temp.Statuses.includes(val['Status']) && !temp2.Statuses.includes(val['Status'])) {
                            temp.Statuses.push(val['Status'])
                            temp2.Statuses.push(val['Status'])
                        }
                        if (!temp.Responsibilities.includes(val['Responsibility']) && !temp2.Responsibilities.includes(val['Responsibility'])) {
                            temp.Responsibilities.push(val['Responsibility'])
                            temp2.Responsibilities.push(val['Responsibility'])
                        }
                        if (!temp.Duedates.includes(val['Due Date']) && !temp2.Duedates.includes(val['Due Date'])) {
                            temp.Duedates.push(val['Due Date'])
                            temp2.Duedates.push(val['Due Date'])
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

export default Risks;