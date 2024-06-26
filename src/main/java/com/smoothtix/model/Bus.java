package com.smoothtix.model;

public class Bus {
    String bus_id;
    String owner_id;
    String reg_no;
    String route_no;
    Integer no_of_Seats;
    double review_points;
    int status;

    public Bus(String bus_id, String owner_id, String reg_no, String route_no, Integer no_of_Seats, double review_points){
        this.bus_id = bus_id;
        this.owner_id = owner_id;
        this.reg_no = reg_no;
        this.route_no = route_no;
        this.no_of_Seats = no_of_Seats;
        this.review_points = review_points;
    }

    public Bus(String bus_id, String owner_id, String reg_no, String route_id, Integer no_of_Seats, double review_points, int status){
        this.bus_id = bus_id;
        this.owner_id = owner_id;
        this.reg_no = reg_no;
        this.route_no = route_id;
        this.no_of_Seats = no_of_Seats;
        this.review_points = review_points;
        this.status = status;
    }

    public String getBus_id(){
        return bus_id;
    }
    public String getOwner_id(){ return owner_id; }
    public String getReg_no(){ return reg_no; }
    public String getRoute_id(){
        return route_no;
    }
    public Integer getNoOfSeats(){
        return no_of_Seats;
    }
    public double getReview_points(){
        return review_points;
    }
    public int getStatus(){
        return status;
    }

    public void setBus_id(String bus_id){
        this.bus_id = bus_id;
    }
    public void setOwner_id(String owner_id){
        this.owner_id = owner_id;
    }
    public void setReg_no(String reg_no){this.reg_no = reg_no; }
    public void setRoute_id(String route_id){ this.route_no = route_id; }
    public void setNoOfSeats(Integer no_of_Seats){ this.no_of_Seats = no_of_Seats; }
    public void setReview_points(double review_points){
        this.review_points = review_points;
    }
    public void setStatus(int status){
        this.status = status;
    }

}

