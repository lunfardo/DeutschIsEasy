//const {ipcRenderer} = require('electron')
const {ipcMain} = require('electron')
const WordList=   require('./WordList') 
const TranslateService=require('./translate_service/index')
const {SearchCapsule,WordCapsule}=require('../static/structures')

module.exports = class DeutschDictApp {
    constructor() {
        this.config=require('dotenv').config().parsed              
    }
    /*
    this function register the handlers from whichs the renderer will make the ipc calls
    */
    registerAsyncMessagesHandlers(){
        //here is the endpoint where the searchs to 3er party services is done
        ipcMain.on('search-word', (event, arg) => {
            /*this type cast is not actually necesary, just do it for clarification sake */
            let capsulatedSearch=new SearchCapsule(JSON.parse(arg))
            //TranslateService inv multiplex between many translate services apis
            TranslateService.translateIMUX(capsulatedSearch).then((translateResultJSON)=>{
                let wordCapsulated= new WordCapsule({word:capsulatedSearch.word.toUpperCase()})
                WordList.loadFromFile().then(()=>{
                    //we lazy check that the request has not failed,and the word is not already present in the list
                    if((!TranslateService.hasFailedIMUX())&&(!WordList.findWord(wordCapsulated.word))){
                        WordList.insertWord(wordCapsulated)
                    }
                    WordList.writeToFile()
                })
                event.sender.send('search-word-reply', translateResultJSON)             
            })
        })  
        
        ipcMain.on('last-searches', (event, arg) => {
            WordList.loadFromFile().then(()=>{
                event.sender.send('last-searches-reply', JSON.stringify(WordList.lastSearches())) 
            })                                        
        })            
    }


  };

