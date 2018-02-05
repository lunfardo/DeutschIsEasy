class SearchCapsule{
    /*
    INPUT: {provider, word}
    */
    constructor(obj){
        obj && Object.assign(this, obj);
    }
}
    /*
    INPUT: {word}
    */
class WordCapsule{
    constructor(obj){
        this.createdAt=(new Date).toISOString(),
        this.lastSearch=(new Date).toISOString(),
        this.timesSearched=1,
        //if createdAt and  lastSearch field have already been lastSearch set, this line will overwrite above data
        obj && Object.assign(this, obj);
    }
    touchUpdate(){
        this.lastSearch=(new Date).toISOString()
    }    
    incrementTimesSearched(){
        this.timesSearched++
    }
}

module.exports={
    SearchCapsule,
    WordCapsule
}