package com.smoothtix.model;

public class Driver {
    String driver_id;
    String p_id;
    String license_no;
    Float review_points;

    public Driver(String driver_id,String p_id, String license_no, Float review_points) {
        this.driver_id = driver_id;
        this.p_id = p_id;
        this.license_no = license_no;
        this.review_points = review_points;
    }

    public String getDriver_id(){ return driver_id; }
    public String getPassenger_id(){ return p_id; }
    public String getLicence_no(){ return license_no; }
    public Float getPoints(){
        return review_points;
    }


    public void setDriver_id(String driver_id){
        this.driver_id = driver_id;
    }
    public void setLicence_no(String license_no){this.license_no = license_no; }
    public void setPoints(Float review_points){
        this.review_points = review_points;
    }
}

