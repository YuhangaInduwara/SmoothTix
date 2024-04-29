package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class seatAvailabilityTable {
    public static int insert(String schedule_id, int no_of_seats) throws SQLException, ClassNotFoundException {
        // Initialize a connection to the database
        Connection con = dbConnection.initializeDatabase();

        // Prepare SQL statement to insert seat availability data
        PreparedStatement pst = con.prepareStatement("INSERT INTO seat_availability (schedule_id, seat_no, availability) VALUES (?, ?, ?)");

        // Variable to track the total number of rows affected by the insert operation
        int rawCount = 0;

        // Iterate over each seat number and insert availability data
        for (int seatNo = 1; seatNo <= no_of_seats; seatNo++) {
            pst.setString(1, schedule_id);
            pst.setInt(2, seatNo);
            pst.setInt(3, 1); // Assuming availability is initially set to 1
            rawCount += pst.executeUpdate();
        }

        // Close the PreparedStatement
        pst.close();

        // Return the total number of rows affected by the insert operation
        return rawCount;
    }

    public static ResultSet getByScheduleId(String schedule_id) throws SQLException, ClassNotFoundException {
        // Initialize a connection to the database
        Connection con = dbConnection.initializeDatabase();

        // Prepare SQL statement to retrieve seat availability data for the specified schedule ID
        PreparedStatement pst = con.prepareStatement("SELECT seat_no, availability FROM seat_availability WHERE schedule_id=?");

        // Set the schedule ID parameter in the prepared statement
        pst.setString(1, schedule_id);

        // Execute the SQL query and return the ResultSet containing the seat availability data
        ResultSet rs = pst.executeQuery();

        // Return the ResultSet
        return rs;
    }

    public static int updateSeatNo(String scheduleId, int[] selectedSeats) throws SQLException {
        // Initialize a connection to the database
        Connection con = dbConnection.initializeDatabase();

        // Prepare SQL statement to update the availability status of selected seats
        PreparedStatement pst = con.prepareStatement("UPDATE seat_availability SET availability = ? WHERE schedule_id=? AND seat_no=?");

        // Variable to track the total number of rows affected by the update operation
        int rawCount = 0;

        // Iterate over each selected seat and update its availability status
        for (int seat : selectedSeats) {
            // Set the availability status to true
            pst.setBoolean(1, true);
            // Set the schedule ID parameter in the prepared statement
            pst.setString(2, scheduleId);
            // Set the seat number parameter in the prepared statement
            pst.setInt(3, seat);
            // Execute the SQL update statement and get the number of rows affected
            int rowsAffected = pst.executeUpdate();
            // Update the total number of rows affected
            rawCount += rowsAffected;
        }

        // Return the total number of rows affected by the update operation
        return rawCount;
    }

}
