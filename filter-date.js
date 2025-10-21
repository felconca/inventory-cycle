// dateFormat.js
function filterDate(dateInput, format = "yyyy-MM-dd") {
  const date = new Date(dateInput);

  if (isNaN(date)) return ""; // handle invalid dates gracefully

  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const map = {
    yyyy: date.getFullYear(),
    yy: String(date.getFullYear()).slice(-2),
    MMMM: monthsLong[date.getMonth()],
    MMM: monthsShort[date.getMonth()],
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    M: date.getMonth() + 1,
    dd: String(date.getDate()).padStart(2, "0"),
    d: date.getDate(),
    HH: String(date.getHours()).padStart(2, "0"),
    mm: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
  };

  // Replace tokens (longest first to avoid partial overlaps)
  return format.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm|ss/g, (token) => map[token]);
}

export default filterDate;
