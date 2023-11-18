package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Driver;

import java.sql.*;

public class driverTable {
    public static int insert(Driver driver) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into driver(driver_id, passenger_id, license_no, name, nic, mobile, email, points) values (?,?,?,?,?,?,?,?)");
        pst.setString(1,generateDriverID());
//        pst.setString(2,generateOwnerID(bus.getOwner_nic()));
        pst.setString(2,driver.getDriver_id());
        pst.setString(3,driver.getPassenger_id());
        pst.setString(4,driver.getLicense_no());
        pst.setString(5,driver.getName());
        pst.setString(6,driver.getNic());
        pst.setString(7,driver.getMobile());
        pst.setString(8,driver.getEmail());
        pst.setString(9,driver.getPoints());
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    private static String generateDriverID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT MAX(CAST(SUBSTRING(driver_id, 2) AS SIGNED)) + 1 AS next_driver_id FROM driver";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextDriverID = 1;
        if (rs.next()) {
            nextDriverID = rs.getInt("next_driver_id");
        }

        con.close();

        return "B" + String.format("%03d", nextDriverID);
    }

//    private static String generateOwnerID(String owner_nic) throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("SELECT owner_id FROM owner WHERE owner_nic=?");
//        pst.setString(1,owner_nic);
//        ResultSet rs = pst.executeQuery();
//
//        if (rs.next()) {
//            return rs.getString("owner_id");
//        }
//        else{
//            String query = "SELECT MAX(CAST(SUBSTRING(owner_id, 2) AS SIGNED)) + 1 AS next_owner_id FROM owner";
//            Statement stmt = con.createStatement();
//            ResultSet rs_new = ((Statement) stmt).executeQuery(query);
//
//            int nextOwnerID = 1;
//            if (rs_new.next()) {
//                nextOwnerID = rs_new.getInt("next_owner_id");
//            }
//            return "Owner" + String.format("%03d", nextOwnerID);
//        }
//    }


    public static ResultSet get(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM driver WHERE driver_id=?");
        pst.setString(1,driver_id);
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM driver");
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static int update(String driver_id, Driver driver) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE driver SET driver_id=?, passenger_id=?, license_no=?, name=?, nic=?, mobile=?, email=?, points=? WHERE driver_id=?");
//        pst.setString(1,generateOwnerID(driver.getOwner_nic()));
        pst.setString(1,driver.getDriver_id());
        pst.setString(2,driver.getPassenger_id());
        pst.setString(3,driver.getLicense_no());
        pst.setString(4,driver.getName());
        pst.setInt(5,driver.getNic());
        pst.setString(6,driver.getMobile());
        pst.setString(7,driver.getEmail());
        pst.setString(8,driver.getPoints());
        pst.setString(9,driver_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static int delete(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM driver WHERE driver_id = ?");
        pst.setString(1,driver_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }
}
