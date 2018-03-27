import React, { Component } from 'react';


function fetchPlot(src){
    fetch(src, {
      method: 'GET',
      mode:'no-cors',
      dataType: 'json'
    })
      .then(r => r.json())
      .then(r => {
        mpld3.draw_figure("chart", r)
      })
      .catch(err => console.log(err))
  }


export default class MPLD3 extends Component {
  componentDidMount() {
    fetchPlot(this.props.src)
  }

  componentWillReceiveProps(nextProps) {
    fetchPlot(nextProps.src)
  }

  render() {
    return <div key={this.props.src} id="chart" />;
  }
}
