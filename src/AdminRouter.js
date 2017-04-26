import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';
import FormData from 'form-data';
import App from './App';
import HomeAdmin from './HomeAdmin';
import { AdminContainer } from './AdminContainer';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import listHomeArticles from './listHomeArticles';
import NewGroup from './NewGroup';

class AdminRouter extends Component {
  constructor() {
    super()
    this.state = {
      heroObjects: [],// {type:'' , url: '' , title:'' , credit: '' name: ''}
      allArticles:[],
      scince: [],
      health: [],
      technology: [],
      groups: [], // {name:{ masterArticle: newArticle , relatedArticles: [] }}
      newArticle: {
        heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
        title: undefined,
        name: undefined,
        articleBody: undefined,
        articleGroups: [], // group name
        category: undefined,
        date: undefined,
        showAtHomePage: true,
        summery: undefined
      },
      newGroup: {
        heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
        relatedArticles: [],
        title: undefined,
        name: undefined,
        articleBody: undefined,
        date: undefined,
        showAtHomePage: true,
        summery: undefined
      },
    }


    this.defaultNewArticleState = {
      heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
      title: undefined,
      name: undefined,
      articleBody: undefined,
      articleGroups: [], // group name
      category: undefined,
      date: undefined,
      showAtHomePage: true,
      summery: undefined
    }


    this.defaultNewGroupState = {
      heroObjects: [],// {type:'' , url: '' , title:'' , credit ''}
      relatedArticles: [],
      title: undefined,
      name: undefined,
      articleBody: undefined,
      date: undefined,
      showAtHomePage: true,
      summery: undefined
    }


    //Home
    this.postTo = this.postTo.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.onHomeUploadFilesFormSubmit = this.onHomeUploadFilesFormSubmit.bind(this);
    this.removeHomeSingleHero = this.removeHomeSingleHero.bind(this);
    this.newGroupOnClick = this.newGroupOnClick.bind(this)
    this.deepRemoveGroup = this.deepRemoveGroup.bind(this);
    this.deepCatagoryGroupRemove = this.deepCatagoryGroupRemove.bind(this);


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


    //New Group
    this.groupSingleArticle = this.groupSingleArticle.bind(this);
    this.isGrouped = this.isGrouped.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.onUploadNewGroupForm = this.onUploadNewGroupForm.bind(this);
    this.removeSingleNewGroupHero = this.removeSingleNewGroupHero.bind(this);
    this.onNewGroupTitleChange = this.onNewGroupTitleChange.bind(this);
    this.onNewGroupSummeryChange = this.onNewGroupSummeryChange.bind(this);
    this.onNewGroupEditorStateChange = this.onNewGroupEditorStateChange.bind(this);
    this.onNewGroupPublishClick = this.onNewGroupPublishClick.bind(this);
    this.resetNewGroupState = this.resetNewGroupState.bind(this);
    this.onNewGroupHomePageChange = this.onNewGroupHomePageChange.bind(this);
  }



  // NEW GROUP FUNCTIONS

  onNewGroupHomePageChange() {
    const val = document.getElementById("homePageCheckbox").checked;
    let newState = { ...this.state };
    switch (val) {
      case false:
        newState.newGroup.showAtHomePage = false;
        this.setState({
          newGroup: newState.newGroup
        })
        break;
      case true:
        newState.newGroup.showAtHomePage = true;
        this.setState({
          newGroup: newState.newGroup
        })
        break;
      default: alert("this shouldnt happen")
    }
  }


  resetNewGroupState() {
    document.getElementById("uploadFilesForm").reset();
    document.getElementById("titleInput").value = "";
    document.getElementById("summeryInput").value = "";
    let newState = { ...this.state }
    newState.newGroup = { ...this.defaultNewGroupState };
    this.setState({
      newGroup: newState.newGroup
    }, () => { console.log(this.state) })
  }


  onNewGroupPublishClick() { // ON CLICK OF PUBLISH BUTTON
    console.log("old state ", this.state)
    let nowDate = new Date();
    let date = nowDate.getDate() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getFullYear();
    let newState = { ...this.state };
    newState.newGroup.date = date;
    newState.groups.push(newState.newGroup);
    console.log("new state", newState)
    this.postTo('newArticle', newState)
    this.setState({
      groups: newState.groups,
    }, () => { console.log(this.state) })
    hashHistory.push('/');
    this.resetNewGroupState();
  }


