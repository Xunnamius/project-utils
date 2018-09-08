/* @flow */

import * as React from 'react'
import Link from 'next/link' // eslint-disable-line no-unused-vars
import Header from '../components/view/header' // eslint-disable-line no-unused-vars

export default class About extends React.PureComponent<{||}> {
    render() {
        return (
            <div>
                <Header />
                <p>This is the about page!</p>
            </div>
        );
    }
}
