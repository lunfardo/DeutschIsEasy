//const {ipcRenderer} = require('electron')
const {ipcMain} = require('electron')
const WordList=   require('./WordList') 
const TranslateService=require('./translate_service/index')

module.exports = class DeutschDictApp {
    constructor() {
        this.lastSearches=[]
        this.config=require('dotenv').config().parsed              
        this.fs = require('fs');
        
    }

    registerAsyncMessagesHandlers(){
        ipcMain.on('search-word', (event, arg) => {
            let capsulatedSearch=JSON.parse(arg)
            TranslateService.translateIMUX(capsulatedSearch).then((translateResultJSON)=>{
                event.sender.send('search-word-reply', translateResultJSON)             
            })
        })            
    }


  };


  
  /*

    fetchTranslation(word,shouldRegister){
        var myRequest = new Request(`https://api.pons.com/v1/dictionary?l=deen&q=${word}`, this.fetchPreset);
        
        fetch(myRequest).then((response)=> {
            response.text().then((data)=>{
                document.getElementById("myInfo").innerHTML=parseAPIData(JSON.parse(data))
                if(response.status===200 && shouldRegister){
                    this.pushWord(word)
                    this.updateTopBarWords()
                }
            })
        })
    }

    pushWord(word){
        this.lastSearches.unshift(word)
        ipcRenderer.sendSync("write-word-on-history",word)     
    }

    updateTopBarWords(){
        let listWordSeached= this.lastSearches.map((word)=>{return `<a class="word-searched-item">${word}</a>`}).join("")

        document.getElementById("searched_word_list").innerHTML=listWordSeached
    }

  */