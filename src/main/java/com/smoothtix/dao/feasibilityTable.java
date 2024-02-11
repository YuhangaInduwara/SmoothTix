package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Feasibility;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class feasibilityTable {

    public static int insert(Feasibility feasibility) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("INSERT INTO feasible_schedule(bus_id, date, time_range, availability) VALUES (?, ?, ?, ?)");
        pst.setString(1, feasibility.getBus_id());
        pst.setDate(2, feasibility.getDate());
        pst.setString(3, feasibility.getTime_range());
        pst.setInt(4, feasibility.getAvailability());

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static ResultSet get(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile WHERE bus_id = ?");
        pst.setString(1, bus_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }
    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile");
        ResultSet rs = pst.executeQuery();
        return rs;
    }
}
