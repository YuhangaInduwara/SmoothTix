package com.smoothtix.model;

public class Review {
    String review_id;
    String point_id;
    String bus_profile_id;
    String comments;

    public Review(String review_id, String point_id, String bus_profile_id, String comments){
        this.review_id = review_id;
        this.point_id = point_id;
        this.bus_profile_id = bus_profile_id;
        this.comments = comments;
    }

    public String getReview_id(){
        return review_id;
    }
    public String getPoint_id(){
        return point_id;
    }
    public String getBus_Profile_id(){ return bus_profile_id; }
    public String getComments(){
        return comments;
    }


    public void setReview_id(String review_id){ this.review_id = review_id; }
    public void setPoint_id(String point_id){ this.point_id = point_id; }
    public void setBus_Profile_id(String bus_profile_id){ this.bus_profile_id = bus_profile_id; }
    public void setComments(String comments){ this.comments = comments; }

}
