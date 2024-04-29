package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Feasibility;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class feasibilityTable {

    // Method to insert a new feasibility record into the database
    public static int insert(Feasibility feasibility) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("INSERT INTO feasible_schedule(bus_profile_id, date, time_range, availability) VALUES (?, ?, ?, ?)");
        pst.setString(1, feasibility.getBus_id());
        pst.setDate(2, feasibility.getDate());
        pst.setString(3, feasibility.getTime_range());
        pst.setInt(4, 1); // Assuming availability is initially set to 1 (available)

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    // Method to retrieve a feasibility record by bus profile ID
    public static ResultSet get(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile WHERE bus_profile_id = ?");
        pst.setString(1, bus_profile_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    // Method to retrieve all feasibility records from the database
    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM feasible_schedule");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    // Method to retrieve feasibility records by start, destination, and date
    public static ResultSet get_by_date(String start, String destination, String date) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    bp.bus_profile_id,\n" +
                "    fs.time_range\n" +
                "FROM\n" +
                "    feasible_schedule fs\n" +
                "JOIN\n" +
                "    bus_profile bp ON fs.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN\n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN\n" +
                "    route r ON b.route_id = r.route_id\n" +
                "WHERE\n" +
                "    ((r.start = ? AND r.destination = ?) OR (r.start = ? AND r.destination = ?))\n" +
                "    AND fs.date = ?;");
        pst.setString(1, start);
        pst.setString(2, destination);
        pst.setString(3, destination);
        pst.setString(4, start);
        pst.setString(5, date);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

}
