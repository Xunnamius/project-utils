/* @flow */

import * as React from 'react'
import Link from 'next/link'
import Header from 'components/view/header'

export default class Index extends React.PureComponent<{||}> {
    render() {
        return (
            <div>
                <Header />
                {/* // Link child components must accept an onclick prop!
                <Link href="/about">
                    <a>Goto: About Page</a>
                </Link>
                */}
                <p>Goodbye Next.js!</p>
            </div>
        );
    }
}
