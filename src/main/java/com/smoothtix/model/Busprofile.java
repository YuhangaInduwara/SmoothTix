package com.smoothtix.model;

public class Busprofile {
    String busprofile_id;
    String driver_id;
    String conductor_id;
    int noOfSeats;
    String route;

    public Busprofile(String busprofile_id, String driver_id, String conductor_id, int noOfSeats, String route){
        this.busprofile_id = busprofile_id;
        this.driver_id = driver_id;
        this.conductor_id = conductor_id;
        this.noOfSeats = noOfSeats;
        this.route = route;
    }

    public String getBusprofile_id(){
        return busprofile_id;
    }
    public String getDriver_id(){
        return driver_id;
    }
    public String getConductor_id(){
        return conductor_id;
    }
    public int getNoOfSeats(){
        return noOfSeats;
    }
    public String getRoute(){
        return route;
    }


    public void setBusprofile_id(String busprofile_id){
        this.busprofile_id = busprofile_id;
    }
    public void setDriver_id(String driver_id){
        this.driver_id = driver_id;
    }
    public void setConductor_id(String conductor_id){
        this.conductor_id = conductor_id;
    }
    public void setNoOfSeats(int noOfSeats){
        this.noOfSeats = noOfSeats;
    }

    public void setRoute(String route){
        this.route = route;
    }

}
