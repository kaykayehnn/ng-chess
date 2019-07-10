export function registerAnalytics() {
  const dataLayer = (window as any).dataLayer || []
  function gtag(a?, b?) {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())

  gtag('config', 'UA-142704525-1')
}
