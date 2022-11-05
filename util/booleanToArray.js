module.exports = {   booleanToArray: (value) => {
        let result = value==="true"?[true]:(value==="false"?[false]:[true,false])
        return(result)
    }
} 