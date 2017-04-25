import React, { Component } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import './App.css';

//COMPONENTS

import SingleFile from './Singlefile';



class HomeAdmin extends Component {
    render() {
        let heroList = this.props.route.heroObjects;
        let filesList = []
        for (let i = 0; i < heroList.length; i++) {
            filesList.push(
                <SingleFile
                    singleFileTitle={heroList[i].title}
                    singleFileCredit={heroList[i].credit}
                    singleFileName={heroList[i].name}
                    onClick={() => { this.props.route.removeSingleHero(i) }}
                />
            )
        }
        return (
            <div className="App" >
                <h1>HOME PAGE</h1>
                <div className="uploadFiles">
                    <form id='uploadFilesForm'>
                        <input
                            id='uploadFilesFile'
                            type="file"
                            accept="image/video"
                        />
                        <p>
                            image / video title: <input type='text' id='uploadFilesTitle' />
                        </p>
                        <p>
                            credit: <input type='text' id='uploadFilesCredit' />
                        </p>
                        <p>
                            <input type="button" value="Submit" onClick={this.props.route.onUploadFilesFormSubmit} />
                        </p>
                    </form>
                </div>
                <div className="listOfHeros">
                    List of Files
          {filesList}
                </div>
            </div>
        );
    }
}

export default HomeAdmin;
