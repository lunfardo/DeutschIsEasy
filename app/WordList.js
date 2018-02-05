module.exports = class WordList {

    constructor(){
        this.list=[]
        const WORDLISTFILENAME="word_history.json"
    }

    insert(){
        fs.appendFile(this.WORDLISTFILENAME, arg+'\n',(err)=> {
            if (err) throw err;
            console.log('Saved!');
        })
        event.returnValue = null       
    }

    find(){

    }

    top(){
 
    }

    loadList(list){
        this.list=list
    }
}