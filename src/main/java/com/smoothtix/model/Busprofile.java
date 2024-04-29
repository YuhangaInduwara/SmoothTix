package com.smoothtix.model;

public class Busprofile {
    String bus_profile_id;
    String driver_nic;
    String conductor_nic;
    String reg_no;

    public Busprofile(){
    }

    public String getBusprofile_id(){
        return bus_profile_id;
    }
    public String getDriver_id(){
        return driver_nic;
    }
    public String getConductor_id(){
        return conductor_nic;
    }
    public String getBus_id(){
        return reg_no;
    }


    public void setBusprofile_id(String bus_profile_id){
        this.bus_profile_id = bus_profile_id;
    }
    public void setDriver_id(String driver_nic){
        this.driver_nic = driver_nic;
    }
    public void setConductor_id(String conductor_nic){
        this.conductor_nic = conductor_nic;
    }
    public void setBus_id(String reg_no){
        this.reg_no = reg_no;
    }

}
