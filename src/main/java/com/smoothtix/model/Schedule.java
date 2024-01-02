package com.smoothtix.model;

public class Schedule {
    String schedule_id;
    String date;
    String route_id;
    String start;
    String destination;
    String start_time;
    String end_time;

    public Schedule(String schedule_id, String date, String route_id, String start, String destination, String start_time, String end_time){
        this.schedule_id = schedule_id;
        this.date = date;
        this.route_id = route_id;
        this.start = start;
        this.destination = destination;
        this.start_time = start_time;
        this.end_time = end_time;
    }

    public String getSchedule_id(){
        return schedule_id;
    }
    public String getDate(){
        return date;
    }
    public String getRoute_id(){
        return route_id;
    }
    public String getStart(){
        return start;
    }


    public String getDestination(){
        return destination;
    }
    public String getStart_time(){
        return start_time;
    }
    public String getEnd_time(){
        return end_time;
    }

    public void setSchedule_id(String schedule_id){
        this.schedule_id = schedule_id;
    }
    public void setDate(String date){
        this.date = date;
    }
    public void setRoute_id(String route_id){
        this.route_id = route_id;
    }
    public void setStart(String start){
        this.start = start;
    }


    public void setDestination(String destination){
        this.destination = destination;
    }
    public void setStart_time(String start_time){
        this.start_time = start_time;
    }
    public void setEnd_time(String end_time){
        this.end_time = end_time;
    }
}

