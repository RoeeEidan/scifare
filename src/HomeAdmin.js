import React, { Component } from 'react';
import SingleHomeArticle from './SingleHomeArticle';
import './App.css';

//COMPONENTS

import SingleFile from './Singlefile';



class HomeAdmin extends Component {
    constructor() {
        super()
        this.state = {
            newGroup: false
        }
        this.newGroup = this.newGroup.bind(this);
        this.arrayToRender = this.arrayToRender.bind(this);
    }


    newGroup() {
        this.setState({
            newGroup: true,
        })
    }


    arrayToRender(articles) {
        let listToRender = [];
        for (let i = 0; i < articles.length; i++) {
            listToRender.push(
                <SingleHomeArticle
                    name={articles[i].name}
                    removeSingleArticle={this.props.route.removeSingleArticle}
                    index={i}
                    category={articles[i].category}
                />
            )
        }
        return (
            <div>
                {listToRender}
            </div>
        )
    }




    render() {
        let groupsArray = this.props.route.groupsArray;// creating the list of groups
        let groupList = [];
        for (let i = 0; i < groupsArray.length; i++) {
            groupList.push(
                <div>
                    {groupsArray[i].name}
                    <button onClick={() => { this.props.route.removeGroup(i) }} >remove</button>
                </div>
            )
        }



        let groupVar = (<button className="newGroupButton" onClick={this.newGroup}>New Group</button>);// diplaying the new group form
        if (this.state.newGroup) {
            groupVar = (
                <form id="newGroupForm">
                    Group Name: <input type="text" id="groupNameInput" className="groupNameInput" />
                    <input type="button" value="Create" onClick={this.props.route.creatNewGroup} />
                </form>
            )
        }


        let heroList = this.props.route.heroObjects; // HOME HERO LIST
        let filesList = [];
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


        const scienceList = this.arrayToRender(this.props.route.scienceList); //ARTICLES LISTS
        const healthList = this.arrayToRender(this.props.route.healthList);
        const technologyList = this.arrayToRender(this.props.route.technologyList);
        const allArticlesList = this.arrayToRender(this.props.route.allArticlesList);


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
                        ARTICLES
                        {allArticlesList}
                    </div>
                    <div>
                        Groups
                         {groupList}
                        {groupVar}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeAdmin;
