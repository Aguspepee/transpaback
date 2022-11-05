const items = [
    { "num": 1, "word": "ENE" },
    { "num": 2, "word": "FEB" },
    { "num": 3, "word": "MAR" },
    { "num": 4, "word": "ABR" },
    { "num": 5, "word": "MAY" },
    { "num": 6, "word": "JUN" },
    { "num": 7, "word": "JUL" },
    { "num": 8, "word": "AGO" },
    { "num": 9, "word": "SEP" },
    { "num": 10, "word": "OCT" },
    { "num": 11, "word": "NOV" },
    { "num": 12, "word": "DIC" }
]


module.exports = {
    monthNumToWord: (value) => {
        console.log(value)
        let word = items.find((item)=>item.num===value)
        return(word.word)
    }
}