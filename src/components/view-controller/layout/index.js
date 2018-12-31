/* @flow */

import * as React from 'react';
import {render} from 'react-dom';

class App extends React.PureComponent<{||}> {
    render() {
        return (
            <div>
                <h1>Hello, Webpack!</h1>
            </div>
        );
    }
}

let root: ?Element = document.getElementById('app');

if(!root)
    throw 'root (Element) cannot be null';

render(<App />, root);
