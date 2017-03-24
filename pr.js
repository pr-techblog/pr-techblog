
window.pr = {
  methods: {
    loadURL: loadURL,
    addClass: addClass,
    removeClass: removeClass,
    goToTop: goToTop
  }
}



function loadURL(url) {
  window.location.href = url
}

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

function scroll(x, y) {
  window.scrollTo(x, y);
}

function goToTop() {
  scroll(0, 0);
}
