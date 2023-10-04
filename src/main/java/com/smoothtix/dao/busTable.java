package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class busTable {
    public static int insert(Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into bus(bus_id, owner_id, engineNo, chassisNo, noOfSeats, manufact_year, brand, model) values (?,?,?,?,?,?,?,?)");
        pst.setString(1,bus.getBus_id());
        pst.setString(2,bus.getOwner_id());
        pst.setString(3,bus.getEngineNo());
        pst.setString(4,bus.getChassisNo());
        pst.setInt(5,bus.getNoOfSeats());
        pst.setString(6,bus.getManufact_year());
        pst.setString(7,bus.getBrand());
        pst.setString(8,bus.getModel());
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static ResultSet get(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus WHERE bus_id=?");
        pst.setString(1,bus_id);
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus");
        return pst.executeQuery();
    }
}
