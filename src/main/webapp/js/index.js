let i = 0;
let txt = 'Your Ticket to a Smooth Travel';
let speed = 50;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("caption").innerHTML += txt.charAt(i);
        i++;
    } else {
        i = 0;
        document.getElementById("caption").innerHTML = '';
    }
}
setInterval(typeWriter, 100);
