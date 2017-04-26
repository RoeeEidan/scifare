import React , {Component} from 'react';
import { AdminNavBar } from './AdminNavBar';

export class AdminContainer extends Component {
    render() {
        return (
            <div>
                <AdminNavBar />
                {this.props.children}
            </div>
        )
    }
};

