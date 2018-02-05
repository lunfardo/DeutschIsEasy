const fetch = require('node-fetch-polyfill')
const config=require('dotenv').config().parsed
const Promise=require('promise-polyfill')

function PonsdeConsumer(apikey){
    this.rawData=""
    this.endpointURL="https://api.pons.com/v1/dictionary"
   // this.APIHeaders.append("X-Secret", config.PONS_APIKEY)
    this.lastSearchFailed=false
    this.fetchPreset = {
                        method: 'GET',
                        headers: {
                            'X-Secret': config.PONS_APIKEY
                        }
                    }      



    this.makeEndpointRequest=(wordToSearch)=>{   
        let endpoint=this.endpointURL 
        let fullURL=`${endpoint}?l=deen&q=${wordToSearch}`
        return fetch(fullURL,this.fetchPreset)
    }

    this.translate=(wordToSearch)=>{
        return new Promise((resolve, reject)=>{
            this.makeEndpointRequest(wordToSearch).then((result)=>{
                //this means result is empty
                if(result.status===204){
                    this.lastSearchFailed=true
                    return true //we finish the execution here
                }else{
                    this.lastSearchFailed=false
                }

                result.text().then((resultText)=>{   
                    resolve(this.parseDataFromAPI(JSON.parse(resultText)))             
                })
            })
        })
    }

    this.parseDataFromAPI=(unparsedResponse)=>{
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

        return unparsedResponse.filter((languageContainer)=>{return languageContainer.lang=="de"})
                                    [0].hits.map(parseHit).join(" ")
                                    .toString()//.replace(/,/g, '')
    }

    this.didLastSearchFailed=()=>{
        return this.lastSearchFailed
    }    

}


const instance= new PonsdeConsumer
module.exports=instance

