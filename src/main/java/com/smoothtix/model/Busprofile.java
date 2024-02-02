package com.smoothtix.model;

public class Busprofile {
    String bus_profile_id;
    String driver_id;
    String conductor_id;
    String bus_id;

    public Busprofile(String bus_profile_id, String bus_id, String driver_id, String conductor_id){
        this.bus_profile_id = bus_profile_id;
        this.bus_id = bus_id;
        this.driver_id = driver_id;
        this.conductor_id = conductor_id;
    }

    public String getBusprofile_id(){
        return bus_profile_id;
    }
    public String getDriver_id(){
        return driver_id;
    }
    public String getConductor_id(){
        return conductor_id;
    }
    public String getBus_id(){
        return bus_id;
    }


    public void setBusprofile_id(String bus_profile_id){
        this.bus_profile_id = bus_profile_id;
    }
    public void setDriver_id(String driver_id){
        this.driver_id = driver_id;
    }
    public void setConductor_id(String conductor_id){
        this.conductor_id = conductor_id;
    }
    public void setBus_id(String bus_id){
        this.bus_id = bus_id;
    }

}
