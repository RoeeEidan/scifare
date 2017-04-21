import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import App from './App';
import HomeAdmin  from './HomeAdmin'; 

const AdminRouter = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/newartical">New Article</Link></li>
      </ul>
      <hr/>
      <Route exact path="/" component={HomeAdmin}/>
      <Route path="/newartical" component={App}/>
    </div>
  </Router>
)


export default AdminRouter;