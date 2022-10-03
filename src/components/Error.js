import React, { useEffect } from 'react'

const Error = ({ error, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError('')
    }, 2000)
  }, [setError])

  return <div className="error">{error}</div>
}

export default Error
