/**
 * Take an async function and decorate it into a RESTful function
 */

const error = err => ({
  error: err.message,
  success: false
})

const success = data => ({
  data,
  error: undefined,
  success: true
})

module.exports = action => async (req, res) => {
  try {
    const resp = await action(req, success)
    res.json(resp || {})
  } catch (err) {
    console.error(err)
    res.json(error(err))
  }
}
