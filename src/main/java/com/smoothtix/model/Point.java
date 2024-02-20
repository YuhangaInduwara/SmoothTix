package com.smoothtix.model;

public class Point {
    String point_id;
    int driverRating;
    int busRating;
    int conductorRating;
    String booking_id;

    public Point(int driverRating, int busRating, int conductorRating, String booking_id){
        this.driverRating = driverRating;
        this.busRating = busRating;
        this.conductorRating = conductorRating;
        this.booking_id = booking_id;
    }

    public String getPoint_id(){return point_id;}
    public int getDriverRating() {return driverRating;}
    public int getBusRating(){return busRating;}
    public int getConductorRating(){return  conductorRating;}
    public String getBooking_id(){return booking_id;}

    public void setPoint_id(String point_id){this.point_id = point_id;}
    public void setDriverRating(int driverRating){this.driverRating = driverRating;}
    public void  setBusRating(int busRating){this.busRating = busRating;}
    public void setConductorRating(int conductorRating){this.conductorRating = conductorRating;}


}
