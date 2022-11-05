module.exports = {dateToStr: (dateString)=> {
    let dateObject
    if (dateString) {
        let dateParts = dateString?.split("-");
        // month is 0-based, that's why we need dataParts[1] - 1
        dateObject = `${dateParts[2]}/${dateParts[1] - 1}/${dateParts[0]}`;
    } else {
        dateObject = null
    }
    return (dateObject)
}
}
