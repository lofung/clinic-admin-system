import React from 'react';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from "./components/navbar"
import DisplayTimeTable from "./components/displayTimeTable";
import CreateEntry from "./components/create-entry";
import Statistics from "./components/statistics";
import DoctorList from "./components/doctorList";
import ClinicList from "./components/clinicList";


function App() {

  const [userName, setUserName] = useState("jjj");
  const [isAdmin, setIsAdmin] = useState(true);
  
  const fetchLoginData = async () => {
    try {
       const loginData = await (await fetch("http://localhost:5000/authDetails")).json()
       console.log("login data is " + JSON.stringify(loginData))
    } catch (err) {
      console.error(err)
    }

  }

  useEffect(() => {
    fetchLoginData();
  }, [])

  return (
    <Router>
      <div className="container">
      <Navbar sessionIsAdmin={isAdmin} sessionDisplayName={userName} />
      <br/>
      {/* old routes for record and roll back
      <Route path="/statistics" component={Statistics} />
      <Route path="/doctorlist" component={DoctorList} isAdmin={isAdmin} displayName={userName} />
      <Route path="/cliniclist" component={ClinicList} isAdmin={isAdmin} displayName={userName} />  
      */}
      <Route path="/" exact component={() => <DisplayTimeTable sessionIsAdmin={isAdmin} sessionDisplayName={userName} />} />
      <Route path="/create" component={() => <CreateEntry sessionIsAdmin={isAdmin} sessionDisplayName={userName} />} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/doctorlist" component={() => <DoctorList sessionIsAdmin={isAdmin} sessionDisplayName={userName}  />}/>
      <Route path="/cliniclist" component={() => <ClinicList sessionIsAdmin={isAdmin} sessionDisplayName={userName}  />} /> 
     
      </div>
    </Router>

  );
}

export default App;
