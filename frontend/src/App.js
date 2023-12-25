import React from "react";
import Axios from 'axios';
import Home from './components/Home'
import Login from './components/Login'
import { Route, Routes, useParams, useNavigate, Link } from 'react-router-dom'
import SnagDashboard from './components/SnagDashboard'
import AuditDashboard from './components/AuditDashboard'
import ProjectDashboard from './components/ProjectDashboard'
import GisView from './components/GisView'
import Risks from "./components/Risks";
import Issues from "./components/Issues";
import SnagReporting from "./components/SnagReporting";
import TopBar from "./components/TopBar";
import ResetCredentials from "./components/ResetCredentials";
import ForgotPassword from "./components/ForgotPassword";
import OverviewDashboard from "./components/OverviewDashboard";
import TeamManagement from "./components/TeamManagement";
import TeamCreation from "./components/TeamCreation";
import TaskCreation from "./components/TaskCreation";
import JourneyPlan from "./components/JourneyPlan";
import AdminPanel from "./components/AdminPanel";
import WelcomePage from "./components/WelcomePage";
import ProjectEntry from "./adminSideComponents/ProjectEntry";
import ProjectTables from "./adminSideComponents/ProjectTables";
import OtdrConfig from "./adminSideComponents/OtdrConfig";
import ROWConfig from "./adminSideComponents/ROWConfig";
import FormConfig from "./adminSideComponents/FormConfig";
import AdminHome from "./superAdminComponents/AdminHome";
import UserManagement from "./superAdminComponents/UserManagement";
import FeatureConfig from "./superAdminComponents/FeatureConfig";
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
import './App.css'
//import dotenv from 'dotenv';

//require('dotenv').config()
/*const WrappedComponent = props => {
  const { id } = useParams();
  const navigate = useNavigate();

  return <AuditForm id={id} name="salman" navigate={navigate} />
}*/


