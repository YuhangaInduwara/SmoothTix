package com.smoothtix.model;

public class Feasibility {
    private String bus_id;
    private String date;
    private String time_range;
    private String availability;

    public String getBusId() {
        return bus_id;
    }
    public void setBusId(String bus_id) {
        this.bus_id = bus_id;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public String getTimeRange() {
        return time_range;
    }
    public void setTimeRange(String time_range) {
        this.time_range = time_range;
    }
    public String getAvailability() {
        return availability;
    }
    public void setAvailability(String availability) {
        this.availability = availability;
    }
    public Feasibility(String bus_id, String date, String time_range, String availability) {
        this.bus_id = bus_id;
        this.date = date;
        this.time_range = time_range;
        this.availability = availability;
    }
}
