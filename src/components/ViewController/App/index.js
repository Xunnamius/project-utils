import React from "react";
import {render} from "react-dom";

class App extends React.PureComponent { // eslint-disable-line no-unused-vars
    render() {
        return (
            <div>
                <h1>Hello Parcel</h1>
            </div>
        );
    }
}

render(<App />, document.getElementById("app"));
