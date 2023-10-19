package com.smoothtix.model;

public class Bus {
    String bus_id;
    String owner_nic;
    String route;
    String engineNo;
    String chassisNo;
    int noOfSeats;
    String manufact_year;
    String brand;
    String model;

    public Bus(String bus_id, String owner_id, String route, String engineNo, String chassisNo, int noOfSeats, String manufact_year, String brand, String model){
        this.bus_id = bus_id;
        this.owner_nic = owner_nic;
        this.route = route;
        this.engineNo = engineNo;
        this.chassisNo = chassisNo;
        this.noOfSeats = noOfSeats;
        this.manufact_year = manufact_year;
        this.brand = brand;
        this.model = model;
    }

    public String getBus_id(){
        return bus_id;
    }
    public String getOwner_nic(){ return owner_nic; }
    public String getRoute(){ return route; }
    public String getEngineNo(){
        return engineNo;
    }
    public String getChassisNo(){
        return chassisNo;
    }
    public int getNoOfSeats(){
        return noOfSeats;
    }
    public String getManufact_year(){
        return manufact_year;
    }
    public String getBrand(){
        return brand;
    }
    public String getModel(){
        return model;
    }

    public void setBus_id(String bus_id){
        this.bus_id = bus_id;
    }
    public void setOwner_nic(String owner_id){
        this.owner_nic = owner_id;
    }
    public void setroute(String route){this.route = route; }
    public void setEngineNo(String engineNo){ this.engineNo = engineNo; }
    public void setChassisNo(String chassisNo){ this.chassisNo = chassisNo; }
    public void setNoOfSeats(int noOfSeats){ this.noOfSeats = noOfSeats; }
    public void setManufact_year(String manufact_year){
        this.manufact_year = manufact_year;
    }
    public void setBrand(String brand){
        this.brand = brand;
    }
    public void setModel(String model){
        this.model = model;
    }
}

