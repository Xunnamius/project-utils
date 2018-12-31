/* @flow */

import * as React from 'react'
import Link from 'next/link'
import style from './style.css'

export default class Header extends React.PureComponent<{||}> {
    render() {
        return (
            <div>
                <header>
                    <Link href="/"><a>Home</a></Link>
                    <Link href="/about"><a>About</a></Link>
                </header>
                <style jsx>{style}</style>
            </div>
        );
    }
}

export { Header };
