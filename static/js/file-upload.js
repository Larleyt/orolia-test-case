import React from 'react'
import axios, { post } from 'axios';


class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      file:null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e){
    e.preventDefault()
    this.fileUpload(this.state.file).then((response) => {
      this.props.addElement(e, response.data[0]["filepath"])
    })
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
  }
  fileUpload(file){
    const formData = new FormData();
    formData.append('file', file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return post(this.props.src, formData,config)
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h4>File Upload</h4>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
   )
  }
}


export default SimpleReactFileUpload
