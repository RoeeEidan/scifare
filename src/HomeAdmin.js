import React, { Component } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import './App.css';

//COMPONENTS

import SingleFile from './Singlefile';



class HomeAdmin extends Component {
    constructor() {
        super()
        this.state = {
            heroObjects: [],// {type:'' , url: '' , title:'' , credit: '' name: ''}
            scince:[],
            health:[],
            technology:[],
            groupes:{},
        }
        
        this.postTo = this.postTo.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.onUploadFilesFormSubmit = this.onUploadFilesFormSubmit.bind(this);
        this.removeSingleHero = this.removeSingleHero.bind(this);
    }


    removeSingleHero(heroIndex) {
        let newState = { ...this.state };
        newState.Article.heroObjects.splice(heroIndex, 1)
        this.setState({
            Article: newState.Article
        })
    }


    onUploadFilesFormSubmit() {
        let file = document.getElementById("uploadFilesFile").files[0];
        let title = document.getElementById("uploadFilesTitle").value;
        let credit = document.getElementById("uploadFilesCredit").value;
        if (file && title && credit) {
            document.getElementById("uploadFilesForm").reset();
            let heroObject = {
                type: file.type,
                title: title,
                credit: credit,
                url: `https://s3.amazonaws.com/roeetestbucket123/${file.name}`,
                name: `${file.name}`
            };
            let newState = { ...this.state };
            newState.Article.heroObjects.push(heroObject);
            this.setState({
                Article: newState.Article
            }, console.log(this.state))
            // this.uploadFile(file)
        } else {
            alert('you forgot somthing')
        }
    }


    uploadFile(file) {
        let form = new FormData();
        form.append(`image`, file);
        this.postTo('uploads', form)
    }


    postTo(path, object) {// POST FUNC THAT TAKES PATH AND OBJECT 
        axios.post(`http://localhost:8080/${path}`, object)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let heroList = this.state.Article.heroObjects;
        let filesList = []
        for (let i = 0; i < heroList.length; i++) {
            filesList.push(
                <SingleFile
                    singleFileTitle={heroList[i].title}
                    singleFileCredit={heroList[i].credit}
                    singleFileName={heroList[i].name}
                    onClick={() => { this.removeSingleHero(i) }}
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
                            <input type="button" value="Submit" onClick={this.onUploadFilesFormSubmit} />
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
