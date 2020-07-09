import { addUser, fetchUser, updateUser } from './middleware'

/**
 * Fetches user preferences, or if none available, make an initial user preference object, and return the result.
 */
export async function fetchOrInitializeUser (route, proc, auth) {
  const { accessToken, user } = auth

  try {
    const result = await fetchUser(route, proc, accessToken)

    // Beware! On AWS API gateway, if a user is not found in the middleware
    // (e.g. they just created their Auth0 password but have not completed the account setup form yet),
    // the call above will return, for example:
    // {
    //    status: 'success',
    //    data: {
    //      "result": "ERR",
    //      "message": "No user with id=000000 found.",
    //      "code": 404,
    //      "detail": null
    //    }
    // }
    //
    // The same call to a middleware instance that is not behind an API gateway
    // will return:
    // {
    //    status: 'error',
    //    message: 'Error get-ing user...'
    // }
    // TODO: Improve AWS response.

    const resultData = result.data
    const isNewAccount = result.status === 'error' || (resultData && resultData.result === 'ERR')

    if (!isNewAccount) {
      return resultData
    } else {
      return null
    }
  } catch (error) {
    // TODO: improve error handling.
    alert(`An error was encountered:\n${error}`)
  }
}

/**
 * Updates (or creates) a user entry in the middleware,
 * then, if that was successful, updates the redux state with that user.
 */
export function createOrUpdateUser (userData) {
  return async function (dispatch, getState) {
    const { otp, user } = getState()
    const { otp_middleware: otpMiddleware = null } = otp.config.persistence

    if (otpMiddleware) {
      const { accessToken, loggedInUser } = user

      let result
      if (isNewUser(loggedInUser)) {
        result = await addUser(otpMiddleware, accessToken, userData)
      } else {
        result = await updateUser(otpMiddleware, accessToken, userData)
      }

      // TODO: improve the UI feedback messages for this.
      if (result.status === 'success' && result.data) {
        // Update application state with the user entry as saved
        // (as returned) by the middleware.
        const userData = result.data
        dispatch(setCurrentUser({ accessToken, user: userData }))

        alert('Your preferences have been saved.')
      } else {
        alert(`An error was encountered:\n${JSON.stringify(result)}`)
      }
    }
  }
}
