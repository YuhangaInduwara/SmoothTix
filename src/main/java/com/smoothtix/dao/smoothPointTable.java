package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.SmoothPoint;

import java.sql.*;

public class smoothPointTable {
    public static ResultSet getBy_p_id(String p_id) throws SQLException, ClassNotFoundException {
        // Initialize a connection to the database
        Connection con = dbConnection.initializeDatabase();

        // Prepare SQL query to retrieve smooth point data for the specified passenger ID
        PreparedStatement pst = con.prepareStatement("SELECT smooth_points FROM passenger WHERE p_id=?");

        // Set the passenger ID parameter in the prepared statement
        pst.setString(1, p_id);

        // Execute the SQL query and return the ResultSet containing the smooth point data
        return pst.executeQuery();
    }

    public static int updateAdd(SmoothPoint smoothPoint) throws SQLException, ClassNotFoundException {
        // Initialize a connection to the database
        Connection con = dbConnection.initializeDatabase();

        // Prepare SQL statement to update the smooth points by adding the specified amount
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET smooth_points=smooth_points+? WHERE p_id=?");

        // Set the amount parameter in the prepared statement
        pst.setDouble(1, getSmoothPoints(smoothPoint.get_amount()));

        // Set the passenger ID parameter in the prepared statement
        pst.setString(2, smoothPoint.get_p_id());

        // Execute the SQL update statement and return the number of rows affected
        return pst.executeUpdate();
    }

    public static int updateSubtract(SmoothPoint smoothPoint) throws SQLException, ClassNotFoundException {
        // Initialize a connection to the database
        Connection con = dbConnection.initializeDatabase();

        // Prepare SQL statement to update the smooth points by subtracting the specified amount
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET smooth_points=smooth_points-? WHERE p_id=?");

        // Set the amount parameter in the prepared statement
        pst.setDouble(1, getSmoothPoints(smoothPoint.get_amount()));

        // Set the passenger ID parameter in the prepared statement
        pst.setString(2, smoothPoint.get_p_id());

        // Execute the SQL update statement and return the number of rows affected
        return pst.executeUpdate();
    }

    //Converts an amount to smooth points by dividing it by 100.
    private static double getSmoothPoints(double amount){
        return amount/100;
    }
}
