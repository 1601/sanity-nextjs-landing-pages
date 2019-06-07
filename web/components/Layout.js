/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import {LogoJsonLd} from 'next-seo'
import Header from './Header'
import Footer from './Footer'

// import {Modal, Button} from 'react-bootstrap'
// import Modal from 'react-modal'

import './all.css'
// import imageBuy from './icons/buyvs.png'
// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)'
//   }
// }

// Modal.setAppElement('#appElement')

class Layout extends React.Component {
  constructor (props) {
    super()

    this.state = {
      props: props,
      formIsOpen: false,
      public_key: '096e91e1-db80-4e10-b19c-6431c4640741',
      private_key: 'd14bb48f-8239-4dec-89ed-269056e8d7bd',
      app_id: 'ph.unosoft.sparkol-india-unosoft',
      token: '',
      type: '',
      payment_id: '',
      possible_next_action: '',
      possible_next_action_href_charge: '',
      possible_next_action_href_authorize: '',
      possible_next_action_href_capture: '',
      created: '',
      pass_luhn_validation_: false,
      encrypted_cvv: '',
      token_type: 'credit_card',
      created_state: '',
      bin_number: '',
      holder_name: '',
      card_number: '',
      expiration_date: '',
      ccv: '',
      amount: 0,
      currency: 'USD',
      paymentsOsEnv: 'test',
      idempotency_key: '123456789',
      isSuccess: false
    }
    this.handleFormOpen = this.handleFormOpen.bind(this)
    this.handleButtonSubmit = this.handleButtonSubmit.bind(this)
    this.tokenize = this.tokenize.bind(this)
    this.createPayment = this.createPayment.bind(this)
    this.authorize = this.authorize.bind(this)
    // this.charges = this.charges.bind(this)
    this.capture = this.capture.bind(this)
  }

  handleFormOpen (e) {
    e.preventDefault()
    this.setState({formIsOpen: !this.state.formIsOpen})
  }

  async handleButtonSubmit (e) {
    e.preventDefault()
    // passing the value from the form to state
    console.log(e.target.card_number.value)
    await this.setState({
      holder_name: e.target.holder_name.value,
      card_number: e.target.card_number.value,
      expiration_date: e.target.expiration_date.value,
      cvv: e.target.cvv.value,
      amount: e.target.amount.value
    })
    // calling the tokenize
    this.tokenize()
  }
  // handle tokenize

