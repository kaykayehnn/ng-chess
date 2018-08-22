/**
 * SetInterval but with RAF.
 * @param msInterval Interval in milliseconds to call function
 */
export function rafInterval (fn: () => void, msInterval: number) {
  let lastCall = 0
  requestAnimationFrame(animate)

  function animate (msPassed: number) {
    if (msPassed - lastCall >= msInterval) {
      fn()
      lastCall = msPassed
    }

    requestAnimationFrame(animate)
  }

  return function clearRAFInterval () {
    // TODO: implement
  }
}