const WrappedComponent = props => {
  const navigate = useNavigate();

  return <Login navigate={navigate} updatePathname={props.updatePathname} updateName={props.updateName} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentResetCredentials = props => {
  const navigate = useNavigate();

  return <ResetCredentials navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentForgotPassword = props => {
  const navigate = useNavigate();

  return <ForgotPassword navigate={navigate} />
}

const WrappedComponentSnagReporting = props => {
  const navigate = useNavigate();

  return <SnagReporting navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentOverViewDashboard = props => {
  const navigate = useNavigate();

  return <OverviewDashboard navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentGisView = props => {
  const navigate = useNavigate();

  return <GisView navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentHome = props => {
  const navigate = useNavigate();

  return <Home navigate={navigate} updatePathname={props.updatePathname} pathname={props.pathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentProjectDashboard = props => {
  const navigate = useNavigate();

  return <ProjectDashboard navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentRisks = props => {
  const navigate = useNavigate();

  return <Risks navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentIssues = props => {
  const navigate = useNavigate();

  return <Issues navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentSnagDashboard = props => {
  const navigate = useNavigate();

  return <SnagDashboard navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentAuditDashboard = props => {
  const navigate = useNavigate();

  return <AuditDashboard navigate={navigate} updatePathname={props.updatePathname} authChecker={props.authChecker} access_token_expiry={props.access_token_expiry} refresh_token_expiry={props.refresh_token_expiry} access_token={props.access_token} refresh_token={props.refresh_token} id={props.id} updateTokens={props.updateTokens} />
}

const WrappedComponentTopBar = props => {
  const navigate = useNavigate();

  return <TopBar navigate={navigate} updatePathname={props.updatePathname} updateName={props.updateName} updateTokens={props.updateTokens} pathname={props.pathname} name={props.name} />
}

class App extends React.Component {

  state = {
    pathname: '',
    name: '',
    closeSettings: false
  }

  updatePathname = (path) => {
    this.setState({ pathname: path }, () => {
      console.log(this.state.pathname)
    })
  }

  updateName = (name) => {
    this.setState({ name: name }, () => {
      console.log(this.state.name)
    })
  }

  convertTZ = (date, tzString) => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
  }

  authChecker = async (access_token_expiry, refresh_token_expiry) => {

    var now = 0;
    try {
      const res = await Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/getTimeNow');
      now = res.data
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
    var a_t = access_token_expiry;
    var r_t = refresh_token_expiry;

    // console.log('a_t_time', a_t);
    // console.log('r_t_time', r_t);

    // a_t = a_t.getTime();
    // r_t = r_t.getTime();

    console.log('now', now)
    console.log('a_t', a_t)
    console.log('r_t', r_t)

    if (now < a_t) {
      return 'a_t';
    } else if (now >= a_t && now < r_t) {

      let config = {
        headers: {
          'X-Access-Token': localStorage.getItem("access_token"),
          'X-Refresh-Token': localStorage.getItem("refresh_token"),
          'X-User-ID': localStorage.getItem("id"),
        }
      }
      try {
        const res = await Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/refresh/token', {}, config);
        localStorage.setItem("access_token_expiry", res.data.access_token_expiry);
        localStorage.setItem("refresh_token_expiry", res.data.refresh_token_expiry);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        localStorage.setItem("id", res.data.id);
        console.log('hello world', 'tokens refreshed')
        return 'a_t';
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }

    } else {
      if (r_t && a_t) {
        return 'login';
      } else {
        return 'redirect to login'
      }

    }
  }



  render() {

    return (
      <div>
        <WrappedComponentTopBar updateTokens={this.updateTokens} pathname={this.state.pathname} updateName={this.updateName} name={this.state.name} />

        <Routes>
          {localStorage.getItem('role') !== '1' &&
            <>
              <Route path="/" element={<WrappedComponent updatePathname={this.updatePathname} updateName={this.updateName} authChecker={this.authChecker} />} />
              <Route path="/resetCredentials" element={<WrappedComponentResetCredentials updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
              <Route path="/forgotPassword" element={<WrappedComponentForgotPassword />} />
              <Route path="/snagreporting" element={<WrappedComponentSnagReporting name={this.state.name} updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
              <Route path="/gis" element={<WrappedComponentGisView updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
              <Route path="/home" element={<WrappedComponentHome updatePathname={this.updatePathname} pathname={this.state.pathname} authChecker={this.authChecker} />} >
                {/* <Route path="/home" element={<WrappedComponentProjectDashboard updatePathname={this.updatePathname} authChecker={this.authChecker} access_token_expiry={this.state.access_token_expiry} refresh_token_expiry={this.state.refresh_token_expiry} access_token={this.state.access_token} refresh_token={this.state.refresh_token} id={this.state.id} updateTokens={this.updateTokens} />} /> */}
                {localStorage.getItem('cust_id') === '2' &&
                  <>
                    <Route path="/home" element={<WrappedComponentOverViewDashboard updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                    <Route path="/home/risk" element={<WrappedComponentRisks updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                    <Route path="/home/issue" element={<WrappedComponentIssues updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                    <Route path="/home/snag" element={<WrappedComponentSnagDashboard updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                    <Route path="/home/audit" element={<WrappedComponentAuditDashboard updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                  </>
                }
                {localStorage.getItem('cust_id') !== '2' &&
                  <>
                    <Route path="/home" element={<WelcomePage />} />
                    <Route path="/home/snag" element={<WrappedComponentSnagDashboard updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                    <Route path="/home/audit" element={<WrappedComponentAuditDashboard updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                  </>
                }

              </Route>
              <Route path="/teamManagement" element={<TeamManagement />}>
                <Route path="/teamManagement" element={<TeamCreation updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                <Route path="/teamManagement/taskCreation" element={<TaskCreation updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                <Route path="/teamManagement/journeyPlan" element={<JourneyPlan updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
              </Route>
              <Route path="/adminPanel" element={<AdminPanel />} >
                <Route path="/adminPanel" element={<ProjectEntry updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                <Route path="/adminPanel/projecttables" element={<ProjectTables updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                <Route path="/adminPanel/otdrconfig" element={<OtdrConfig updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                <Route path="/adminPanel/rowconfig" element={<ROWConfig updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
                <Route path="/adminPanel/formConfig" element={<FormConfig updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
              </Route>
            </>
          }
          {localStorage.getItem('role') === '1' &&
          <>
            <Route path="/" element={<WrappedComponent updatePathname={this.updatePathname} updateName={this.updateName} authChecker={this.authChecker} />} />
            <Route path="/home" element={<AdminHome />} >
              <Route path="/home" element={<UserManagement updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
              <Route path="/home/features" element={<FeatureConfig updatePathname={this.updatePathname} authChecker={this.authChecker} />} />
            </Route>
          </>
          }
        </Routes>
      </div>
    )
  }

  componentDidMount() {
    loadProgressBar()
  }
}

export default App;
