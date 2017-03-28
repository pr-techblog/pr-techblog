
(function (w, d) {

  // Export to global namespace
  w.pr = {
    methods: {
      loadURL: loadURL,
      addClass: addClass,
      removeClass: removeClass,
      docReady: docReady,
      goToTop: goToTop,
      parseTextForEmojis: parseTextForEmojis
    }
  }

  // Functions and Operations

  function loadURL(url) {
    window.location.href = url
  }

  // addClass && removeClass ; credit of youmightnotneedjquery.com
  function addClass(className, self) {
    if (self.classList) self.classList.add(className);
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

  // Same as jQuery(document).ready ; credit of youmightnotneedjquery.com
  function docReady(fn) {
    if (d.readyState !== 'loading') {
      fn()
    }
    else if (d.addEventListener) {
      d.addEventListener('DOMContentLoaded', fn ,false)
    }
    else {
      d.attachEvent('onreadystatechange', function() {
        if (d,readyState !== 'loading') {
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
