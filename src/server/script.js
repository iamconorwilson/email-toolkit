const search = document.querySelector("#search");
const darkMode = document.querySelector("#switch");


darkMode.addEventListener("click", function () {
  document.documentElement.classList.toggle("light");
  if (document.documentElement.classList.contains("light")) {
    localStorage.setItem("light", "true");
  } else {
    localStorage.setItem("light", "false");
  }
});


search.addEventListener("keyup", function (e) {
  let searchValue = e.target.value.toLowerCase();
  let files = document.querySelectorAll("#files a");

  files.forEach(function (file) {
    let fileName = file.getAttribute("title").toLowerCase();
    if (fileName.indexOf(searchValue) != -1) {
      file.style.display = "block";
    } else {
      file.style.display = "none";
    }
  });
});

//on ready
window.addEventListener("DOMContentLoaded", function () {
  let files = document.querySelectorAll("#files a");

  files.forEach(function (file) {

    //add target attribute to open links in new tab
    file.setAttribute("target", "_blank");

    //get file size
    let fileSize = file.querySelector(".size");
    let formattedSize = formatBytes(fileSize.innerHTML);
    fileSize.setAttribute("data-size", fileSize.innerHTML);
    fileSize.innerHTML = formattedSize;


    //get file date
    let fileDate = file.querySelector(".date");
    let formattedDate = time_ago(fileDate.innerHTML);

    //add original date as title attribute
    fileDate.setAttribute("title", fileDate.innerHTML);
    fileDate.innerHTML = formattedDate;
  });

  //check if light mode has been previously selected and user is not on dark mode

  if (localStorage.getItem("light") == "true" && !window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("light");
    darkMode.checked = false;
  } else {
    document.documentElement.classList.remove("light");
    darkMode.checked = true;
  }

});

let searchIcon = document.querySelector("#search-icon");
searchIcon.addEventListener("click", function () {
  let search = document.querySelector("#search");
  let input = search.querySelector("input");

  (search.classList.contains("active")) ? clearSearch(search, input) : showSearch(search, input);
});

//if esc key is pressed, clear search
document.addEventListener("keyup", function (e) {
  let search = document.querySelector("#search");
  let input = search.querySelector("input");

  if (e.key == "Escape") {
    clearSearch(search, input);
  }
});


function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return null;

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function time_ago(time) {
  time = strToDate(time);

  var time_formats = [
    [60, "seconds", 1], // 60
    [120, "1 minute ago", "1 minute from now"], // 60*2
    [3600, "minutes", 60], // 60*60, 60
    [7200, "1 hour ago", "1 hour from now"], // 60*60*2
    [86400, "hours", 3600], // 60*60*24, 60*60
    [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
    [604800, "days", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
    [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = "ago",
    list_choice = 1;

  if (seconds == 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
}

function strToDate(dtStr) {
  if (!dtStr) return null;
  let dateParts = dtStr.split("/");
  let timeParts = dateParts[2].split(" ")[1].split(":");
  dateParts[2] = dateParts[2].split(" ")[0];
  // month is 0-based, that's why we need dataParts[1] - 1
  return (dateObject = new Date(
    +dateParts[2],
    dateParts[1] - 1,
    +dateParts[0],
    timeParts[0],
    timeParts[1],
    timeParts[2]
  ));
}

setTimeout(function(){
    document.body.className="";
},500);


function clearSearch(search, input) {
  search.classList.remove("active");
  //if search has value, clear it
  if (input.value) {
    input.value = "";
    let files = document.querySelectorAll("#files a");
    files.forEach(function (file) {
      file.style.display = "block";
    })
  }
}

function showSearch(search, input) {
  search.classList.add("active");
  input.focus();
}

function addHeader() {
  let list = document.querySelector('ul');
  let header = document.createElement('li');
  header.classList.add('header');
  header.innerHTML = `
    <span class="name">Name</span>
    <span class="size">Size</span>
    <span class="date">Date</span>
  `;
  list.insertBefore(header, list.childNodes[0]);
}