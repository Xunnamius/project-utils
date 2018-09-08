/* @flow */

import * as React from 'react'
import Link from 'next/link' // eslint-disable-line no-unused-vars

export default class Header extends React.PureComponent<{||}> {
    render() {
        return (
            <div>
                <header>
                    <Link href="/"><a>Home</a></Link>
                    <Link href="/about"><a>About</a></Link>
                </header>
                <style jsx>{`
                    header {
                        width: 100%;
                        height: 50px;
                        padding-top: 25px;
                        background-color: rgb(115, 115, 225);
                        text-align: center;
                        text-transform: uppercase;
                    }

                    header a {
                        color: white;
                        font-weight: bold;
                        padding: 20px;
                        text-decoration: none;
                    }

                    header a:hover {
                        opacity: 0.75;
                    }
                `}</style>
            </div>
        );
    }
}
