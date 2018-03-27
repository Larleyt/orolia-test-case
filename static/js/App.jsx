import React, { Component } from 'react';
import MPLD3 from './MPLD3'
import SimpleReactFileUpload from './file-upload.js'


const API_ROOT = "http://localhost:5000/api/files/"


function deleteData(url, item) {
  console.log(url + item)
  return fetch(url + item, {
    method: 'delete'
  })
  .then(response => response.json());
}


export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPath: null,
      items : PATH_LIST
    }

    this.showPlot = this.showPlot.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
  }

  showPlot(path) {
    if (this.state.currentPath !== path) {
      this.setState({currentPath: path})
    }
  }

  deleteElement(index, path, e) {
    this.setState({
      items: this.state.items.filter((e, i) => i !== index)
    });
    deleteData(API_ROOT, path);
  }


  render() {
    return (
      <div className="App">
        <h1>Chart Viewer</h1>
        <ul>{
          this.state.items.map((path, i) =>
            <li key= { i }>
                <a href="#" onClick={() => this.showPlot(path)}>
                  {path}
                </a>
                <a href="#" onClick={() => this.deleteElement(i, path)}>
                  &#10006;
                </a>
            </li>
          )
        }</ul>
        {this.state.currentPath !== null
        ? <MPLD3 src={API_ROOT + "?path=" + this.state.currentPath} />
        : null}
        <SimpleReactFileUpload src={API_ROOT}/>
      </div>
    );
  }
}