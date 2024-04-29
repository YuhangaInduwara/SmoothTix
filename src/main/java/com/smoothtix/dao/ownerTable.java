package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;

import java.sql.*;

public class ownerTable {

    // Method to check if a passenger is an owner
    public static boolean isOwner(String p_id) throws SQLException, ClassNotFoundException {
        boolean isOwner = false;
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM owner WHERE p_id = ?");
        pst.setString(1, p_id);
        ResultSet rs = pst.executeQuery();
        isOwner = rs.next(); // Set to true if the ResultSet contains any rows
        return isOwner;
    }

    // Method to get owner ID by passenger ID
    public static String getOwnerIDByPassengerID(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT owner_id FROM owner WHERE p_id = ?");
        pst.setString(1, p_id);
        ResultSet rs = pst.executeQuery();

        if (rs.next()) {
            return rs.getString("owner_id");
        } else {
            return null;
        }
    }

    // Method to insert a new owner record
    public static String insertOwner(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("INSERT INTO owner (owner_id, p_id) VALUES (?, ?)");
        String ownerID = generateOwnerID();
        pst.setString(1, ownerID);
        pst.setString(2, p_id);
        pst.executeUpdate();
        return ownerID;
    }

    // Method to generate a new owner ID
    private static String generateOwnerID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT MAX(CAST(SUBSTRING(owner_id, 6) AS SIGNED)) AS max_owner_id FROM owner";
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        int maxOwnerID = 0;
        if (rs.next()) {
            maxOwnerID = rs.getInt("max_owner_id");
        }

        int nextOwnerID = maxOwnerID + 1;

        return "OWNER" + String.format("%03d", nextOwnerID);
    }

    // Method to get owner record by passenger ID
    public static ResultSet getByP_id(String p_id) throws SQLException, ClassNotFoundException{
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM owner WHERE p_id = ?");
        pst.setString(1, p_id);
        return pst.executeQuery();
    }
}
