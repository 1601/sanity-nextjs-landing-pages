import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {withRouter} from 'next/router'
import styles from './Footer.module.css'
import SimpleBlockContent from './SimpleBlockContent'

function Footer (props) {
  const {navItems, text, router} = props
  return (
    <div className={`footerSparkol ${styles.root}`}>
      <nav>
        <ul className={styles.items}>
          {navItems &&
            navItems.map(item => {
              const isActive =
                router.pathname === '/LandingPage' && router.query.slug === item.slug.current
              return (
                <li key={item._id} className={styles.item}>
                  <Link
                    href={{
                      pathname: '/LandingPage',
                      query: {slug: item.slug.current}
                    }}
                    as={`/${item.slug.current}`}
                    prefetch
                  >
                    <a data-is-active={isActive ? 'true' : 'false'}>{item.title}</a>
                  </Link>
                </li>
              )
            })}
        </ul>
      </nav>
      <div className={styles.text}>
        <img alt='Sparkol logo' src='https://www.videoscribe.co/App_Themes/Sparkol10/img/sparkol-white.png' width='200' />
        <SimpleBlockContent blocks={text} />
      </div>
    </div>
  )
}

Footer.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.shape({
        current: PropTypes.string
      }).isRequired
    })
  ),
  text: PropTypes.arrayOf(PropTypes.object),
  router: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.shape({
      slug: PropTypes.string
    })
  })
}

export default withRouter(Footer)
