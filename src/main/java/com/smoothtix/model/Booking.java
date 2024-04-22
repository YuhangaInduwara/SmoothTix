package com.smoothtix.model;


public class Booking {
    String booking_id;
    String payment_id;
    String schedule_id;
    String p_id;
    Boolean status;
    int[] selectedSeats;

    public Booking(String payment_id, String schedule_id, String p_id, Boolean status, int[] selectedSeats){
        this.payment_id = payment_id;
        this.p_id = p_id;
        this.schedule_id = schedule_id;
        this.status = status;
        this.selectedSeats = selectedSeats;
    }

    public Booking(String booking_id, Boolean status){
        this.booking_id = booking_id;
        this.status = status;
    }

    public Booking(String booking_id, int[] selectedSeats){
        this.booking_id = booking_id;
        this.selectedSeats = selectedSeats;
    }

    public String getBooking_id(){
        return booking_id;
    }
    public String getPayment_id(){
        return payment_id;
    }
    public String getSchedule_id(){ return schedule_id; }
    public String getP_id(){ return p_id; }
    public Boolean getStatus(){ return status; }
    public int[] getSelectedSeats(){
        return selectedSeats;
    }

    public void setBooking_id(String booking_id){
        this.booking_id = booking_id;
    }
    public void setPayment_id(String payment_id){
        this.payment_id = payment_id;
    }
    public void setSchedule_id(String schedule_id){
        this.schedule_id = schedule_id;
    }
    public void setP_id(String p_id){
        this.p_id = p_id;
    }
    public void setStatus(Boolean status){
        this.status = status;
    }
    public void setSelectedSeats(int[] selectedSeats){ this.selectedSeats = selectedSeats; }
}

