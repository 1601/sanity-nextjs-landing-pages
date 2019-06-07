import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import {LogoJsonLd} from 'next-seo'
import Header from './Header'
import Footer from './Footer'

import './all.css'

function Layout (props) {
  const {config, children} = props

  if (!config) {
    console.error('Missing config')
    return <div>Missing config</div>
  }

  const {title, mainNavigation, footerNavigation, footerText, logo, url} = config
  const logoUrl = logo && logo.asset && logo.asset.url

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width, viewport-fit=cover' />
      </Head>
      <div className='container'>
        <div id='TopMenuWrapper' style={divStyle}>
          <div className='container clearfix no-padding'>
            <div className='col-md-12'>
              <a href='https://www.sparkol.com/' id='p_lt_ctl00_TopMenu_sparkolLogo'><img style={imgStyle} src='https://www.videoscribe.co/App_Themes/Sparkol10/img/sparkol-white.png' width='150' alt='Sparkol' className='util-logo hidden-xs' /></a>
              <ul id='TopMenu' className='pull-right no-padding' style={ulStyle}>
                <li style={liStyle}><a id='p_lt_ctl00_TopMenu_btnContact'>Contact Us</a></li>
                <li style={liStyle}><a id='p_lt_ctl00_TopMenu_btnHelp' >Help</a></li>
                <li style={liStyle}><a id='p_lt_ctl00_TopMenu_btnSparkolAccount' className='account'><span className='hidden-xs'>Account</span></a></li>
              </ul>
            </div>
          </div>
        </div>
        <Header title={title} navItems={mainNavigation} logo={logo} />
        <div className='content'>{children}</div>
        <Footer navItems={footerNavigation} text={footerText} />
        {logoUrl && url && <LogoJsonLd url={url} logo={logoUrl} />}
      </div>
    </>
  )
}

var imgStyle = {
  marginLeft: '10%'
}

var divStyle = {
  backgroundColor: '#1c202b',
  padding: '8px 0',
  borderBottom: '2px solid #6bbfdb',
}

var ulStyle = {
  listStyle: 'none',
  paddingTop: '8px',
  float: 'right',
  color: 'white',
  margin: '0',
  marginTop: '7px',
  padding: '0',
  width: '25%'
}

var liStyle = {
  display: 'inline-block',
  marginRight: '10%'
}

Layout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  config: PropTypes.shape({
    title: PropTypes.string,
    mainNavigation: PropTypes.arrayOf(PropTypes.object),
    footerNavigation: PropTypes.arrayOf(PropTypes.object),
    footerText: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
      asset: PropTypes.shape({
        url: PropTypes.string
      })
    }),
    url: PropTypes.string
  })
}

export default Layout
