const {ipcRenderer} = require('electron')
const CONST=require('../static/constants')
const SearchCapsule=require('../static/structures')

module.exports = class AppRenderer{
    constructor(){
        this.translationJSON={}
    }

    init(){
        document.getElementById("searched_word_list").addEventListener("click",(e)=> {
            // e.target was the clicked element
            if (e.target && e.target.matches(".word-searched-item")) {
            this.fetchTranslation(e.target.innerHTML,false)
            this.renderTranslation()
            }
        })

        document.addEventListener("keyup", (e) => {
            //trigger event on "enter" key press
            if (event.keyCode === 13){
                let searchCapsule=new SearchCapsule(CONST.PROVIDERS.GLOSBE, e.target.value)
                this.fetchTranslationFromServer(JSON.stringify(searchCapsule)).then((result)=>{
                    this.translationJSON=result
                    this.renderTranslation()
                })
               
            }
        })
    }

    fetchTranslationFromServer(capsulatedSearch){
        return new Promise((resolve,reject)=>{
            ipcRenderer.send("search-word",capsulatedSearch) 
            ipcRenderer.on('search-word-reply', (event, result) => {
                resolve(result);
            })            
        })
    }

    renderTranslation(){
        document.getElementById("translation_wrapper").innerHTML=this.translationJSON
    }

}

