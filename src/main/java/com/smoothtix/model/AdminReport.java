package com.smoothtix.model;

public class AdminReport {
    private String timePeriod;
    private String routeNo;
    private int totalSeatsBooked;
    private int totalBusesScheduled;
    private double TotalAmount;
    private String startDate;
    private String endDate;
    private double commission;


    // Constructor, getters, and setters
    public AdminReport(String timePeriod, String routeNo, int totalSeatsBooked, int totalBusesScheduled, double commission, double TotalAmount) {
        this.timePeriod = timePeriod;
        this.routeNo = routeNo;
        this.totalSeatsBooked = totalSeatsBooked;
        this.totalBusesScheduled = totalBusesScheduled;
        this.commission =commission;
        this.TotalAmount = TotalAmount;
    }

    public AdminReport(String startDate, String endDate, String routeNo) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.routeNo = routeNo;
    }


    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public String getTimePeriod() {
        return timePeriod;
    }

    public void setTimePeriod(String timePeriod) {
        this.timePeriod = timePeriod;
    }

    public String getRouteNo() {
        return routeNo;
    }

    public void setRouteNo(String routeNo) { this.routeNo = routeNo;
    }
    public double getCommission() {
        return commission;
    }

    public void setCommission(double commission) {
        this.commission = commission;
    }

    public int getTotalSeatsBooked() {
        return totalSeatsBooked;
    }

    public void setTotalSeatsBooked(int totalSeatsBooked) {
        this.totalSeatsBooked = totalSeatsBooked;
    }

    public double getTotalBusesScheduled() {
        return totalBusesScheduled;
    }

    public void setTotalBusesScheduled(int totalBusesScheduled) {
        this.totalBusesScheduled = totalBusesScheduled;
    }

    public double getTotalAmount() {
        return TotalAmount;
    }

    public void setTotalAmount(double TotalAmount) {
        this.TotalAmount = TotalAmount;
    }
}


