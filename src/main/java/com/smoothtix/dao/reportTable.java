package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Report;

import java.sql.*;

public class reportTable {
    public static Report generateReport(String startDate, String endDate, String busRegNo) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement ps = null;
        ResultSet rs = null;
        System.out.println(startDate);
        System.out.println(endDate);
        System.out.println(busRegNo);

            String sql1 = "SELECT owner_id FROM bus WHERE reg_no = ?";
            ps = con.prepareStatement(sql1);
            ps.setString(1, busRegNo);
            rs = ps.executeQuery();
            if (!rs.next()) {
                throw new SQLException("No owner found for the provided bus registration number");
            }
            String ownerId = rs.getString("owner_id");

            // Get total seats booked
            String sql2 = " SELECT COUNT(bs.seat_no) AS totalSeats \n" +
                    " FROM booking b \n" +
                    " JOIN booked_seats bs ON b.booking_id = bs.booking_id \n" +
                    " JOIN schedule sc ON b.schedule_id = sc.schedule_id\n" +
                    " JOIN bus_profile bp ON sc.bus_profile_id = bp.bus_profile_id \n" +
                    " JOIN bus bu ON bp.bus_id = bu.bus_id \n" +
                    " JOIN payment p ON b.payment_id = p.payment_id\n" +
                    " WHERE bu.reg_no = ? AND sc.date_time BETWEEN ? AND ?;";
            ps = con.prepareStatement(sql2);
            ps.setString(1, busRegNo);
            ps.setString(2, startDate);
            ps.setString(3, endDate);
            rs = ps.executeQuery();
            int totalSeatsBooked = rs.next() ? rs.getInt("totalSeats") : 0;

            // Get total payments and deleted payments
            String sql3 = "SELECT \n" +
                    "    SUM(p.amount) AS totalPayments  \n" +
                    "FROM \n" +
                    "    booking b \n" +
                    "    JOIN booked_seats bs ON b.booking_id = bs.booking_id \n" +
                    "    JOIN schedule s ON b.schedule_id = s.schedule_id \n" +
                    "    JOIN bus_profile bp ON bp.bus_profile_id = s.bus_profile_id\n" +
                    "\tJOIN bus bu ON bu.bus_id = bp.bus_id\n" +
                    "    LEFT JOIN payment p ON b.payment_id = p.payment_id \n" +
                    "    LEFT JOIN deleted_payment d ON p.payment_id = d.payment_id\n" +
                    "    WHERE bu.reg_no = ? AND p.date_time BETWEEN ? AND ? And flag != 1;";
            ps = con.prepareStatement(sql3);
            ps.setString(1, busRegNo);
            ps.setString(2, startDate);
            ps.setString(3, endDate);
            rs = ps.executeQuery();
            double totalPayments  = rs.next() ? rs.getDouble("totalPayments") : 0;

            double finalAmount = totalPayments * 0.95;

            String sql4 = "SELECT COUNT(dp.payment_id) AS deletedPayments\n" +
                    "FROM booking b\n" +
                    "JOIN booked_seats bs ON b.booking_id = bs.booking_id\n" +
                    "JOIN schedule s ON b.schedule_id = s.schedule_id\n" +
                    "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                    "JOIN bus bu ON bp.bus_id = bu.bus_id\n" +
                    "JOIN deleted_payment dp ON b.payment_id = dp.payment_id\n" +
                    "WHERE bu.reg_no = ? AND dp.date_time BETWEEN ? AND ?;";
            ps = con.prepareStatement(sql4);
            ps.setString(1, busRegNo);
            ps.setString(2, startDate);
            ps.setString(3, endDate);
            rs = ps.executeQuery();
            int totalPaymentsDeleted = rs.next() ? rs.getInt("deletedPayments") : 0;

            // Create a report entry
            String sql5 = "INSERT INTO owner_report (report_id,owner_id, date_time, report_details) VALUES (?, ?, NOW(), ?)";
            ps = con.prepareStatement(sql5);
            ps.setString(1, generateReportID());
            System.out.println(generateReportID());
            ps.setString(2, ownerId);
            ps.setString(3, String.format("Bus Reg No: %s, Date Range: %s to %s, Total Amount: Rs.%f, Total Seats Booked: %d, Total Payments Deleted: %d",
                    busRegNo, startDate, endDate, finalAmount, totalSeatsBooked, totalPaymentsDeleted));
            ps.executeUpdate();

            Report report = new Report(startDate + " to " + endDate, busRegNo, totalSeatsBooked, totalPaymentsDeleted, finalAmount);
            return report;

    }
    private static String generateReportID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(report_id, 3) AS SIGNED)), 0) + 1 AS next_report_id FROM owner_report";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextReportID = 1;
        if (rs.next()) {
            nextReportID = rs.getInt("next_report_id");
        }

        return "RP" + String.format("%04d", nextReportID);
    }
    public static Report getReportDetails(String startDate, String endDate, String busRegNo) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement ps = null;
        ResultSet rs = null;

        System.out.println(busRegNo);
        System.out.println(startDate);
        System.out.println(endDate);
        String sql = "SELECT report_details FROM owner_report WHERE owner_id = (SELECT owner_id FROM bus WHERE reg_no = ?) AND date_time BETWEEN ? AND ? ORDER BY date_time DESC LIMIT 1;";
        ps = con.prepareStatement(sql);
        ps.setString(1, busRegNo);
        ps.setString(2, startDate + " 00:00:00");
        ps.setString(3, endDate + " 23:59:59");
        rs = ps.executeQuery();

        if (rs.next()) {
            String reportDetails = rs.getString("report_details");
            String[] details = reportDetails.split(", ");

            String busRegNoExtracted = details[0].split(":")[1].trim();
            String dateRange = details[1].split(":")[1].trim(); // You might need further splitting if needed
            double finalAmount = Double.parseDouble(details[2].split(":")[1].trim().substring(3)); // Adjust index if more details are added
            int totalSeatsBooked = Integer.parseInt(details[3].split(":")[1].trim());
            int totalPaymentsDeleted = Integer.parseInt(details[4].split(":")[1].trim());

            Report report = new Report(dateRange, busRegNoExtracted, totalSeatsBooked, totalPaymentsDeleted, finalAmount);
            return report;
        } else {
            return null;
        }
    }
}
