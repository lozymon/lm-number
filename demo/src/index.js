import React, {Component} from 'react'
import {render} from 'react-dom'

import LmNumber from '../../src'

class Demo extends Component {
    state = {
        value: '123',
    };

    onChange = (value) => {
        this.setState({value: value});
    };

    render() {
        return <div>
            <h1>lm-number Demo</h1>
            <LmNumber
                maxLength={8}
                name="react-number"
                precision={2}
                unit="R$"
                value={this.state.value}
                onChange={this.onChange}
            />
            <button onClick={() => this.setState({value:432.2})}>432</button>
        </div>
    }
}

render(<Demo/>, document.querySelector('#demo'));
