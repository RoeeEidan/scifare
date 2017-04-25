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


  componentDidMount() {
    document.getElementById("homePageCheckbox").checked = true
  }


  render() {
    let heroList = this.props.route.newArticleHeros;
    let filesList = []
    for (let i = 0; i < heroList.length; i++) {
      filesList.push(
        <SingleFile
          singleFileTitle={heroList[i].title}
          singleFileCredit={heroList[i].credit}
          singleFileName={heroList[i].name}
          onClick={()=>{this.props.route.removeSingleHero(i)}}
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
              <input type="button" value="Submit" onClick={this.props.route.onUploadFilesFormSubmit} />
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
          <Editor
            toolbarClassName="home-toolbar"
            wrapperClassName="home-wrapper"
            editorClassName="home-editor"
            onEditorStateChange={this.props.route.onEditorStateChange}
            toolbar={{ image: { uploadCallback: this.uploadImage } }}
          />
        </div>
        <div className="publish">
          <button onClick={this.props.route.onPublishClick}>
            publish
          </button>
        </div>
      </div>
    );
  }
}

export default App;
