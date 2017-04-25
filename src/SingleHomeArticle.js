import React, { Component } from 'react';
import './App.css';


class SingleHomeArticle extends Component {
    render(){
        console.log(this.props.removeSingleArticle)
        return(
            <ul className='SingleHomeArticle'>
                <button className="groupSingleHomeArticle" onClick={()=>{console.log("clicked")}}>
                    group
                </button>
                <li className="singleFileName">
                    {this.props.name}
                </li>
                <button className="removeSingleHomeArticlee" onClick={()=>{this.props.removeSingleArticle(this.props.index, this.props.category)}}>
                    remove
                </button>
            </ul>
        )
    }
}

export default SingleHomeArticle;