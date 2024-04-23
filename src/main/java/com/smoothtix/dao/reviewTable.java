package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Review;

import java.sql.*;

public class reviewTable {
    public static String insert(Review review) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into review(review_id, point_id, schedule_id, comments) values (?,?,?,?)");

        String bookingID = review.getBooking_id();
        String review_id = generateReviewID(bookingID);
        String schedule_id = getScheduleID(bookingID);
        pst.setString(1, review_id);
        pst.setString(2, review.getPoint_id());
        pst.setString(3, schedule_id);
        pst.setString(4, review.getComments());

        int rawCount = pst.executeUpdate();
        if(rawCount >= 0){
            System.out.println(review.getComments());
            return "{\"review_id\":\"" + review_id + "\"}";
        }
        return "Unsuccessful";
    }

    public static String generateReviewID(String bookingID) throws SQLException{

        String reviewID = bookingID.replace("BK","REVW");
        System.out.println("Review Profile ID: " + reviewID);
        return reviewID;
    }

    public static String getBusProfileID(String bookingID) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement(
                "SELECT s.bus_profile_id " +
                        "FROM booking b " +
                        "JOIN schedule s ON b.schedule_id = s.schedule_id " +
                        "WHERE b.booking_id = ?");
        pst.setString(1, bookingID);
        ResultSet rs = pst.executeQuery();
        String busProfileID = null;
        if (rs.next()) {
            busProfileID = rs.getString("bus_profile_id");
            System.out.println("Bus Profile ID: " + busProfileID);
        }
        return busProfileID;
    }

    public static String getScheduleID(String bookingID) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement(
                "SELECT s.schedule_id " +
                "FROM booking b " +
                "JOIN schedule s ON b.schedule_id = s.schedule_id " +
                "WHERE b.booking_id = ?");
        pst.setString(1, bookingID);
        ResultSet rs = pst.executeQuery();
        String schedule_id = null;
        if (rs.next()) {
            schedule_id = rs.getString("schedule_id");
            System.out.println("Bus Profile ID: " + schedule_id);
        }
        return schedule_id;
    }

    public static ResultSet getByc_Id(String conductor_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    s.date_time,\n" +
                "    CONCAT(r.start, '-', r.destination) AS route,\n" +
                "    b.reg_no,\n" +
                "    p.conductor_points\n" +
                "FROM\n" +
                "    schedule s\n" +
                "JOIN\n" +
                "    bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN\n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN\n" +
                "    route r ON b.route_id = r.route_id\n" +
                "JOIN\n" +
                "    conductor c ON bp.conductor_id = c.conductor_id\n" +
                "JOIN\n" +
                "    review rw ON s.schedule_id = rw.schedule_id\n" +
                "JOIN\n" +
                "    points p ON rw.point_id = p.point_id\n" +
                "WHERE\n" +
                "    c.conductor_id = ?;");
        pst.setString(1,conductor_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getByd_Id(String driver_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    s.date_time AS schedule_date_time,\n" +
                "    CONCAT(r.start, '-', r.destination) AS route,\n" +
                "    b.reg_no AS bus_registration_number,\n" +
                "    p.driver_points AS driver_points\n" +
                "FROM\n" +
                "    schedule s\n" +
                "JOIN\n" +
                "    bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN\n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN\n" +
                "    route r ON b.route_id = r.route_id\n" +
                "JOIN\n" +
                "    driver d ON bp.driver_id = d.driver_id\n" +
                "JOIN\n" +
                "    points p ON c.p_id = p.point_id\n" +
                "WHERE\n" +
                "    c.driver_id = ?;");
        pst.setString(1,driver_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

}
