package com.smoothtix.model;

import java.sql.Date;

public class Feasibility {
    private String bus_profile_id;
    private Date date;
    private String time_range;
    private int availability;

    public String toString() {
        return "Feasibility{" +
                "bus_profile_id='" + bus_profile_id + '\'' +
                ", date=" + date +
                ", time_range='" + time_range + '\'' +
                ", availability=" + availability +
                '}';
    }
    public Feasibility(String bus_profile_id, Date date, String time_range, int availability) {
        this.bus_profile_id = bus_profile_id;
        this.date = date;
        this.time_range = time_range;
        this.availability = availability;
    }

    public String getBus_id() {
        return bus_profile_id;
    }

    public void setBus_id(String bus_id) {
        this.bus_profile_id = bus_profile_id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTime_range() {
        return time_range;
    }

    public void setTime_range(String time_range) {
        this.time_range = time_range;
    }

    public int getAvailability() {
        return availability;
    }

    public void setAvailability(int availability) {
        this.availability = availability;
    }
}
