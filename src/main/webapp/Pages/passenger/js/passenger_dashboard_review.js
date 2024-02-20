let booking_id = "BK0001";

isAuthenticated();
console.log("hello2")

document.getElementById("review_form").addEventListener("submit", function(event) {
    event.preventDefault();

    const driverRating = parseInt(document.getElementById("driverRating").value);
    const busRating = parseInt(document.getElementById("busRating").value);
    const conductorRating = parseInt(document.getElementById("conductorRating").value);
    const comments = document.getElementById("comments").value;

    const pointDetails = {
        driverRating : driverRating,
        busRating : busRating,
        conductorRating : conductorRating,
        booking_id : booking_id
    }

    const jsonData = JSON.stringify(pointDetails);
    fetch(`${ url }/pointController`,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : jsonData
    })
    .then(response =>{
         if(response.ok){
             return response.json();
         }
         else{
             console.log("Error : ", response.status);
         }
    })
    .then(data =>{
        const pointID = data.point_id;
        addReview(pointID, booking_id, comments);
    })
    .catch(error => {
             console.error('Error:', error);
     });

});


function addReview(point_id, booking_id, comments){

    const reviewDetails = {
        point_id : point_id,
        booking_id : booking_id,
        comments : comments
    }

    const jsonData = JSON.stringify(reviewDetails);

    fetch(`${ url }/reviewController`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response =>{
            if(response.ok){
                return response.json();
                console.log("review id : ", response.review_id);
            }
            else{
                console.log("Error : ", response.status);
            }
        })
        .catch(error => {
                console.error('Error:', error);
        });
}
