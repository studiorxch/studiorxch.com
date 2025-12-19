function pad(num) {
    return num.toString().padStart(2, "0");
}

function updateTime() {
    const now = new Date();

    // Format the date
    const options = { weekday: "short", month: "short", day: "numeric" };
    document.getElementById("current-date").textContent =
        now.toLocaleDateString("en-US", options);

    // Build time string with AM/PM
    let hours = now.getHours();
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // handle 0 as 12 (midnight/noon)

    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    document.getElementById("clock").textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();
