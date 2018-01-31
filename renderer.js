// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.



const MyApp=require('./app/main')
const DB=require('./app/db')
myApp=new MyApp
myApp.run()
//myApp.fetchSomething()

document.addEventListener("keyup", (e) => {
    if (event.keyCode === 13)  myApp.fetchTranslation(e.target.value,true)
});