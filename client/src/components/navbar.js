import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Timetable Manager</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/" className="nav-link">Display timetable</Link>
          </li>
          <li className="navbar-item">
          <Link to="/statistics" className="nav-link">Statistics</Link>
          </li>
          <li className="navbar-item">
          <Link to="/create" className="nav-link">Create Entry</Link>
          </li>
          <li className="navbar-item">
          <Link to="/doctorlist" className="nav-link">Doctor List</Link>
          </li>
          <li className="navbar-item">
          <Link to="/cliniclist" className="nav-link">Clinic List</Link>
          </li>
          <li className="navbar-item">
          <Link to="/logout" className="nav-link">Logout user</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}