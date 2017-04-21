import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import FormData from 'form-data';
import './App.css';

//COMPONENTS

import SingleFile from './Singlefile';



class App extends Component {
  constructor() {
    super()
    this.state = {
      Article: {
        heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
        title: false,
        articleBody: false,
        group: false,
        category: false,
        date: false,
        showAtHomePage: true,
      }
    }
    this.uploadImage = this.uploadImage.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.editorContentToHtml = this.editorContentToHtml.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onPublishClick = this.onPublishClick.bind(this);
    this.postTo = this.postTo.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onHomePageChange = this.onHomePageChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.onUploadFilesFormSubmit = this.onUploadFilesFormSubmit.bind(this);
    this.removeSingleHero = this.removeSingleHero.bind(this);
  }


  removeSingleHero(heroIndex){ 
    let newState = {...this.state};
    newState.Article.heroObjects.splice(heroIndex , 1)
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
    }else{
      alert('you forgot somthing')
    }
  }


  uploadFile(file) {
    let form = new FormData();
    form.append(`image`, file);
    this.postTo('uploads', form)
  }


  onHomePageChange() {
    const val = document.getElementById("homePageCheckbox").checked;
    console.log({ val })
    let newState = { ...this.state };
    switch (val) {
      case false:
        newState.Article.showAtHomePage = false;
        this.setState({
          Article: newState.Article
        })
        break;
      case true:
        newState.Article.showAtHomePage = true;
        this.setState({
          Article: newState.Article
        })
        break;
    }
  }


  onCategoryChange() {
    const category = document.getElementById("categoryOptions").value;
    let newState = { ...this.state };
    newState.Article.category = category;
    this.setState({
      Article: newState.Article
    })
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


  onPublishClick() { // ON CLICK OF PUBLISH BUTTON
    let nowDate = new Date();
    let date = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();
    let newState = { ...this.state };
    newState.Article.date = date;
    this.setState({
      Article: newState.Article
    }, () => {
      this.postTo('newArticle', this.state)
    })
  }


  onTitleChange() {// LISTINING ON CHANGE OF TITLE INPUT
    const text = document.getElementById("titleInput").value;
    let newState = { ...this.state };
    newState.Article.title = `<h1>${text}</h1>`;
    this.setState({
      Article: newState.Article
    })
  }


  uploadImage(file) { // UPLOAD IMAGE TO WHYSIWHYS 
    var form = new FormData();
    form.append('image', file);
    axios.post('http://localhost:8080/uploads', form)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    return new Promise(
      (resolve, reject) => {
        resolve({ data: { link: `https://s3.amazonaws.com/roeetestbucket123/${file.name}` } });
      }
    )
  };


  editorContentToHtml(editorContent) {  // TO HTML STRING
    const rawContentState = convertToRaw(editorContent.getCurrentContent());
    const markup = draftToHtml(rawContentState);
    console.log(markup)
    return markup;
  };


  onEditorStateChange(editorContent) { // ON EDITOR CHANGE 
    const articleBodyString = this.editorContentToHtml(editorContent);
    const newState = { ...this.state };
    newState.Article.articleBody = articleBodyString;
    this.setState({
      Article: newState.Article
    })
  };
  componentDidMount() {
    document.getElementById("homePageCheckbox").checked = true
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
          onClick={()=>{this.removeSingleHero(i)}}
        />
      )
    }
    return (
      <div className="App" >
        <h1>NEW ARTICAL</h1>
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
        <div className="titlebox">
          <h2>title</h2>
          <input
            id='titleInput'
            type='text'
            onChange={this.onTitleChange}
          />
        </div>
        <div className="showAtHomePageBox">
          <h4>show at home page:</h4>
          <input
            id='homePageCheckbox'
            type="checkbox"
            className="homePageCheckbox"
            onChange={this.onHomePageChange}
          />
        </div>
        <div className="categoryBox">
          <h3>Category</h3>
          <select id='categoryOptions' onChange={this.onCategoryChange}>
            <option>Chose a Category</option>
            <option value="Science">Science</option>
            <option value="Health">Health</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        <div className="articleBodyBox" >
          <h2>artical Body</h2>
          <Editor
            toolbarClassName="home-toolbar"
            wrapperClassName="home-wrapper"
            editorClassName="home-editor"
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{ image: { uploadCallback: this.uploadImage } }}
          />
        </div>
        <div className="publish">
          <button onClick={this.onPublishClick}>
            publish
          </button>
        </div>
      </div>
    );
  }
}

export default App;
