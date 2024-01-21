// module.exports.getDate, here .getDate is mentioned so as to bind more functions if needed using another name instead of getDate

// using the concept of      let var = function(){}
exports.returnDate = function returnDate(){
    const date = new Date();
    const options = { weekday: 'long', day: 'numeric' };
    const today = date.toLocaleDateString("en-IN", options);

    return today;
}

exports.returnDay = function returnDay(){
    const date = new Date();
    const days = ["sunday", "monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return days[date.getDay()];
}