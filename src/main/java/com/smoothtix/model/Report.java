package com.smoothtix.model;

public class Report {
    private String timePeriod;
    private String busRegNo;
    private int totalSeatsBooked;
    private double totalPaymentsDeleted;
    private double finalAmount;
    private String startDate;
    private String endDate;

    public Report(String timePeriod, String busRegNo, int totalSeatsBooked, double totalPaymentsDeleted, double finalAmount) {
        this.timePeriod = timePeriod;
        this.busRegNo = busRegNo;
        this.totalSeatsBooked = totalSeatsBooked;
        this.totalPaymentsDeleted = totalPaymentsDeleted;
        this.finalAmount = finalAmount;
    }

    public Report(String startDate, String endDate, String busRegNo) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.busRegNo = busRegNo;
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

    public String getBusRegNo() {
        return busRegNo;
    }

    public void setBusRegNo(String busRegNo) {
        this.busRegNo = busRegNo;
    }

    public int getTotalSeatsBooked() {
        return totalSeatsBooked;
    }

    public void setTotalSeatsBooked(int totalSeatsBooked) {
        this.totalSeatsBooked = totalSeatsBooked;
    }

    public double getTotalPaymentsDeleted() {
        return totalPaymentsDeleted;
    }

    public void setTotalPaymentsDeleted(double totalPaymentsDeleted) { this.totalPaymentsDeleted = totalPaymentsDeleted;}

    public double getFinalAmount() {return finalAmount;}

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }
}
