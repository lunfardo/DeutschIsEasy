const CONST=require('../../static/constants')
const PonsdeConsumer=require('./PonsdeConsumer')
const GlosbeConsumer=require('./GlosbeConsumer')

function TranslateService(){
  this.provider=null

  this.translateIMUX=(capsulatedSearch)=>{
    this.getConsumer(capsulatedSearch.provider)
    return this.provider.translate(capsulatedSearch.word)
  }

  this.hasFailedIMUX=(providerIdentifier)=>{
    this.getConsumer(providerIdentifier)
    return this.provider.didLastSearchFailed()
  }

  this.getConsumer=(providerIdentifier)=>{
    switch (providerIdentifier) {
      case CONST.PROVIDERS.PONS_DE:
        this.provider=PonsdeConsumer
        break;
      case CONST.PROVIDERS.GLOSBE:
        this.provider=GlosbeConsumer
        break;    
      //TODO: Google Api handler
      case CONST.PROVIDERS.GOOGLE:
        this.provider=GoogleTranslateConsumer
      
      default:
        break;
    }    
  }
}

const instance=new TranslateService
module.exports=instance