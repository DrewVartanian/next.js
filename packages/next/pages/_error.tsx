import React from 'react'
import Head from '../next-server/lib/head'
import { NextPageContext } from '../next-server/lib/utils'

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
}

export type ErrorProps = {
  statusCode: number
  title?: string
  styles?: { [key in keyof typeof styles]?: React.CSSProperties }
}

function _getInitialProps({
  res,
  err,
}: NextPageContext): Promise<ErrorProps> | ErrorProps {
  const statusCode =
    res && res.statusCode ? res.statusCode : err ? err.statusCode! : 404
  return { statusCode }
}

/**
 * `Error` component used for handling errors.
 */
export default class Error<P = {}> extends React.Component<P & ErrorProps> {
  static displayName = 'ErrorPage'

  static getInitialProps = _getInitialProps
  static origGetInitialProps = _getInitialProps

  render() {
    const { statusCode } = this.props

    const title =
      this.props.title ||
      statusCodes[statusCode] ||
      'An unexpected error has occurred'

    const instanceStyles = { ...styles }
    const propStyles = this.props.styles
    if (propStyles) {
      for (const element of Object.keys(instanceStyles) as Array<
        keyof typeof instanceStyles
      >) {
        if (element in propStyles) {
          instanceStyles[element] = {
            ...instanceStyles[element],
            ...propStyles[element],
          }
        }
      }
    }

    return (
      <div style={instanceStyles.error}>
        <Head>
          <title>
            {statusCode
              ? `${statusCode}: ${title}`
              : 'Application error: a client-side exception has occurred'}
          </title>
        </Head>
        <div>
          <style dangerouslySetInnerHTML={{ __html: 'body { margin: 0 }' }} />
          {statusCode ? <h1 style={instanceStyles.h1}>{statusCode}</h1> : null}
          <div style={instanceStyles.desc}>
            <h2 style={instanceStyles.h2}>
              {this.props.title || statusCode ? (
                title
              ) : (
                <>
                  Application error: a client-side exception has occurred (
                  <a href="https://nextjs.org/docs/messages/client-side-exception-occurred">
                    developer guidance
                  </a>
                  )
                </>
              )}
              .
            </h2>
          </div>
        </div>
      </div>
    )
  }
}

const styles: { [k in 'error' | 'desc' | 'h1' | 'h2']: React.CSSProperties } = {
  error: {
    color: '#000',
    background: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: '49px',
    verticalAlign: 'middle',
  },

  h1: {
    display: 'inline-block',
    borderRight: '1px solid rgba(0, 0, 0,.3)',
    margin: 0,
    marginRight: '20px',
    padding: '10px 23px 10px 0',
    fontSize: '24px',
    fontWeight: 500,
    verticalAlign: 'top',
  },

  h2: {
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },
}
