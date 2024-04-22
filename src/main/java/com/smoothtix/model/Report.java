package com.smoothtix.model;

public class Report {
    private String reportId;
    private String ownerId;
    private String dateTime;
    private String reportDetails;
    private double totalRevenue;
    private byte[] pdfData;

    public Report() {
        // Default constructor
    }

    public Report(String reportId, String ownerId, String dateTime, String reportDetails, double totalRevenue, byte[] pdfData) {
        this.reportId = reportId;
        this.ownerId = ownerId;
        this.dateTime = dateTime;
        this.reportDetails = reportDetails;
        this.totalRevenue = totalRevenue;
        this.pdfData = pdfData;
    }

    // Getters and Setters
    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getReportDetails() {
        return reportDetails;
    }

    public void setReportDetails(String reportDetails) {
        this.reportDetails = reportDetails;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public byte[] getPdfData() {
        return pdfData;
    }

    public void setPdfData(byte[] pdfData) {
        this.pdfData = pdfData;
    }
}