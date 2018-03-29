export default function asyncLoadJs (url) {
  return new Promise((resolve, reject) => {
    let hasLoaded = $('script[src="'+url+'"]').length > 0
    if (hasLoaded) {
      resolve()
      return
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
  })
}

export function loadAMapJS () {
  return new Promise((resolve, reject) => {
    asyncLoadJs('https://webapi.amap.com/maps?v=1.4.1&key=0b7de3baf96b2093ca2ec54caaac39fa')
      .then(() => {
        return asyncLoadJs('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11')
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}