'use strict'
import React from 'react'
function LoadingOverlay ({ msg='Loading...' }) {
  return (
    <div className="loading content">
      { msg }
    </div>
  )
}
export default LoadingOverlay