  onNewGroupEditorStateChange(editorContent) { // ON EDITOR CHANGE 
    const articleBodyString = this.editorContentToHtml(editorContent);
    const newState = { ...this.state };
    newState.newGroup.articleBody = articleBodyString;
    this.setState({
      newGroup: newState.newGroup
    })
  };


  onNewGroupSummeryChange() {
    const text = document.getElementById("summeryInput").value;
    let newState = { ...this.state };
    newState.newGroup.summery = `${text}`;
    this.setState({
      newGroup: newState.newGroup
    })
  }


  onNewGroupTitleChange() {// LISTINING ON CHANGE OF TITLE INPUT
    const text = document.getElementById("titleInput").value;
    let newState = { ...this.state };
    newState.newGroup.title = `<h1>${text}</h1>`;
    this.setState({
      newGroup: newState.newGroup
    })
  }


  removeSingleNewGroupHero(heroIndex) { // REmoving a hero object from new article by index
    let newState = { ...this.state };
    newState.newGroup.heroObjects.splice(heroIndex, 1)
    this.setState({
      newGroup: newState.newGroup
    })
  }


  onUploadNewGroupForm() {
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
      newState.newGroup.heroObjects.push(heroObject);
      this.setState({
        newGroup: newState.newGroup
      })
      // this.uploadFile(file)
    } else {
      alert('you forgot somthing')
    }

  }


  removeGroup(index, catagory, name, groupIndex) {
    let newState = { ...this.state };
    let catagoryArray;
    switch (catagory) {
      case "Science":
        catagoryArray = newState.scince
        break;
      case "Health":
        catagoryArray = newState.health
        break;
      case "Technology":
        catagoryArray = newState.technology
        break;
      default: alert("this shouldn alert")
    }
    catagoryArray[index].articleGroups.splice(groupIndex, 1); // removing from the article itself
    for (let i = 0; i < newState.newGroup.relatedArticles.length; i++) {
      if (newState.newGroup.relatedArticles[i] === catagoryArray[index]) {
        newState.newGroup.relatedArticles.splice(i, 1) // removes the article from the group
      }
    }
  }


  isGrouped(index, catagory) {
    let name = this.state.newGroup.name;
    let newState = { ...this.state };
    let catagoryArray;
    switch (catagory) {
      case "Science":
        catagoryArray = newState.scince
        break;
      case "Health":
        catagoryArray = newState.health
        break;
      case "Technology":
        catagoryArray = newState.technology
        break;
      default: alert("this shouldn alert")
    }
    if (catagoryArray[index].articleGroups) {
      let thisGroups = catagoryArray[index].articleGroups;
      for (let i = 0; i < thisGroups.length; i++) {
        if (thisGroups[i] === name) {
          return i;
        }
      }
      return false;
    } else {
      alert("problem at AdminRouter at isGrouped Func")
    }
  }


  groupSingleArticle(index, catagory) {
    let newState = { ...this.state };
    let isGrouped = this.isGrouped(index, catagory, newState.newGroup.name); //returns either false or the index of the group
    if (isGrouped || isGrouped === 0) {
      this.removeGroup(index, catagory, newState.newGroup.name, isGrouped);
    } else {
      let thisArticle;
      switch (catagory) {
        case "Science":
          thisArticle = newState.scince[index]
          newState.scince[index].articleGroups.push(newState.newGroup.name)// pushs the group name in to the article
          break;
        case "Health":
          thisArticle = newState.health[index]
          newState.health[index].articleGroups.push(newState.newGroup.name)
          break;
        case "Technology":
          thisArticle = newState.technology[index]
          newState.technology[index].articleGroups.push(newState.newGroup.name)
          break;
        default: alert("this shouldn alert")
      }
      newState.newGroup.relatedArticles.push(thisArticle); // pushs the article to the group related array
      this.setState({
        newGroup: newState.newGroup,
        health: newState.health,
        technology: newState.technology,
        scince: newState.scince
      })
    }
    console.log(this.state);
  }


  // HOME PAGE FUNCTIONS 

  deepCatagoryGroupRemove(name, array) {
    let newArray = [...array];
    for (let i = 0; i < newArray.length; i++) {
      for (let z = 0; z < newArray[i].articleGroups.length; z++) {
        if (newArray[i].articleGroups[z] === name) {
          newArray[i].articleGroups.splice(z, 1);
        }
      }
    }
    return newArray;
  }


  deepRemoveGroup(i) {
    let groupName = this.state.groups[i].name;
    let newState = { ...this.state };
    newState.groups.splice(i, 1);
    let newScience = this.deepCatagoryGroupRemove(groupName, newState.scince);
    let newHealth = this.deepCatagoryGroupRemove(groupName, newState.health);
    let newTechnology = this.deepCatagoryGroupRemove(groupName, newState.technology);
    this.setState({
      groups: newState.groups,
      health: newHealth,
      technology: newTechnology,
      scince: newScience
    },()=>{console.log(this.state)})
  }


  newGroupOnClick() {
    let groupName = document.getElementById("groupNameInput").value;
    let newState = { ...this.state };
    newState.newGroup.name = groupName;
    this.setState({
      newGroup: newState.newGroup
    })
    hashHistory.push('/newgroup')
  }


  removeHomeSingleHero(heroIndex) { // REmoving a hero object from new article by index
    let newState = { ...this.state };
    newState.heroObjects.splice(heroIndex, 1)
    this.setState({
      heroObjects: newState.heroObjects
    })
  }


  onHomeUploadFilesFormSubmit() {
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
      newState.heroObjects.push(heroObject);
      console.log(newState)
      this.setState({
        heroObjects: newState.heroObjects
      })
      // this.uploadFile(file)
    } else {
      alert('you forgot somthing')
    }

  }


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
      scince: newState.scince,
      health: newState.health,
      technology: newState.technology,
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
    newState.newArticle = { ...this.defaultNewArticleState };
    newState.newArticle.heroObjects = [];
    this.setState({
      newArticle: newState.newArticle
    },()=>{console.log(this.state)})
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
    newState.allArticles.push(newState.newArticle);
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
      allArticles: newState.allArticles,
      health: newState.health,
      scince: newState.scince,
      technology: newState.technology
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
    return (
      <Router history={hashHistory}>
        <Route path='/' component={AdminContainer} >
          <IndexRoute component={HomeAdmin}
            onUploadFilesFormSubmit={this.onHomeUploadFilesFormSubmit}
            heroObjects={this.state.heroObjects}
            removeSingleHero={this.removeHomeSingleHero}
            scienceList={this.state.scince}
            healthList={this.state.health}
            technologyList={this.state.technology}
            removeSingleArticle={this.removeSingleArticle}
            creatNewGroup={this.newGroupOnClick}
            groupsArray={this.state.groups}
            removeGroup={this.deepRemoveGroup}
            allArticlesList={this.state.allArticles}
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
          <Route path='/newgroup' component={NewGroup}
            scienceList={this.state.scince}
            healthList={this.state.health}
            technologyList={this.state.technology}
            groupSingleArticle={this.groupSingleArticle}
            groupButtonStyle={this.isGrouped}
            newGroupleHeros={this.state.newGroup.heroObjects}
            onTitleChange={this.onNewGroupTitleChange}
            onSummeryChange={this.onNewGroupSummeryChange}
            onUploadFilesFormSubmit={this.onUploadNewGroupForm}
            editor={<Editor
              toolbarClassName="home-toolbar"
              wrapperClassName="home-wrapper"
              editorClassName="home-editor"
              onEditorStateChange={this.onNewGroupEditorStateChange}
              toolbar={{ image: { uploadCallback: this.uploadImage } }}
            />}
            onPublishClick={this.onNewGroupPublishClick}
            onHomePageChange={this.onNewGroupHomePageChange}
            removeSingleHero={this.removeSingleNewGroupHero}
          />
        </Route>
      </Router>
    )
  }
};

export default AdminRouter;