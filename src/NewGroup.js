import React, { Component } from 'react';
import SingleHomeArticle from './SingleHomeArticle';
import App from './App';
import SingleFile from './Singlefile';

import './App.css';


class NewGroup extends Component {
    constructor() {
        super()
        this.state = {
            newGroup: { heroObjects: [] }
        }
        this.arrayToRender = this.arrayToRender.bind(this);
        this.onUploadNewGroupForm = this.onUploadNewGroupForm.bind(this);
    }

    onUploadNewGroupForm() { // to keep track of the heros
        let file = document.getElementById("uploadFilesFile").files[0];
        let title = document.getElementById("uploadFilesTitle").value;
        let credit = document.getElementById("uploadFilesCredit").value;
        if (file && title && credit) {
            let heroObject = {
                type: file.type,
                title: title,
                credit: credit,
                url: `https://s3.amazonaws.com/roeetestbucket123/${file.name}`,
                name: `${file.name}`
            };
            let newState = { ...this.state };
            newState.newGroup.heroObjects.push(heroObject);
            this.setState({
                newGroup: newState.newGroup
            })
        } else {
            alert('you forgot somthing')
        }
        this.props.route.onUploadFilesFormSubmit()
    }



    arrayToRender(articles) {
        let listToRender = [];
        for (let i = 0; i < articles.length; i++) {
            listToRender.push(
                <SingleHomeArticle
                    name={articles[i].name}
                    groupSingleArticle={this.props.route.groupSingleArticle}
                    index={i}
                    category={articles[i].category}
                    groupButtonStyle={this.props.route.groupButtonStyle}
                />
            )
        }
        return (
            <div>
                {listToRender}
            </div>
        )
    }

    componentDidMount() {
        document.getElementById("homePageCheckbox").checked = true
    }

    render() {
        const scienceList = this.arrayToRender(this.props.route.scienceList); //ARTICLES LISTS
        const healthList = this.arrayToRender(this.props.route.healthList);
        const technologyList = this.arrayToRender(this.props.route.technologyList);

        // list of hero's
        let heroList = this.state.newGroup.heroObjects;
        let filesList = []
        for (let i = 0; i < heroList.length; i++) {
            filesList.push(
                <SingleFile
                    singleFileTitle={heroList[i].title}
                    singleFileCredit={heroList[i].credit}
                    singleFileName={heroList[i].name}
                    onClick={() => { 
                        this.props.route.removeSingleHero(i);
                        let newState = {...this.state};
                        newState.newGroup.heroObjects.splice(i ,1);
                        this.setState({
                            newGroup: newState.newGroup
                        })
                        }}
                />
            )
        }

        return (
            <div>
                <div>
                    Science
                        {scienceList}
                    Health
                        {healthList}
                    Technology
                        {technologyList}
                </div>
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
                            <input type="button" value="Submit" onClick={this.onUploadNewGroupForm} />
                        </p>
                    </form>
                </div>
                <div>
                    List of Files
                        {filesList}
                </div>
                <div className="titlebox">
                    <h2>title</h2>
                    <input
                        id='titleInput'
                        type='text'
                        onChange={this.props.route.onTitleChange}
                    />
                </div>
                <div className="summerybox">
                    <h2>Summery</h2>
                    <input
                        id='summeryInput'
                        type='text'
                        onChange={this.props.route.onSummeryChange}
                    />
                </div>
                <div className="showAtHomePageBox">
                    <h4>show at home page:</h4>
                    <input
                        id='homePageCheckbox'
                        type="checkbox"
                        className="homePageCheckbox"
                        onChange={this.props.route.onHomePageChange}
                    />
                </div>
                <div className="articleBodyBox" >
                    <h2>artical Body</h2>
                    {this.props.route.editor}
                </div>
                <div className="publish">
                    <button onClick={this.props.route.onPublishClick}>
                        publish
                    </button>
                </div>
            </div >

        )
    }
}

export default NewGroup;


{/*<App
                    removeSingleHero={this.props.route.removeSingleHero}
                    onUploadFilesFormSubmit={this.props.route.onUploadFilesFormSubmit}
                    onCategoryChange={this.props.route.onCategoryChange}
                    onPublishClick={this.props.route.onPublishClick}
                    onTitleChange={this.props.route.onTitleChange}
                    editorContentToHtml={this.props.route.editorContentToHtml}
                    onEditorStateChange={this.props.route.onEditorStateChange}
                    newArticleHeros={this.props.route.newArticleHeros}
                    onHomePageChange={this.props.route.onHomePageChange}
                    onSummeryChange={this.props.route.onSummeryChange}
                    editor={this.props.route.editor}
                />*/}