  async tokenize () {
    console.log(this.state)
    const tokenObj = await fetch('https://api.paymentsos.com/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public_key': this.state.public_key,
        'app_id': this.state.app_id,
        'api-version': '1.2.0',
        'x-payments-os-env': this.state.paymentsOsEnv

      },
      body: JSON.stringify({
        'token_type': this.state.token_type,
        'credit_card_cvv': this.state.cvv,
        'card_number': this.state.card_number,
        'expiration_date': this.state.expiration_date,
        'holder_name': this.state.holder_name
      })

    })
    const data = await tokenObj.json()
    await this.setState({token: data.token, type: data.type})
    console.log(data)
    console.log('Token result is: ' + this.state.token + 'The type is: ' + this.state.type)
    this.createPayment()
  }

  async createPayment () {
    console.log(this.state)
    const tokenObj = await fetch('https://api.paymentsos.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key': this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': '1.2.0',
        'x-payments-os-env': this.state.paymentsOsEnv

      },
      body: JSON.stringify({
        'amount': 2000, // this.state.amount,
        'currency': this.state.currency
      })
    })
    const data = await tokenObj.json()
    console.log(data)
    await this.setState({payment_id: data.id,
      possible_next_action_href_charge: data.possible_next_actions[1].href,
      possible_next_action_href_authorize: data.possible_next_actions[2].href
    })
    console.log(data)
    console.log('charge' + this.state.possible_next_action_href_charge +
                 'authorize: ' + this.state.possible_next_action_href_authorize)
    this.authorize()
  }

  async authorize () {
    console.log(this.state)
    const tokenObj = await fetch(this.state.possible_next_action_href_authorize, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key': this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': '1.2.0',
        'x-payments-os-env': this.state.paymentsOsEnv,
        'idempotency_key': this.state.idempotency_key

      },
      body: JSON.stringify({
        'payment_method': {
          'token': this.state.token,
          'type': this.state.type,
          'credit_card_cvv': this.state.ccv
        },
        'reconciliation_id': '23434534534'

      }
      )
    })
    const data = await tokenObj.json()
    console.log(data)
    // this.charges();
    this.capture()
  }
  async capture () {
    const tokenObj = await fetch('https://api.paymentsos.com/payments/' + this.state.payment_id + '/captures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key': this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': '1.2.0',
        'x-payments-os-env': this.state.paymentsOsEnv,
        'idempotency_key': this.state.idempotency_key

      }
    })
    const data = await tokenObj.json()
    console.log(data)

    await this.setState({isSuccess: true})
  }
  render () {
    const {config, children} = this.state.props
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
          <script src='https://unpkg.com/react/umd/react.production.js' crossOrigin />
        </Head>
        <div className='container' id='appElement'>
          <div id='TopMenuWrapper' style={divStyle}>
            <div className='container clearfix no-padding'>
              <div className='col-md-12'>
                <a href='https://www.sparkol.com/' id='p_lt_ctl00_TopMenu_sparkolLogo'><img style={imgStyle} src='https://www.videoscribe.co/App_Themes/Sparkol10/img/sparkol-white.png' width='150' alt='Sparkol' className='util-logo hidden-xs' /></a>
                <ul id='TopMenu' className='pull-right no-padding' style={ulStyle}>
                  <li style={liStyle}><a id='p_lt_ctl00_TopMenu_btnContact'>Contact Us</a></li>
                  <li style={liStyle}><a id='p_lt_ctl00_TopMenu_btnHelp' >Help</a></li>
                  <li style={liStyle}><a id='p_lt_ctl00_TopMenu_btnSparkolAccount' className='account'><span className='hidden-xs'>Account</span></a></li>
                  <li style={liStyle} onClick={this.handleFormOpen}><a>Buy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <Header title={title} navItems={mainNavigation} logo={logo} />
          {this.state.formIsOpen ? (
            this.state.isSuccess ? (
              <div style={paymentStyle}>
                <h1>Thank You!</h1>
                <p>Enjoy your subscription of Videoscribe.</p>
              </div>
            ) : (<form id='payment-form' onSubmit={this.handleButtonSubmit} style={paymentStyle}>
              <img src='https://i.ibb.co/MRXLGb1/buyvs.png' alt='buyvs' border='0' /> <br />
              <label>Holder Name</label>
              <input type='text' name='holder_name' value='John Mark' /> <br />
              <label>Card number</label>
              <input type='text' name='card_number' value='4111111111111111' /> <br />
              <label>Expiration date</label>
              <input type='text' name='expiration_date' value='10/29' /> <br />
              <label>CVV</label>
              <input type='text' name='cvv' value='123' /> <br />
              <label>Amount</label>
              <input type='text' name='amount' value='2000' /> <br />

              <button type='submit'>Pay You</button>
            </form>)

          )
            : (
              <></>
            )}
          <div className='content'>{children}</div>
          {/* Add Payment */}
          <Footer navItems={footerNavigation} text={footerText} />
          {logoUrl && url && <LogoJsonLd url={url} logo={logoUrl} />}
        </div>
      </>
    )
  }
}

var imgStyle = {
  marginLeft: '10%'
}

var paymentStyle = {
  display: 'block',
  textAlign: 'center'
}

var divStyle = {
  backgroundColor: '#1c202b',
  padding: '8px 0',
  borderBottom: '2px solid #6bbfdb'
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
  // eslint-disable-next-line react/no-unused-prop-types
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
