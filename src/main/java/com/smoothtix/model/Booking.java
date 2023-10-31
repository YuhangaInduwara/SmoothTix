package com.smoothtix.model;

public class Booking {
    String booking_id;
    String schedule_id;
    String route_id;
    String date;
    String time;
    int seat_no;
    String price;

    public Booking(String booking_id, String schedule_id, String route_id, String date, String time, int seat_no, String price){
        this.booking_id = booking_id;
        this.schedule_id = schedule_id;
        this.route_id = route_id;
        this.date = date;
        this.time = time;
        this.seat_no = seat_no;
        this.price = price;
    }

    public String getBooking_id(){
        return booking_id;
    }
    public String getSchedule_id(){ return schedule_id; }
    public String getRoute_id(){ return route_id; }
    public String getdate(){
        return date;
    }
    public String getTime(){
        return time;
    }
    public int getseat_no(){
        return seat_no;
    }
    public String getPrice(){
        return price;
    }

    public void setBooking_id(String booking_id){
        this.booking_id = booking_id;
    }
    public void setSchedule_id(String schedule_id){
        this.schedule_id = schedule_id;
    }
    public void setRoute_id(String route_id){this.route_id = route_id; }
    public void setdate(String date){ this.date = date; }
    public void settime(String time){ this.time = time; }
    public void setseat_no(int seat_no){ this.seat_no = seat_no; }
    public void setPrice(String price){
        this.price = price;
    }
}

