package com.smoothtix.dao;

import java.sql.*;
import java.util.UUID;

public class reportTable {
    private Connection conn;

    public reportTable(Connection dbConnection) {
        this.conn = dbConnection;
    }

    public ReportData generateReport(String busProfileId, String fromDateTime, String toDateTime) throws SQLException {
        String query = "SELECT SUM(p.amount) AS total_revenue " +
                "FROM booking b " +
                "INNER JOIN booked_seats bs ON b.booking_id = bs.booking_id " +
                "INNER JOIN schedule s ON b.schedule_id = s.schedule_id " +
                "INNER JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id " +
                "LEFT JOIN payment p ON b.payment_id = p.payment_id " +
                "WHERE bp.bus_profile_id = ? " +
                "AND b.date_time BETWEEN ? AND ? " +
                "AND (p.flag = 0 OR p.flag IS NULL)";

        PreparedStatement stmt = conn.prepareStatement(query);
        stmt.setString(1, busProfileId);
        stmt.setString(2, fromDateTime);
        stmt.setString(3, toDateTime);
        ResultSet result = stmt.executeQuery();

        if (result.next()) {
            double totalRevenue = result.getDouble("total_revenue");

            String currentUserId = getCurrentUserId(); // Replace with your method to get the current user ID
            String ownerId = getOwnerIdByUserId(currentUserId);

            String reportId = generateUniqueReportId();
            String currentDateTime = getCurrentDateTime();
            String reportDetails = "Total revenue for bus profile ID: " + busProfileId + " from " + fromDateTime + " to " + toDateTime + " is " + totalRevenue;

            insertReportDetails(reportId, ownerId, currentDateTime, reportDetails);

            // Generate the PDF report
            byte[] pdfData = generatePdfReport(reportId, reportDetails);

            return new ReportData(totalRevenue, reportDetails, pdfData);
        } else {
            throw new SQLException("No bookings found for the specified criteria.");
        }
    }

    private String getOwnerIdByUserId(String userId) throws SQLException {
        String query = "SELECT owner_id FROM owner WHERE p_id = ?";
        PreparedStatement stmt = conn.prepareStatement(query);
        stmt.setString(1, userId);
        ResultSet result = stmt.executeQuery();

        if (result.next()) {
            return result.getString("owner_id");
        } else {
            throw new SQLException("Owner not found for the given user ID.");
        }
    }

    private String generateUniqueReportId() {
        return "report_" + UUID.randomUUID().toString();
    }

    private String getCurrentDateTime() {
        // Get the current date and time in the desired format
        return new java.util.Date().toString();
    }

    private String getCurrentUserId() {
        // Replace with your method to get the current user ID
        return "user_123";
    }

    private void insertReportDetails(String reportId, String ownerId, String dateTime, String reportDetails) throws SQLException {
        String query = "INSERT INTO owner_report (report_id, owner_id, date_time, report_details) VALUES (?, ?, ?, ?)";
        PreparedStatement stmt = conn.prepareStatement(query);
        stmt.setString(1, reportId);
        stmt.setString(2, ownerId);
        stmt.setString(3, dateTime);
        stmt.setString(4, reportDetails);
        stmt.executeUpdate();
    }

    private byte[] generatePdfReport(String reportId, String reportDetails) {
        // Use a PDF generation library to create the PDF report
        // Return the PDF data or save the PDF file and return the file path
        return new byte[0]; // Replace with actual PDF generation code
    }

    public static class ReportData {
        public double totalRevenue;
        public String reportDetails;
        public byte[] pdfData;

        public ReportData(double totalRevenue, String reportDetails, byte[] pdfData) {
            this.totalRevenue = totalRevenue;
            this.reportDetails = reportDetails;
            this.pdfData = pdfData;
        }
    }
}