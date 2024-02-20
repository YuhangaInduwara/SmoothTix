package com.smoothtix.model;

public class Review {
    String review_id;
    String point_id;
    String comments;
    String booking_id;

    public Review(String point_id, String booking_id, String comments){
        this.point_id = point_id;
        this.comments = comments;
        this.booking_id = booking_id;
    }

    public String getReview_id(){
        return review_id;
    }
    public String getPoint_id(){
        return point_id;
    }
    public String getComments(){
        return comments;
    }
    public String getBooking_id(){
        return booking_id;
    }


    public void setPoint_id(String point_id){ this.point_id = point_id; }
    public void setReview_id(String review_id){this.review_id = review_id;}
    public void setComments(String comments){ this.comments = comments; }

}
