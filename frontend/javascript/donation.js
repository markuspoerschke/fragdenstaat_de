const getHeight = function (el) {
  var style = window.getComputedStyle(el)
  var display = style.display
  var position = style.position
  var visibility = style.visibility
  var maxHeight = style.maxHeight.replace('px', '').replace('%', '')
  var wantedHeight = 0

  // if its not hidden we just return normal height
  if (display !== 'none' && maxHeight !== '0') {
    return el.offsetHeight
  }

  // the element is hidden so:
  // making the el block so we can meassure its height but still be hidden
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style.display = 'block'

  wantedHeight = el.offsetHeight

  // reverting to the original values
  el.style.display = display
  el.style.position = position
  el.style.visibility = visibility

  return wantedHeight
}

/**
* toggleSlide mimics the jQuery version of slideDown and slideUp
* all in one function comparing the max-heigth to 0
  */
var toggleSlide = function (el) {
  var elMaxHeight = 0

  if (el.getAttribute('data-max-height')) {
    // we've already used this before, so everything is setup
    if (el.style.maxHeight.replace('px', '').replace('%', '') === '0') {
      el.style.maxHeight = el.getAttribute('data-max-height')
    } else {
      el.style.maxHeight = '0'
    }
  } else {
    elMaxHeight = getHeight(el) + 'px'
    el.style['transition'] = 'max-height 2s ease-in-out'
    el.style.overflowY = 'hidden'
    el.style.maxHeight = '0'
    el.setAttribute('data-max-height', elMaxHeight)
    el.style.display = 'block'

    // we use setTimeout to modify maxHeight later than display (so we have the transition effect)
    setTimeout(function () {
      el.style.maxHeight = elMaxHeight
    }, 10)
  }
}

function showDonationBanner () {
  window._paq = window._paq || []

  function hideBanner (code, time) {
    return function (e) {
      e.preventDefault()
      window._paq.push(['trackEvent', 'donations', 'donationBanner', code])
      window.localStorage.setItem(itemName, JSON.stringify({
        timestamp: time
      }))
      toggleSlide(el)
      window.setTimeout(function () {
        el.parentNode.removeChild(el)
      }, 5 * 1000)
    }
  }

  if (document.location.pathname.indexOf('/spenden/') !== -1 ||
      document.location.pathname.indexOf('/blog/') !== -1 ||
      document.location.pathname.indexOf('/anfrage-stellen/') !== -1 ||
      document.location.pathname.indexOf('/account/') !== -1) {
    return
  }
  var el = document.querySelectorAll('.donation-block')
  if (el.length === 2) {
    el[1].style.display = 'block'
  }
  if (el.length !== 1) {
    return
  }
  el = el[0]
  if (!window.localStorage) {
    return
  }
  const cancel = el.querySelector('.cancel-donation')
  const already = el.querySelector('.already-donation')
  const close = el.querySelector('.close')

  const itemName = 'donation-banner'
  const now = (new Date()).getTime()
  var last = window.localStorage.getItem(itemName)
  if (last !== null) {
    last = JSON.parse(last)
    if (last.timestamp && (now - last.timestamp) < (60 * 60 * 24 * 1000)) {
      return
    }
  }
  window.localStorage.removeItem(itemName)

  if (close) {
    close.addEventListener('click', hideBanner('close', now))
  }

  if (cancel) {
    cancel.addEventListener('click', hideBanner('notnow', now))
  }
  if (already) {
    already.addEventListener('click', hideBanner('donated', now + (1000 * 60 * 60 * 24 * 30)))
  }
  window.setTimeout(function () {
    window._paq.push(['trackEvent', 'donations', 'donationBanner', 'shown'])
    if (window.innerWidth > 768) {
      el.style.position = 'sticky'
      el.style.top = '0'
    }
    toggleSlide(el)
    window.setTimeout(function () {
    }, 2000)
  }, 3000)
}

if (document.readyState === 'loading') {
  window.document.addEventListener('DOMContentLoaded', showDonationBanner)
} else {
  showDonationBanner()
}
