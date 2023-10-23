package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Schedule;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class scheduleTable {
    public static int insert(Schedule schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into bus(bus_id, owner_id, engineNo, chassisNo, noOfSeats, manufact_year, brand, model) values (?,?,?,?,?,?,?,?)");
        pst.setString(1,schedule.getSchedule_id());
        pst.setString(2,schedule.getDate());
        pst.setString(3,schedule.getRoute_id());
        pst.setString(4,schedule.getStart());
        pst.setString(5,schedule.getDestination());
        pst.setString(6,schedule.getStart_time());
        pst.setString(7,schedule.getEnd_time());

        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static ResultSet get(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus WHERE bus_id=?");
        pst.setString(1,bus_id);
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM schedule");
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static int update(String bus_id, Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE bus SET bus_id=?, owner_id=?, engineNo=?, chassisNo=?, noOfSeats=?, manufact_year=?, brand=?, model=? WHERE bus_id=?");
        pst.setString(1,bus.getBus_id());
//        pst.setString(2,bus.getOwner_id());
        pst.setString(3,bus.getEngineNo());
        pst.setString(4,bus.getChassisNo());
        pst.setInt(5,bus.getNoOfSeats());
        pst.setString(6,bus.getManufact_year());
        pst.setString(7,bus.getBrand());
        pst.setString(8,bus.getModel());
        pst.setString(9,bus_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static int delete(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM bus WHERE bus_id = ?");
        pst.setString(1,bus_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }
}
