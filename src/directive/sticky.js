const vueSticky = {}
let listenAction
vueSticky.install = Vue => {
  Vue.directive('sticky', {
    inserted(el, binding) {
      const params = binding.value || {}
      const stickyTop = params.stickyTop || 0
      const zIndex = params.zIndex || 1000
      //判断是否是用的elemengtUI中的table
      const isElementTable = params.isElementTable || false
      el = isElementTable? (el.getElementsByClassName('el-table__header-wrapper')[0] || el) : el
      const elStyle = el.style
      //储存元素到页面顶部的高度
      let commonTop = 0
      //const commonTop = el.getBoundingClientRect().top
      elStyle.position = '-webkit-sticky'
      elStyle.position = 'sticky'
      // if the browser support css sticky（Currently Safari, Firefox and Chrome Canary）
      // if (~elStyle.position.indexOf('sticky')) {
      //     elStyle.top = `${stickyTop}px`;
      //     elStyle.zIndex = zIndex;
      //     return
      // }
      
      elStyle.cssText = `top: ${stickyTop}px; z-index: ${zIndex}`

      let placeholder = null
      let elWidth
      //惰性加载
      const createPlaceholderDiv = () => {
        elWidth = el.getBoundingClientRect().width
        const elHeight = el.getBoundingClientRect().height
        const parentElm = el.parentNode || document.documentElement
        const placeholder = document.createElement('div')
        placeholder.style.display = 'none'
        placeholder.style.width = `${elWidth}px`
        placeholder.style.height = `${elHeight}px`
        parentElm.insertBefore(placeholder, el)
        return placeholder
      }
      
      let active = false

      const getScroll = (target, top) => {
        const prop = top ? 'pageYOffset' : 'pageXOffset'
        const method = top ? 'scrollTop' : 'scrollLeft'
        let ret = target[prop]
        if (typeof ret !== 'number') {
          ret = window.document.documentElement[method]
        }
        return ret
      }

      const sticky = () => {
        if (active) {
          return
        }
        if (!elStyle.height) {
          elStyle.height = `${el.offsetHeight}px`
        }

        elStyle.position = 'fixed'
        elStyle.width = `${elWidth}px`
        placeholder.style.display = 'inline-block'
        active = true
      }

      const reset = () => {
        if (!active) {
          return
        }

        elStyle.position = ''
        placeholder.style.display = 'none'
        active = false
      }
      const check = () => {
        if (!placeholder) {
          placeholder = createPlaceholderDiv()
        }
        const scrollTop = getScroll(window, true)
        const offsetTop = el.getBoundingClientRect().top
        commonTop = commonTop || (el.getBoundingClientRect().top + scrollTop)
        if (offsetTop < stickyTop) {
          sticky()
        } else {
          if (scrollTop < commonTop) {
            reset()
          }
        }
      }
      listenAction = () => {
        check()
      }
      window.addEventListener('scroll', listenAction)
    },

    unbind() {
      window.removeEventListener('scroll', listenAction)
    }
  })
}

export default vueSticky

