import SingleHomeArticle from './SingleHomeArticle';
import React, { Component } from 'react';
import './App.css';


class listHomeArticles extends Component {
    render() {
        console.log(this.props.route.arrayOfArticles)
        let arrayOfArticles = this.props.route.arrayOfArticles;
        let listToRender = [];
        for (let i = 0; i < arrayOfArticles.length; i++) {
            listToRender.push(
                <SingleHomeArticle
                    name={arrayOfArticles[i].name}
                    onClick= { () => { this.props.removeSingleArticle( i ,listToRender[i].catagory) }}
                />
            )
        }
        return (
            <div>
                {listToRender}
            </div>
        )
    }
}

export default listHomeArticles;