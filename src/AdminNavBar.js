import React, { Component } from 'react';
import {Link} from 'react-router';

export class AdminNavBar extends Component {
    render() {
        return (
            <div>
                <Link to='/'>Home</Link>
                <Link to='/newarticle'>New Article</Link>
                <Link to='/newgroup'>New Group</Link>
            </div>
        );
    };
};

 