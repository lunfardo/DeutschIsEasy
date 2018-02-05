const fs=require('fs')
const CONST=require('../static/constants')
const {WordCapsule}=require('../static/structures')
const Promise=require('promise-polyfill')

class WordList {
    /*
    INPUT: wordCapsulated:WordCapsule
    */
    constructor(){
        this.wordList=[]
    }

    /*
        Load the JSON data from file
    */
    loadFromFile(){
        return new Promise((resolve, reject)=>{
            fs.readFile(CONST.WORD_LIST_FILENAME, 'utf8', (err, data)=>{
                if (err){
                    throw err
                } else {
                    this.wordList = JSON.parse(data) //translate the file to json object
                    resolve(true)
            }})
        })
    }
    /*
        write the JSON data to file
    */
    writeToFile(){
        fs.writeFile(CONST.WORD_LIST_FILENAME, JSON.stringify(this.wordList))
    }

    /*
        insert the new capsulated word to the object word list
        INPUT: wordCapsulated:WordCapsule
    */
    insertWord(wordCapsulated){
        this.wordList.push(wordCapsulated) //add the new word capsulated
    }
    /*
        INPUT: wordToLookup:string
    */
    findWord(wordToLookup){
        let foundItem=this.wordList.find((wordCapsuled)=>{return wordCapsuled.word===wordToLookup}) //add the new word capsulated
        let wordCapsulated=foundItem? new WordCapsule(foundItem):false
        if(wordCapsulated){
            wordCapsulated.touchUpdate()
            wordCapsulated.incrementTimesSearched()
            //update list with inmutables functions
            this.wordList=this.wordList.filter((wordCapsuled)=>{return wordCapsuled.word!==wordToLookup}).concat(wordCapsulated)
        }
        return wordCapsulated
    }
    /*
        return the last 10 words searched
    */
    lastSearches(){
        return this.wordList.slice(this.wordList.length-10,this.wordList.length).reverse()
    }
}

const instance= new WordList
module.exports=instance



