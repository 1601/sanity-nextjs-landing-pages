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
// }npm

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
      plan: '',
      email: '',
      ccv: '',
      amount: 35,
      currency: 'USD',
      order_id: 'VS-SPARKOL-1',
      customer_id: '',
      paymentsOsEnv: 'test',
      idempotency_key: '123456789',
      error: '',
      ccAlert: '',
      cvvAlert: '',
      emailAlert: '',
      expiration_dateAlert: '',
      holderNameAlert: '',
      isPaymentNotDone: true
    }
    this.handleFormOpen = this.handleFormOpen.bind(this)
    this.handleButtonSubmit = this.handleButtonSubmit.bind(this)
    this.tokenize = this.tokenize.bind(this)
    this.createPayment = this.createPayment.bind(this)
    this.authorize = this.authorize.bind(this)
    // this.charges = this.charges.bind(this)
    this.createCustomer = this.createCustomer.bind(this)
    this.capture = this.capture.bind(this)

    this.handleCCNumber = this.handleCCNumber.bind(this)
    this.handlePlans = this.handlePlans.bind(this)

    this.handleHolderName = this.handleHolderName.bind(this)
    this.handleExpirationDate = this.handleExpirationDate.bind(this)
    this.handleCVV = this.handleCVV.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
  }

  handleHolderName (e) {
    e.preventDefault()
    if (e.target.value.length > 0) {
      this.setState({holderNameAlert: 'valid'})
    } else {
      this.setState({holderNameAlert: 'invalid'})
    }
  }

  handleExpirationDate (e) {
    e.preventDefault()
    if (e.target.value.length > 3) {
      this.setState({expiration_dateAlert: 'valid'})
    } else {
      this.setState({expiration_dateAlert: 'invalid'})
    }
  }

  handleCVV (e) {
    e.preventDefault()
    if (e.target.value.length === 3) {
      this.setState({cvvAlert: 'valid'})
    } else {
      this.setState({cvvAlert: 'invalid'})
    }
  }

  handleEmail (e) {
    e.preventDefault()
    if (e.target.value.length > 3) {
      this.setState({emailAlert: 'valid'})
    } else {
      this.setState({emailAlert: 'invalid'})
    }
  }

  handleFormOpen (e) {
    e.preventDefault()
    this.setState({formIsOpen: !this.state.formIsOpen,
      isPaymentNotDone: true})
  }

  async handleButtonSubmit (e) {
    e.preventDefault()
     //triggered processing
     this.setState({isProcessing:true})
    // passing the value from the form to state
    console.log(e.target.card_number.value)
    await this.setState({
      holder_name: e.target.holder_name.value || '',
      card_number: e.target.card_number.value || '',
      expiration_date: e.target.expiration_date.value || '',
      cvv: e.target.cvv.value || '',
      amount: e.target.amount.value || 0,
      email: e.target.email.value || '',
      plan: e.target.plan.value || ''
    })

    console.log('checker' - this.state.holder_name)

    // validation for null
    if (this.state.holder_name === '' && this.state.card_number === '' && this.state.expiration_date === '' && this.state.ccv === '' && this.state.email === '') {
      alert('Try Again - form invalid')
    } else {
      //  calling the tokenize
      this.tokenize()
    }
    // // calling the tokenize
    // this.tokenize()
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

    if (data.more_info) {
      alert(data.more_info)
    } else {
      console.log('Token result is: ' + this.state.token + 'The type is: ' + this.state.type)
      // this.createPayment()
      alert('Tokenization Successful')
      this.createCustomer()
    }
  }

  async createCustomer () {
    console.log(this.state.email)
    const tokenObj = await fetch('https://api.paymentsos.com/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key': this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': '1.2.0',
        'x-payments-os-env': this.state.paymentsOsEnv

      },
      body: JSON.stringify({
        'customer_reference': Math.random() + '1234451112233',
        'email': this.state.email
      })

    })
    const data = await tokenObj.json()
    console.log('success created')
    await this.setState({customer_id: data.id})
    console.log(data.id)
    // console.log('Token result is: ' + this.state.token + 'The type is: ' + this.state.type)
    alert('Customer Creation Successful')
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
        'amount': Number(this.state.amount + '00'),
        'currency': this.state.currency,
        'order': {
          'id': this.state.order_id
        },
        'customer_id': this.state.customer_id,
        'additional_details':
        {
          'id': this.state.id,
          'plan': this.state.plan,
          'payment': this.state.currency + this.state.amount
        }
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

    alert('Payment Sent')
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
    alert('Transaction Authorized')
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
    alert('Transaction Successful')
    this.setState({isPaymentNotDone: false})
    console.log(data)
    this.setState({isSuccess:true})
  }

  // visa 4111111111111111 or mastercard 5555555555554444 validation
  handleCCNumber (event) {
    console.log(event.target.value.charAt(0))

    if (event.target.value.length === 16 && event.target.value.charAt(0) === '4') {
      this.setState({ccAlert: 'Visa'})
    } else if (event.target.value.length === 16 && String(event.target.value).charAt(0) === '5') {
      this.setState({ccAlert: 'MasterCard'})
    } else {
      this.setState({ccAlert: `${event.target.value.length - 16} - UnknownCardNumber`})
    }
  }

  // state changing of amount via monthly plan
  handlePlans (event) {
    console.log(event.target.value)

    switch (event.target.value) {
      case 'Monthly-Plan':
        this.setState({amount: 35})
        break
      case 'Yearly-Plan':
        this.setState({amount: 14})
        break
      case 'One-Off':
        this.setState({amount: 800})
        break
      default:
        break
    }
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
            this.state.isPaymentNotDone ? (
              <form id='payment-form' onSubmit={this.handleButtonSubmit} style={formStyle}>
                <img src='https://i.ibb.co/MRXLGb1/buyvs.png' alt='buyvs' border='0' /> <br />
                <label>Holder Name</label>
                <input type='text' name='holder_name' placeholder='FirstName LastName' onChange={this.handleHolderName} /> <span style={ccNumberStyle}>{this.state.holderNameAlert}</span> <br />
                <label>Card number</label>
                <input type='number' name='card_number' placeholder='4111111111111111' onChange={this.handleCCNumber} />  <span style={ccNumberStyle}>{this.state.ccAlert}</span> <br />
                <label>Expiration date</label>
                <input type='text' name='expiration_date' placeholder='10/29' onChange={this.handleExpirationDate} /> <span style={ccNumberStyle}>{this.state.expiration_dateAlert}</span> <br />
                <label>CVV</label>
                <input type='text' name='cvv' placeholder='123' onChange={this.handleCVV} /> <span style={ccNumberStyle}>{this.state.cvvAlert}</span> <br />
                <label>Email</label>
                <input type='text' name='email' placeholder='email@email.com' onChange={this.handleEmail} /> <span style={ccNumberStyle}>{this.state.emailAlert}</span> <br />
                <label>Plan</label>
                <select name='plan' onChange={this.handlePlans}>
                  <option value='Monthly-Plan'>Monthly Plan</option>
                  <option value='Yearly-Plan'>Yearly Plan</option>
                  <option value='One-Off'>One-Off</option>
                </select><br />
                <label>Amount</label>
                <input type='text' name='amount' placeholder='14' value={this.state.amount} readOnly /><br />
                <button type='submit'>Pay You</button> <br />
                <p>{this.state.error}</p>
              </form>
            ) : (
              <div style={formStyle} >
                <h1> Thank you for subscribing to Sparkol Videoscribe </h1>
                <h6> Have fun. </h6>
              </div>
            )
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

var ccNumberStyle = {
  fontSize: '10px',
  fontStyle: 'italic',
  color: 'gray'
}

var formStyle = {
  display: 'block',
  textAlign: 'center'
}

var imgStyle = {
  marginLeft: '10%'
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
  width: '40%'
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
