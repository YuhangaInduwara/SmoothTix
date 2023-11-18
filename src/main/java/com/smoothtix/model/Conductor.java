package com.smoothtix.model;

public class Conductor {
    String conductor_id;
    String p_id;
    Float review_points;

    public Conductor(String conductor_id,String p_id, Float review_points){
        this.conductor_id = conductor_id;
        this.p_id = p_id;
        this.review_points = review_points;
    }

    public String getConductor_id(){
        return conductor_id;
    }
    public Float getReview_points(){
        return review_points;
    }
    public String getP_id(){
        return p_id;
    }
    public void setConductor_id(String conductor_id){
        this.conductor_id = conductor_id;
    }
    public void setReview_points(Float review_points){
        this.review_points = review_points;
    }
    public void setP_id(String p_id){
        this.p_id = p_id;
    }
}

