if (location.href.includes('keeplog=')) localStorage.setItem('KEEP_OPEN_LOG', 1)
if (location.href.includes('log=') || localStorage.getItem('KEEP_OPEN_LOG')) {
  const script = document.createElement('script')
  script.src = 'https://cdn.bootcdn.net/ajax/libs/eruda/2.3.3/eruda.min.js'
  document.body.appendChild(script)
  script.onload = () => window.eruda.init()
}
