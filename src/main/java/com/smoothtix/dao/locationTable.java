package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Location;

import java.sql.*;

public class locationTable {

    // Method to insert a new location record into the database
    public static int insert(Location location) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into location(location_id, schedule_id, latitude, longitude) values (?,?,?,?)");
        pst.setString(1,generateLocationID()); // Generating a new location ID
        pst.setString(2,location.getSchedule_id()); // Setting the schedule ID
        pst.setDouble(3,location.getLatitude()); // Setting the latitude
        pst.setDouble(4,location.getLongitude()); // Setting the longitude

        int rawCount = pst.executeUpdate(); // Executing the SQL statement
        return rawCount; // Returning the number of affected rows
    }

    // Method to generate a new location ID
    private static String generateLocationID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(location_id, 2) AS SIGNED)), 0) + 1 AS next_location_id FROM location";
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        int nextLocationID = 1;
        if (rs.next()) {
            nextLocationID = rs.getInt("next_location_id");
        }

        return "L" + String.format("%04d", nextLocationID); // Generating the location ID
    }

    // Method to retrieve location records by schedule ID
    public static ResultSet getByScheduleId(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM location WHERE schedule_id=?");
        pst.setString(1,schedule_id); // Setting the schedule ID parameter
        ResultSet rs = pst.executeQuery(); // Executing the SQL query
        return rs; // Returning the ResultSet containing location data
    }

    // Method to update location data for a given schedule ID
    public static int update(String schedule_id, Location location) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

        PreparedStatement pst = con.prepareStatement("UPDATE location SET latitude=?, longitude=? WHERE schedule_id=?");
        pst.setDouble(1,location.getLatitude()); // Setting the latitude parameter
        pst.setDouble(2,location.getLongitude()); // Setting the longitude parameter
        pst.setString(3,schedule_id); // Setting the schedule ID parameter

        int rawCount = pst.executeUpdate(); // Executing the SQL statement
        return rawCount; // Returning the number of affected rows
    }

}
