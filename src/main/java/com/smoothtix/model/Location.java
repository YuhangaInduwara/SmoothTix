package com.smoothtix.model;

public class Location {
    String location_id;
    String schedule_id;
    Double latitude;
    Double longitude;


    public Location(String location_id, String schedule_id,Double latitude, Double longitude){
        this.location_id = location_id;
        this.schedule_id = schedule_id;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getLocation_id(){
        return location_id;
    }
    public String getSchedule_id(){
        return schedule_id;
    }
    public Double getLatitude(){
        return latitude;
    }
    public Double getLongitude(){
        return longitude;
    }
    public void setLocation_id(String location_id){
        this.location_id = location_id;
    }

    public void setSchedule_id(String schedule_id){
        this.schedule_id = schedule_id;
    }

    public void setLatitude(Double latitude){
        this.latitude = latitude;
    }
    public void setLongitude(Double longitude){
        this.longitude = longitude;
    }

}

