package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Busprofile;

import java.sql.*;
public class busprofileTable {
    public static int insert(Busprofile bus_profile) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into bus_profile(bus_profile_id, bus_id , driver_id, conductor_id) values (?,?,?,?)");
        pst.setString(1,generate_bus_profile_id());
        pst.setString(2,bus_profile.getBus_id());
        pst.setString(3,bus_profile.getDriver_id());
        pst.setString(4,bus_profile.getConductor_id());

        int rawCount = pst.executeUpdate();
        return rawCount;
    }
    private static String generate_bus_profile_id() throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(bus_profile_id, 4) AS SIGNED)), 0) + 1 AS next_bus_profile_id FROM bus_profile";
        stmt = con.createStatement();
        rs = stmt.executeQuery(query);

        int next_busprofileID = 1;
        if (rs.next()) {
            next_busprofileID = rs.getInt("next_bus_profile_id");
        }

        return "BP" + String.format("%04d", next_busprofileID);
    }

    public static ResultSet get(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile WHERE bus_profile_id=?");
        pst.setString(1,bus_profile_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String bus_profile_id, Busprofile bus_profile) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE bus_profile SET bus_profile_id=?, bus_id=? , driver_id=?, conductor_id=? WHERE bus_profile_id=?");
        pst.setString(1,bus_profile.getBusprofile_id());
        pst.setString(2,bus_profile.getBus_id());
        pst.setString(3,bus_profile.getDriver_id());
        pst.setString(4,bus_profile.getConductor_id());
        pst.setString(5,bus_profile_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int delete(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM bus_profile WHERE bus_profile_id = ?");
        pst.setString(1,bus_profile_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }
}
