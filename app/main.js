const APIKey=window.appconfig.PONS_APIKEY
const {ipcRenderer} = require('electron')

function parseAPIData(languagesDataContainer){
    //los .join(" ") son para que no aparezca comas :D
    const parseTranslations=(translation)=>{
        return `
                <div class="row translation-container">
                    <div class="col-6">${translation.source}</div>
                    <div class="col-6">${translation.target}</div>
                </div>
                `
    }
    const parseArabs=(arab)=>{
        return `<div class="arab-header">${arab.header}</div>`+
        `<div class="translations-container">${
            arab.translations.map(parseTranslations).join(" ") //going deeper :D, not even tired
        }</div>`
    }
    const parseRom=(rom)=>{
        return  `<div class="rom-container">${
             `<div class="row headword_full">${rom.headword_full}</div>` 
            +`<div class="arabs-container">${rom.arabs.map(parseArabs).join(" ")}</div>`
        }</div>`
    }
    const parseHit=(hit)=>{
        return `<div class="roms-container">${hit.roms.map(parseRom).join(" ")}</div>`}

   return languagesDataContainer.filter((languageContainer)=>{return languageContainer.lang=="de"})
                                [0].hits.map(parseHit).join(" ")
                                .toString()//.replace(/,/g, '')
}
module.exports = class MyApp {
    constructor(width) {
        this.lastSearches=[]
        this.APIHeaders = new Headers()
        this.APIHeaders.append("X-Secret", APIKey)
        this.fetchPreset = {
                         method: 'GET',
                         headers: this.APIHeaders
                        }      
        document.getElementById("searched_word_list").addEventListener("click",(e)=> {
            // e.target was the clicked element
            if (e.target && e.target.matches(".word-searched-item")) {
              this.fetchTranslation(e.target.innerHTML,false)
            }
        });           
        this.fs = require('fs');
    }
  
    run(){
        return null
    }
    
    fetchTranslation(word,shouldRegister){
        var myRequest = new Request(`https://api.pons.com/v1/dictionary?l=deen&q=${word}`, this.fetchPreset);
        fetch(myRequest).then((response)=> {
            response.text().then((data)=>{
                document.getElementById("myInfo").innerHTML=parseAPIData(JSON.parse(data))
                this.updateTopBarWords()
            }).then(()=>{
                if(shouldRegister)this.pushWord(word)
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
  };


  
