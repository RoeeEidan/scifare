import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';
import FormData from 'form-data';
import App from './App';
import HomeAdmin from './HomeAdmin';
import { AdminNavBar } from './AdminNavBar';
import { AdminContainer } from './AdminContainer';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import listHomeArticles from './listHomeArticles';

class AdminRouter extends Component {
  constructor() {
    super()
    this.state = {
      heroObjects: [],// {type:'' , url: '' , title:'' , credit: '' name: ''}
      scince: [],
      health: [],
      technology: [],
      groupes: {},
      newArticle: {
        heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
        title: undefined,
        name: undefined,
        articleBody: undefined,
        group: undefined,
        category: undefined,
        date: undefined,
        showAtHomePage: true,
        summery: undefined
      }
    }

    this.defaultNewArticleState = {
      heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
      title: undefined,
      name: undefined,
      articleBody: undefined,
      group: undefined,
      category: undefined,
      date: undefined,
      showAtHomePage: true,
      summery: undefined
    }

    //Home
    this.postTo = this.postTo.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.onUploadFilesFormSubmit = this.onUploadFilesFormSubmit.bind(this);
    this.removeSingleHero = this.removeSingleHero.bind(this);


    // new article
    this.uploadImage = this.uploadImage.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.editorContentToHtml = this.editorContentToHtml.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onPublishClick = this.onPublishClick.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onHomePageChange = this.onHomePageChange.bind(this);
    this.uploadNewArticleFile = this.uploadNewArticleFile.bind(this);
    this.onUploadFilesFormSubmit = this.onUploadFilesFormSubmit.bind(this);
    this.removeSingleHero = this.removeSingleHero.bind(this);
    this.onSummeryChange = this.onSummeryChange.bind(this);
    this.resetNewArticleState = this.resetNewArticleState.bind(this);
    this.removeSingleArticle = this.removeSingleArticle.bind(this);
  }

  // HOME PAGE FUNCTIONS 


  removeSingleArticle(i, catagory) {
    console.log(i, catagory);
    let newState = { ...this.state };
    switch (catagory) {
      case "Science":
        newState.scince.splice(i, 1);
        break;
      case "Health":
        newState.health.splice(i, 1);
        break;
      case "Technology":
        newState.technology.splice(i, 1);
        break;
        default: alert("this shouldn alert")
    }
    this.setState({
      newState,
    })
  }


  removeSingleHero(heroIndex) {
    let newState = { ...this.state };
    newState.Article.heroObjects.splice(heroIndex, 1)
    this.setState({
      Article: newState.Article
    })
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


  // NEW ARTICLE FUNCTIONS


  resetNewArticleState() {
    document.getElementById("uploadFilesForm").reset();
    document.getElementById("titleInput").value = "";
    document.getElementById("summeryInput").value = "";
    document.getElementById("homePageCheckbox").checked = true;
    document.getElementById("categoryOptions").value = "Chose a Catagory";
    let newState = { ...this.state }
    newState.newArticle = {...this.defaultNewArticleState};
    this.setState({
      newArticle: newState.newArticle
    })
  }


  onSummeryChange() {
    const text = document.getElementById("summeryInput").value;
    let newState = { ...this.state };
    newState.newArticle.summery = `${text}`;
    this.setState({
      newArticle: newState.newArticle
    })
  }


  removeSingleHero(heroIndex) { // REmoving a hero object from new article by index
    let newState = { ...this.state };
    newState.newArticle.heroObjects.splice(heroIndex, 1)
    this.setState({
      newArticle: newState.newArticle
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
      newState.newArticle.heroObjects.push(heroObject);
      this.setState({
        newArticle: newState.newArticle
      })
      // this.uploadFile(file)
    } else {
      alert('you forgot somthing')
    }
  }


  uploadNewArticleFile(file) {
    let form = new FormData();
    form.append(`image`, file);
    this.postTo('uploads', form)
  }


  onHomePageChange() {
    const val = document.getElementById("homePageCheckbox").checked;
    let newState = { ...this.state };
    switch (val) {
      case false:
        newState.newArticle.showAtHomePage = false;
        this.setState({
          newArticle: newState.newArticle
        })
        break;
      case true:
        newState.newArticle.showAtHomePage = true;
        this.setState({
          newArticle: newState.newArticle
        })
        break;
      default: alert("this shouldnt happen")
    }
  }


  onCategoryChange() {
    const category = document.getElementById("categoryOptions").value;
    let newState = { ...this.state };
    newState.newArticle.category = category;
    this.setState({
      newArticle: newState.newArticle
    })
  }


  onPublishClick() { // ON CLICK OF PUBLISH BUTTON
    console.log("old state ", this.state)
    let nowDate = new Date();
    let date = nowDate.getDate() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getFullYear();
    let newState = { ...this.state };
    newState.newArticle.date = date;
    switch (newState.newArticle.category) {
      case "Health":
        newState.health.push(newState.newArticle);
        break;
      case "Science":
        newState.scince.push(newState.newArticle);
        break;
      case "Technology":
        newState.technology.push(newState.newArticle);
        break;
      default:
        alert("looks like you didnt chose a catagory")
    }
    console.log("new state", newState)
    this.postTo('newArticle', newState)
    this.setState({
      newState,
    })
    hashHistory.push('/');
    this.resetNewArticleState();
  }


  onTitleChange() {// LISTINING ON CHANGE OF TITLE INPUT
    const text = document.getElementById("titleInput").value;
    let newState = { ...this.state };
    newState.newArticle.name = `${text}`;
    newState.newArticle.title = `<h1>${text}</h1>`;
    this.setState({
      newArticle: newState.newArticle
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
    newState.newArticle.articleBody = articleBodyString;
    this.setState({
      newArticle: newState.newArticle
    })
  };



  render() {
    console.log(<listHomeArticles />)
    const a = [{ name: 1 }, { name: 2 }]
    return (
      <Router history={hashHistory}>
        <Route path='/' component={AdminContainer} >
          <IndexRoute component={HomeAdmin}
            onUploadFilesFormSubmit={this.onUploadFilesFormSubmit}
            heroObjects={this.state.heroObjects}
            removeSingleHero={this.removeSingleHero}
            scienceList={this.state.scince}
            healthList={this.state.health}
            technologyList={this.state.technology}
            removeSingleArticle={this.removeSingleArticle}
          />
          <Route path="/newarticle" component={App}
            removeSingleHero={this.removeSingleHero}
            onUploadFilesFormSubmit={this.onUploadFilesFormSubmit}
            onCategoryChange={this.onCategoryChange}
            onPublishClick={this.onPublishClick}
            onTitleChange={this.onTitleChange}
            editorContentToHtml={this.editorContentToHtml}
            onEditorStateChange={this.onEditorStateChange}
            newArticleHeros={this.state.newArticle.heroObjects}
            onHomePageChange={this.onHomePageChange}
            onSummeryChange={this.onSummeryChange}
            editor={<Editor
              toolbarClassName="home-toolbar"
              wrapperClassName="home-wrapper"
              editorClassName="home-editor"
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{ image: { uploadCallback: this.uploadImage } }}
            />}
          />
          <Route path='/newgroup' component={listHomeArticles}
            arrayOfArticles={a} />
        </Route>
      </Router>
    )
  }
};

export default AdminRouter;