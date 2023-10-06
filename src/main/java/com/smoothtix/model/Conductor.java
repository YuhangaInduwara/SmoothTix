package com.smoothtix.model;

public class Conductor {
    String conductor_id;
    String nic;

    public Conductor(String conductor_id, String nic){
        this.conductor_id = conductor_id;
        this.nic = nic;
    }

    public String getConductor_id(){
        return conductor_id;
    }
    public String getNIC(){
        return nic;
    }
    public void setConductor_id(String conductor_id){
        this.conductor_id = conductor_id;
    }
    public void setNIC(String nic){
        this.nic = nic;
    }
}

