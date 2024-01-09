package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;

import java.sql.*;

public class busTable {
    public static int insert(Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into bus(bus_id, owner_id, route, engineNo, chassisNo, noOfSeats, manufact_year, brand, model) values (?,?,?,?,?,?,?,?,?)");
        pst.setString(1,generateBusID());
//        pst.setString(2,generateOwnerID(bus.getOwner_nic()));
        pst.setString(2,bus.getOwner_nic());
        pst.setString(3,bus.getRoute());
        pst.setString(4,bus.getEngineNo());
        pst.setString(5,bus.getChassisNo());
        pst.setInt(6,bus.getNoOfSeats());
        pst.setString(7,bus.getManufact_year());
        pst.setString(8,bus.getBrand());
        pst.setString(9,bus.getModel());
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    private static String generateBusID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT MAX(CAST(SUBSTRING(bus_id, 2) AS SIGNED)) + 1 AS next_bus_id FROM bus";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextBusID = 1;
        if (rs.next()) {
            nextBusID = rs.getInt("next_bus_id");
        }

        return "B" + String.format("%03d", nextBusID);
    }

    public static ResultSet get(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus WHERE bus_id=?");
        pst.setString(1,bus_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String bus_id, Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE bus SET owner_id=?, route=?, engineNo=?, chassisNo=?, noOfSeats=?, manufact_year=?, brand=?, model=? WHERE bus_id=?");
//        pst.setString(1,generateOwnerID(bus.getOwner_nic()));
        pst.setString(1,bus.getOwner_nic());
        pst.setString(2,bus.getRoute());
        pst.setString(3,bus.getEngineNo());
        pst.setString(4,bus.getChassisNo());
        pst.setInt(5,bus.getNoOfSeats());
        pst.setString(6,bus.getManufact_year());
        pst.setString(7,bus.getBrand());
        pst.setString(8,bus.getModel());
        pst.setString(9,bus_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int delete(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM bus WHERE bus_id = ?");
        pst.setString(1,bus_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }
}
