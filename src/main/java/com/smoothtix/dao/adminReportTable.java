package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.AdminReport;

import java.sql.*;

public class adminReportTable {
    public static AdminReport generateReport(String startDate, String endDate, String routeNo) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement ps = null;
        ResultSet rs = null;
        System.out.println(startDate);
        System.out.println(endDate);
        System.out.println(routeNo);

        // Get total seats booked
        String sql2 = "SELECT COUNT(*) AS total_seats_booked\n" +
                "FROM booking b\n" +
                "INNER JOIN schedule s ON b.schedule_id = s.schedule_id\n" +
                "INNER JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "INNER JOIN bus bu ON bp.bus_id = bu.bus_id\n" +
                "INNER JOIN route r ON bu.route_id = r.route_id\n" +
                "INNER JOIN booked_seats bs ON b.booking_id = bs.booking_id\n" +
                "WHERE r.route_no = ?\n" +
                "AND s.date_time BETWEEN ? AND ?; ";
        ps = con.prepareStatement(sql2);
        ps.setString(1, routeNo);
        ps.setString(2, startDate);
        ps.setString(3, endDate);
        rs = ps.executeQuery();
        int totalSeatsBooked = rs.next() ? rs.getInt("total_seats_booked") : 0;


        String sql3 = "SELECT COALESCE(SUM(p.amount), 0) AS total_amount\n" +
                "FROM booking b\n" +
                "INNER JOIN payment p ON b.payment_id = p.payment_id\n" +
                "INNER JOIN schedule s ON b.schedule_id = s.schedule_id\n" +
                "INNER JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "INNER JOIN bus bu ON bp.bus_id = bu.bus_id\n" +
                "INNER JOIN route r ON bu.route_id = r.route_id\n" +
                "INNER JOIN booked_seats bs ON b.booking_id = bs.booking_id\n" +
                "WHERE r.route_no = ?\n" +
                "AND s.date_time BETWEEN ? AND ?;";
        ps = con.prepareStatement(sql3);
        ps.setString(1, routeNo);
        ps.setString(2, startDate);
        ps.setString(3, endDate);
        rs = ps.executeQuery();

        double TotalAmount = rs.next() ? rs.getDouble("total_amount") : 0;

        double commission = TotalAmount * 0.05;
        TotalAmount -= commission;

        String sql4 = "SELECT COUNT(*) AS total_buses_scheduled\n" +
                "FROM schedule s\n" +
                "INNER JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "INNER JOIN bus b ON bp.bus_id = b.bus_id\n" +
                "INNER JOIN route r ON b.route_id = r.route_id\n" +
                "WHERE r.route_no = ?\n" +
                "AND s.date_time BETWEEN ? AND ?;";
        ps = con.prepareStatement(sql4);
        ps.setString(1, routeNo);
        ps.setString(2, startDate);
        ps.setString(3, endDate);
        rs = ps.executeQuery();
        int totalBusesScheduled = rs.next() ? rs.getInt("total_buses_scheduled") : 0;

        // Create a report entry
        String sql5 = "INSERT INTO admin_reports (report_id, date_time, report_details) VALUES (?, NOW(), ?)";
        ps = con.prepareStatement(sql5);
        ps.setString(1, generateReportID());
        System.out.println(generateReportID());
        ps.setString(2, String.format("Bus Reg No: %s, Date Range: %s to %s, Total Amount: Rs.%f, Total Seats Booked: %d, Total buses scheduled on that route: %d, Commission: Rs.%f",
                routeNo, startDate, endDate, TotalAmount, totalSeatsBooked, totalBusesScheduled, commission));
        ps.executeUpdate();

        AdminReport report = new AdminReport(startDate + " to " + endDate, routeNo, totalSeatsBooked, totalBusesScheduled, commission,TotalAmount);
        return report;

    }
    private static String generateReportID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(report_id, 3) AS SIGNED)), 0) + 1 AS next_report_id FROM admin_reports";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextReportID = 1;
        if (rs.next()) {
            nextReportID = rs.getInt("next_report_id");
        }

        return "RP" + String.format("%04d", nextReportID);
    }
}
