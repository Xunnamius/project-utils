/* @flow */

import * as React from 'react'
import Link from 'next/link'

export default class Index extends React.PureComponent<{||}> {
    render() {
        return (
            <div>
                <Link href="/about">
                    <a>Goto: About Page</a>
                </Link>
                <p>Hello Next.js!</p>
            </div>
        );
    }
}
