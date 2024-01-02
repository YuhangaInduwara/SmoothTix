package com.smoothtix.model;

public class SeatAvailability {
    String schedule_id;
    int seat_no;
    Boolean availability;


    public SeatAvailability(String schedule_id, int seat_no, Boolean availability){
        this.schedule_id = schedule_id;
        this.seat_no = seat_no;
        this.availability = availability;
    }

    public String getSchedule_id(){
        return schedule_id;
    }
    public int getSeatNo(){
        return seat_no;
    }
    public Boolean getAvailability(){
        return availability;
    }


    public void setSchedule_id(String schedule_id){
        this.schedule_id = schedule_id;
    }
    public void setSeatNo(int seat_no){
        this.seat_no = seat_no;
    }
    public void setAvailability(Boolean availability){
        this.availability = availability;
    }

}

