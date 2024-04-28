let i = 0;
let txt = 'Your Ticket to a Smooth Travel';

// show the text as typing
function typeWriter() {
    if (i < txt.length) {
        document.getElementById("caption").innerHTML += txt.charAt(i);
        i++;
    } else {
        i = 0;
        document.getElementById("caption").innerHTML = '';
    }
}

// Call typeWriter every second
setInterval(typeWriter, 100);
