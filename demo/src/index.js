import React, {Component} from 'react'
import {render} from 'react-dom'

import ReactNumber from '../../src'

class Demo extends Component {
  state = {
    value: 0,
  }

  onChange = (value) => {
    this.setState({value: value});
  }

  render() {
    return <div>
      <h1>react-number Demo</h1>
      <ReactNumber 
        name="react-number" 
        value={this.state.value} 
        onChange={this.onChange} 
      />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
