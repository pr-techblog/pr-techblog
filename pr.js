(function (w, d) {

  // Export to global namespace
  w.pr = {
    methods: {
      loadURL: loadURL,
      addClass: addClass,
      removeClass: removeClass,
      docReady: docReady,
      goToTop: goToTop,
      parseTextForEmojis: parseTextForEmojis,
      getAjax: getAjax,
      createElementByTag: createElementByTag,
      createElementById: createElementById,
      createElementByClassName: createElementByClassName,
      selectElementByTag: selectElementByTag,
      selectElementById: selectElementById,
      selectElementByClassName: selectElementByClassName
    }
  }

  // Functions and Operations

  function loadURL(url) {
    window.location.href = url
  }

  // Get a URL ; credit of youmightnotneedjquery.com
  function getAjax(url, successFunc, errorFunc) {
    if (!url) return Error('no url specified to getAjax')

    successFunc = successFunc || function() { console.info('Success') }
    errorFunc = errorFunc || function() { console.error('Error') }

    var req = new XMLHttpRequest()
    req.open('GET', url, true)

    req.timeout = 15000 // 15sec timeout

    req.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          var response = this.responseText
          successFunc(response)
        }
        else {
          errorFunc()
        }
      }
    }

    req.send();
  }

  // addClass && removeClass ; credit of youmightnotneedjquery.com
  function addClass(className, self) {
    if (self.classList) self.classList.add(className)
    else self.className += ' ' + className;
  }

  function removeClass(className, self) {
    if (self.classList) self.classList.remove(className);
    else
      self.className = self.className
        .replace(
        new RegExp('(^|\\b)' +
          className
            .split(' ')
            .join('|') +
          '(\\b|$)', 'gi'),
        ' ');
  }

  function createElementByTag(tag) {
    return d.createElement(tag)
  }

  function createElementById(tag, id) {
    var el = createElementByTag(tag)
    el.id = id
    return el
  }

  function createElementByClassName(tag, className) {
    var el = createElementByTag(tag)
    addClass(className, el)
    return el
  }

  function selectElementByTag(tag) {
    return d.querySelector(tag)
  }

  function selectElementById(id) {
    return d.getElementById(id)
  }

  function selectElementByClassName(className) {
    return d.querySelector(className)
  }

  // Same as jQuery(document).ready ; credit of youmightnotneedjquery.com
  function docReady(fn) {
    if (d.readyState !== 'loading') {
      fn()
    }
    else if (d.addEventListener) {
      d.addEventListener('DOMContentLoaded', fn, false)
    }
    else {
      d.attachEvent('onreadystatechange', function () {
        if (d.readyState !== 'loading') {
          fn()
        }
      })
    }
  }

  // Same as jQuery(el).html() ; gets html of domNode
  function getHTML(domNode) {
    return domNode.innerHTML
  }
  // Same as jQuery(el).html(html) ; sets html of domNode
  function setHTML(domNode, html) {
    domNode.innerHTML = html
  }

  // Scroll window to (x,y)
  function scroll(x, y) {
    window.scrollTo(x, y);
  }

  function goToTop() {
    scroll(0, 0);
  }

  /* Emojis */
  var emojiCodes = {

    ':بوس': '😘',

    ':عشق': '😍',

    ':سوال': '🤔',

    ':آغوش': '🤗',

    ':خنده': '😂',

    ':لبخند': '😊',

    ':پوکرفیس': '😐',

    ':چشمک': '😉',

    ':دی': '😁',

    ':پی': '😋',

  }

  function replaceAllCodesWithEmojis(txt) {
    var codes = Object.keys(emojiCodes)

    codes.forEach(function (code) {
      txt = txt.replace(new RegExp(code, 'gi'), emojiCodes[code])
    })

    return txt
  }

  function parseTextForEmojis(domNode) {
    setHTML(domNode, replaceAllCodesWithEmojis(getHTML(domNode)))
  }


})(window, document)
