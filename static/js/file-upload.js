import React from 'react'
import axios, { post } from 'axios';


class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      theInputKey: null
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
    this.setState({
      theInputKey: this.fileInput.value ? this.fileInput.value : +new Date()
    })
  }
  onChange(e) {
    this.setState({file: e.target.files[0]})
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
        <input
          key={this.state.theInputKey}
          type="file"
          onChange={this.onChange}
          ref={ref => (this.fileInput = ref)}
        />
        <button type="submit">Upload</button>
      </form>
   )
  }
}


export default SimpleReactFileUpload
