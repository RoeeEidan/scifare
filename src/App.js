import React, { Component } from 'react';
import './App.css';

//COMPONENTS

import SingleFile from './Singlefile';



class App extends Component {
  constructor() {
    super()
    this.state = {
      newArticle: { heroObjects: [] }
    }
    this.onUploadFilesFormSubmit = this.onUploadFilesFormSubmit.bind(this);
  }


  onUploadFilesFormSubmit() {
    console.log('Runingggg')
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
      let newState = {...this.state};
      newState.newArticle.heroObjects.push(heroObject);
      this.setState({
        newArticle: newState.newArticle
      })
      // this.uploadFile(file)
    } else {
      alert('you forgot somthing')
    }
    this.props.route.onUploadFilesFormSubmit();
  }


  componentDidMount() {
    document.getElementById("homePageCheckbox").checked = true
  }
  componentWillMount() {
    console.log(this.props.route.newArticleHeros)
  }



  render() {
    let heroList = this.state.newArticle.heroObjects;
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
            newState.newArticle.heroObjects.splice(i,1);
            this.setState({
              newArticle: newState.newArticle
            })
           }}
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
        <div className="categoryBox">
          <h3>Category</h3>
          <select id='categoryOptions' onChange={this.props.route.onCategoryChange}>
            <option>Chose a Category</option>
            <option value="Science">Science</option>
            <option value="Health">Health</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        <div className="articleBodyBox" >
          <h2>artical Body</h2>
          {this.props.route.editor}
        </div>
        <div className="publish">
          <button onClick={()=>{
            this.props.route.onPublishClick();
            let newState = {...this.state};
            newState.newArticle.heroObjects = [];
            this.setState({
              newArticle: newState.newArticle,
            })
            }}>
            publish
          </button>
        </div>
      </div>
    );
  }
}

export default App;
