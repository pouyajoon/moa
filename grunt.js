var publicJSFiles = ['public/js/*.js', 'public/js/**/*.js'];
var nodeFiles = ["server/classes/*.js", "server/db/*.js", "server/maps/*.js", "server/test/*.js"];





config.init({
  lint: {
    all: [publicJSFiles, nodeFiles]
  },
  concat : {
    "public/dist-js/moa-client.js" : publicJSFiles
  },
  min : {
    "public/dist-js/moa-client-min.js" : publicJSFiles
  }
});