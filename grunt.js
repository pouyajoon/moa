var files = ['public/js/*.js', 'public/js/**/*.js'];

config.init({
  lint: {
    all: files
  },
  min : {
    "public/dist-js/moa-client-min.js" : files
  }
});