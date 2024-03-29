package com.smoothtix.model;

public class Bus {
    String bus_id;
    String owner_id;
    String reg_no;
    String route_id;
    Integer no_of_Seats;
    Float reveiw_points;

    public Bus(String bus_id, String owner_id, String reg_no, String route_id, Integer no_of_Seats, Float reveiw_points){
        this.bus_id = bus_id;
        this.owner_id = owner_id;
        this.reg_no = reg_no;
        this.route_id = route_id;
        this.no_of_Seats = no_of_Seats;
        this.reveiw_points = reveiw_points;
    }

    public String getBus_id(){
        return bus_id;
    }
    public String getOwner_id(){ return owner_id; }
    public String getReg_no(){ return reg_no; }
    public String getRoute_id(){
        return route_id;
    }
    public Integer getNoOfSeats(){
        return no_of_Seats;
    }
    public Float getReveiw_points(){
        return reveiw_points;
    }

    public void setBus_id(String bus_id){
        this.bus_id = bus_id;
    }
    public void setOwner_id(String owner_id){
        this.owner_id = owner_id;
    }
    public void setReg_no(String reg_no){this.reg_no = reg_no; }
    public void setRoute_id(String route_id){ this.route_id = route_id; }
    public void setNoOfSeats(Integer no_of_Seats){ this.no_of_Seats = no_of_Seats; }
    public void setReveiw_points(Float reveiw_points){
        this.reveiw_points = reveiw_points;
    }

}

