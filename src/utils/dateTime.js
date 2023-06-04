

function getCurrentTime() {
const currentTime = new Date();
const hours = currentTime.getHours().toString().padStart(2, '0');
const minutes = currentTime.getMinutes().toString().padStart(2, '0');
const seconds = currentTime.getSeconds().toString().padStart(2, '0');
const formattedTime = `${hours}:${minutes}:${seconds}`;
return formattedTime
}

function getCurrentDate() {
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const date = currentDate.getDate().toString().padStart(2, '0');
const formattedDate = `${year}-${month}-${date}`;
return formattedDate;
}

module.exports = {getCurrentDate,getCurrentTime}
