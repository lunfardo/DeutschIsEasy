const CONST=require('../../static/constants')
const PonsdeConsumer=require('./PonsdeConsumer')
const GlosbeConsumer=require('./GlosbeConsumer')

function TranslateService(){
}

TranslateService.prototype.translateIMUX=(capsulatedSearch)=>{
  this.provider=null
  switch (capsulatedSearch.provider) {
    case CONST.PROVIDERS.PONS_DE:
      return PonsdeConsumer.translate(capsulatedSearch.word)
      break;

    case CONST.PROVIDERS.GLOSBE:
      return GlosbeConsumer.translate(capsulatedSearch.word)
      break;    
    //TODO
    case CONST.PROVIDERS.GOOGLE:
      return GoogleTranslateConsumer.translate(capsulatedSearch.word)
    default:
      break;
  }
}

const instance=new TranslateService
module.exports=instance


