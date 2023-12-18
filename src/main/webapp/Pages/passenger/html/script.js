const busContainer = document.getElementById('bus-container');
generateSeats(11, 5);

function generateSeats(numRows, numCols) {
  let seatNumber = 1;

  for (let row = 1; row <= numRows; row++) {
    for (let col = 1; col <= numCols; col++) {
      console.log(row + "  " + col)

      if (col === 3 && row !== numRows) {
        const emptySeat = document.createElement('div');
        emptySeat.className = 'empty-seat';
        busContainer.appendChild(emptySeat);
        console.log("test "+row + "  " + col)
      }
      else{
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.setAttribute('data-row', row);
        seat.setAttribute('data-col', col);
        seat.setAttribute('data-seat-number', seatNumber);
        seat.addEventListener('click', toggleSeat);
        busContainer.appendChild(seat);
        seatNumber++;
      }
    }
  }
}

function toggleSeat() {
  this.classList.toggle('selected');
}

function getSelectedSeats() {
  const selectedSeats = document.querySelectorAll('.seat.selected');
  return Array.from(selectedSeats).map(seat => ({
    row: parseInt(seat.getAttribute('data-row')),
    col: parseInt(seat.getAttribute('data-col')),
    seatNumber: parseInt(seat.getAttribute('data-seat-number'))
  }));
}

function bookSelectedSeats() {
  const selectedSeats = getSelectedSeats();
  console.log('Selected Seats:', selectedSeats);
}
