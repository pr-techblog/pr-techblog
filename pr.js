
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
  self.classList.add(className);
}

function removeClass(className, self) {
  self.classList.remove(className);
}

function scroll(x, y) {
  window.scrollTo(x, y);
}

function goToTop() {
  scroll(0, 0);
}
