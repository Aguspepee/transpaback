module.exports = {
    dateToStr: (dateString) => {
        let dateObject
        if (dateString) {
            let dateParts = dateString?.split("-");
            // month is 0-based, that's why we need dataParts[1] - 1
            dateObject = `${dateParts[2]}/${dateParts[1] - 1}/${dateParts[0]}`;
        } else {
            dateObject = null
        }
        return (dateObject)
    },

    dateTimeToDate: (value) => {
        let date = value.split(" ")[0] || null
        let time = value.split(" ")[1] || null
        date = date?.split("/")
        time = time?.split(":")

        const year = date[2]
        const month = date[1] - 1
        const day = date[0]

        const hour = time[0] || 0
        const minutes = time[1] || 0

        return (new Date(year, month, day, hour, minutes, 0))
    }
}
