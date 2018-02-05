// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.jQuery=require('./assets/vendor/jquery331/jquery-3.3.1.min.js')
window.Tether=require('./assets/vendor/tether133/tether.min.js')

const AppRenderer=require('./app_renderer/index')
AppRender=new AppRenderer
AppRender.init()

