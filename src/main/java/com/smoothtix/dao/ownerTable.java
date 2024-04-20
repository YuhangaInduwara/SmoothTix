package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;

import java.sql.*;

public class ownerTable {

    public static boolean isOwner(String p_id) throws SQLException, ClassNotFoundException {
        boolean isOwner = false;
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM owner WHERE p_id = ?");
        pst.setString(1, p_id);
        ResultSet rs = pst.executeQuery();
        isOwner = rs.next();
        return isOwner;
    }

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

    public static String insertOwner(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("INSERT INTO owner (owner_id, p_id) VALUES (?, ?)");
        String ownerID = generateOwnerID(); // Generate owner ID
        pst.setString(1, ownerID);
        pst.setString(2, p_id);
        pst.executeUpdate();
        return ownerID;
    }

    private static String generateOwnerID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT MAX(CAST(SUBSTRING(owner_id, 6) AS SIGNED)) AS max_owner_id FROM owner";
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        int maxOwnerID = 0;
        if (rs.next()) {
            maxOwnerID = rs.getInt("max_owner_id");
        }

        // Increment the maximum owner ID
        int nextOwnerID = maxOwnerID + 1;

        return "OWNER" + String.format("%03d", nextOwnerID);
    }
}