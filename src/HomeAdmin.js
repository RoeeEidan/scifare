import React, { Component } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import SingleHomeArticle from './SingleHomeArticle';
import listHomeArticles from './listHomeArticles'
import './App.css';

//COMPONENTS

import SingleFile from './Singlefile';



class HomeAdmin extends Component {
    constructor() {
        super()

        this.arrayToRender = this.arrayToRender.bind(this);
    }
    arrayToRender(articles) {
        let listToRender = [];
        for (let i = 0; i < articles.length; i++) {
            listToRender.push(
                <SingleHomeArticle
                    name={articles[i].name}
                    removeSingleArticle={this.props.route.removeSingleArticle}
                    index = {i}
                    category = {articles[i].category}
                />
            )
        }
        return (
            <div>
                hello world
                {listToRender}
            </div>
        )
    }



    render() {
        console.log(this.props.route.removeSingleArticle)
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
        const scienceList = this.arrayToRender(this.props.route.scienceList);
        const healthList = this.arrayToRender(this.props.route.healthList);
        const technologyList = this.arrayToRender(this.props.route.technologyList);
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
                    {filesList}

                    <div>
                        Science
                        {scienceList}
                        Health
                        {healthList}
                        Technology
                        {technologyList}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeAdmin;
