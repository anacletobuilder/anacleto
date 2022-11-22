import React, { useState, useEffect } from 'react'
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom'
import { auth } from './config/firebase-config'
import MemoApplicationBuilder from './applicationbuilder/applicationBuilder'
import Login from './login/login'
import { logout } from './login/loginUtils'
import Registration from './login/registration'
import ErrorPage from './components/errorPage'
import { useDispatch } from 'react-redux'
import { setApplication, setDestApplication, setTenant, setUserCredentials } from './reducers/context'

// STYLE
import './Anacleto.css'
import './utils/utils.css'

// import "primereact/resources/themes/md-light-indigo/theme.css";    //theme
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";

import 'primereact/resources/themes/lara-light-indigo/theme.css'

import 'primereact/resources/primereact.min.css' // core css
import 'primeicons/primeicons.css' // icons
// import "/node_modules/primeflex/primeflex.css"
import 'primeflex/primeflex.css'

export const Anacleto = () => {
  const dispatch = useDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const [username, setUsername] = useState(
    null || window.localStorage.getItem('username')
  )
  const [theme, setTheme] = useState('lara-light-indigo')

  const changeTheme = (newTheme) => {
    const elementId = 'theme-link'
    const linkElement = document.getElementById('theme-link')
    const cloneLinkElement = linkElement.cloneNode(true)
    const newThemeUrl = linkElement
      .getAttribute('href')
      .replace(theme, `lara-${newTheme}-indigo`)

    cloneLinkElement.setAttribute('id', elementId + '-clone')
    cloneLinkElement.setAttribute('href', newThemeUrl)
    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove()
      cloneLinkElement.setAttribute('id', elementId)
    })

    linkElement.parentNode.insertBefore(
      cloneLinkElement,
      linkElement.nextSibling
    )
    setTheme(`lara-${newTheme}-indigo`)
  }
  // recupero parametro che arrivano dall'url
  const { windowId } = useParams()

  useEffect(() => {
    // Initialize context in store
    if (searchParams.get('application')) {
      dispatch(setApplication(searchParams.get('application')))
    }
    if (searchParams.get('destapplication')) {
      dispatch(setDestApplication(searchParams.get('destapplication')))
    }
    if (searchParams.get('tenant')) {
      dispatch(setTenant(searchParams.get('tenant')))
    }

    auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        window.localStorage.setItem('username', userCred.email)
        setUsername(userCred.email)
        // Returns the current token if it has not expired or if it will not expire in the next five minutes. Otherwise, this will refresh the token and return a new one.
        auth.currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            dispatch(setUserCredentials({
              username: userCred.email,
              claims: idTokenResult.claims
            }))

            return Promise.resolve(`Bearer ${idTokenResult.token}`)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        logoutApp()
      }
    })
  }, [])

  /**
	 * Cancella i dati dell'utente
	 */
  const logoutApp = () => {
    logout()
    setUsername(null)
    window.localStorage.setItem('username', null)
    dispatch(setUserCredentials, null)
  }

  const getApplicationBuilder = (opts) => {
    return (
      <MemoApplicationBuilder
        application={opts?.builder ? 'BUILDER' : ''}
        logout={logoutApp}
        windowId={windowId}
        changeTheme={changeTheme}
      />
    )
  }

  return (
    <div className='App'>
      {username && <Routes>
        <Route path='/admin/:windowId' exact element={getApplicationBuilder({ builder: true })} />
        <Route path='/admin' exact element={getApplicationBuilder({ builder: true })} />
        <Route path='/registration' exact element={<Registration />} />
        <Route path='/:windowId' element={getApplicationBuilder()} />
        <Route path='/' exact element={getApplicationBuilder()} />
        <Route element={<ErrorPage title='This is weird' message="You tried to navigate to a page that we don't even know about!" />} />
      </Routes>}

      {!username && <Routes>
        <Route
          path='/*' element={<Login setUsername={setUsername} subtitle={process.env.REACT_APP_LOGIN_MESSAGE || 'Login to Anacleto Apps'} />}
        />
        <Route
          path='/admin/*'
          element={<Login setUsername={setUsername} isBuilder subtitle='Login to Anacleto Builder App!' />}
        />
      </Routes>}
    </div>
  )
}
