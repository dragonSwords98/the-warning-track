'use strict'
import React from 'react'
import PropTypes from 'prop-types'
function Page ({footerContent, menu, children}) {
  return (
    <span className="page-component">
      <header className="page-outline main-nav">
        { menu }
      </header>
      <div className="content">
        { children }
      </div>
      <footer className="page-outline page-footer">
        { footerContent }
      </footer>
    </span>
  )
}
Page.propTypes = {
  children: PropTypes.any.isRequired,
  footerContent: PropTypes.any.isRequired,
  menu: PropTypes.any.isRequired
}
export default Page
