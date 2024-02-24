var i = 0;
var txt = 'Your Ticket to a Smooth Travel';
var speed = 50;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("caption").innerHTML += txt.charAt(i);
        i++;
    } else {
        // Reset variables when the text is fully typed
        i = 0;
        document.getElementById("caption").innerHTML = '';
    }
}

// Call typeWriter every second (1000 milliseconds)
setInterval(typeWriter, 100);
