function submitReview() {
    const drivingRating = document.getElementById("driverRating").value;
    const busRating = document.getElementById("busRating").value;
    const conductorRating = document.getElementById("conductorRating").value;
    const comments = document.getElementById("comments").value;

    const reviewDetails = {
        driverRating : driverRating,
        busRating : busRating,
        conductorRating : conductorRating,
        comments : comments
    }

    const jsonData = json.stringify(reviewDetails);

    fetch(`${ url }/reviewController`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response =>
            if(response.ok){
                return response.json;
            }
            else{
                console.log("Error : ", error);
            }
        )
}
