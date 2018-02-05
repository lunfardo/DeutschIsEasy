const {ipcRenderer} = require('electron')
const CONST=require('../static/constants')
const {SearchCapsule}=require('../static/structures')

module.exports = class AppRenderer{
    constructor(){
        this.translationJSON={}
        this.lastSearches={}
        this.updateTopBarWords()
        //we set the default translate service to pons.de 'cause they are pretty good
        this.translateService=CONST.PROVIDERS.PONS_DE
    }

    init(){
        //event when click some on the top bar words, it search for it again
        document.getElementById("searched_word_list").addEventListener("click",(e)=> {
            // e.target was the clicked element
            if (e.target && e.target.matches(".word-searched-item")) {
                let searchCapsule=new SearchCapsule({provider:this.translateService, word:e.target.innerHTML})
                this.searchWord(searchCapsule)
            }
        })

        document.addEventListener("keyup", (e) => {
            //trigger event on "enter" key press
            if (event.keyCode === 13){
                let searchCapsule=new SearchCapsule({provider:this.translateService, word:e.target.value})
                this.searchWord(searchCapsule)
            }
        })

        //this event allow us to change the translate provider from the interface
        var classelement=document.getElementsByClassName("provider-item")
        for (var i = 0; i < classelement.length; i++){
            classelement[i].addEventListener("click",(e)=> {
                let providerChoosed=e.srcElement.attributes.getNamedItem("provider-name").value
                switch (providerChoosed) {
                    case CONST.PROVIDERS.PONS_DE:
                        this.translateService=CONST.PROVIDERS.PONS_DE
                        break;
                    case CONST.PROVIDERS.GLOSBE:
                        this.translateService=CONST.PROVIDERS.GLOSBE
                    default:
                        break;
                }           
            })
        };
    }

    searchWord(searchCapsule){
        //lets get the translation from the server side
        this.fetchTranslationFromServer(JSON.stringify(searchCapsule)).then((result)=>{
            this.translationJSON=result
            this.renderTranslation()
            //return true   
        }).then(()=>{
            this.updateTopBarWords()
        })
    }

    updateTopBarWords(){
        //now we update the last searching top bar
        this.fetchLastSearches().then((result)=>{
            this.lastSearches=JSON.parse(result)
            this.renderTopBarResults()
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

    fetchLastSearches(){
        return new Promise((resolve,reject)=>{
            ipcRenderer.send("last-searches") 
            ipcRenderer.on('last-searches-reply', (event, result) => {
                resolve(result);
            })            
        })
    }    

    renderTranslation(){
        document.getElementById("translation_wrapper").innerHTML=this.translationJSON
    }

    renderTopBarResults(){
        let listWordSeached= this.lastSearches.map((wordCapsuled)=>{return `<a class="word-searched-item">${wordCapsuled.word}</a>`}).join("")
        document.getElementById("searched_word_list").innerHTML=listWordSeached        
    }

}

