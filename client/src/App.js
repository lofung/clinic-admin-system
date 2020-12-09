import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from "./components/navbar"
import DisplayTimeTable from "./components/displayTimeTable";
import CreateEntry from "./components/create-entry";
import Statistics from "./components/statistics";
import DoctorList from "./components/doctorList";
import ClinicList from "./components/clinicList";


function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={DisplayTimeTable} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/create" component={CreateEntry} />
      <Route path="/doctorlist" component={DoctorList} />
      <Route path="/cliniclist" component={ClinicList} />
      </div>
    </Router>

  );
}

export default App;
