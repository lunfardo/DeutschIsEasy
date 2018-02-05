const fetch = require('node-fetch-polyfill')
const config=require('dotenv').config().parsed
const Promise=require('promise-polyfill')

function GlosbeConsumer(apikey){
    this.rawData=""
    this.lastSearchFailed=null
    //this app is just deu->eng, to the rest doesnt matter
    this.endpointURL="https://glosbe.com/gapi/translate?from=de&dest=eng&format=json"
    this.fetchPreset = {
                        method: 'GET',
                    }      



    this.makeEndpointRequest=(wordToSearch)=>{   
        let endpoint=this.endpointURL 
        //Glosbe dont like word in caps, so to lower case it is
        let fullURL=`${endpoint}&phrase=${wordToSearch.toLowerCase() }`
        return fetch(fullURL,this.fetchPreset)
    }

    this.translate=(wordToSearch)=>{
        return new Promise((resolve, reject)=>{
            this.makeEndpointRequest(wordToSearch).then((result)=>{
                result.text().then((resultText)=>{   
                    resolve(this.parseDataFromAPI(JSON.parse(resultText)))             
                })
            })
        })
    }

    this.parseDataFromAPI=(unparsedResponse)=>{
        const parseMeanings=(meaning)=>{
            return meaning.text+"<br/>"
        }
        const parseTuc=(tuc)=>{
            //sometimes returns "phrase"s objects, other time returns "meanings" objects... 
            if(tuc.phrase){
                return `<div class="row translation-container">
                            <div class="roms-container">
                                <div class="row translation-container">
                                    <div class="col-6">${unparsedResponse.phrase}</div> 
                                    <div class="col-6">${tuc.phrase?tuc.phrase.text:tuc.meanings.map(parseMeanings).join(" ")}</div>
                                </div>
                            </div>
                        </div>`
            }
            else{
                return `<div class="row translation-container">
                            <div class="roms-container">
                                <div class="row translation-container">
                                    <div class="col-6">${unparsedResponse.phrase}</div> 
                                    <div class="col-6">${tuc.phrase?tuc.phrase.text:tuc.meanings.map(parseMeanings).join(" ")}</div>
                                </div>
                            </div>
                        </div>`                
            }

        }
        //if tuc is empty then the word doesnt exist
        this.lastSearchFailed=(unparsedResponse.tuc.length===0)

        return unparsedResponse.tuc.map(parseTuc).join(" ")
                                    .toString()//.replace(/,/g, '')
    }


    this.didLastSearchFailed=()=>{
        return this.lastSearchFailed
    }

}


const instance= new GlosbeConsumer
module.exports=instance
