import React, { useEffect } from 'react'

const Error = ({ error, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError('')
    }, 2000)

    return () => {
      clearTimeout()
    }
  }, [setError])

  return <div className="error">{error}</div>
}

export default Error
