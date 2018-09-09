/* @flow */

import * as React from 'react'
import Link from 'next/link'
import Header from '../components/view/header'

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
