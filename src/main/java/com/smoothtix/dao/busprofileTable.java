package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Busprofile;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class busprofileTable {
    public static int insert(Busprofile busprofile) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into busprofile(busprofile_id, driver_id, conductor_id, noOfSeats, route) values (?,?,?,?,?)");
        pst.setString(1,busprofile.getBusprofile_id());
        pst.setString(2,busprofile.getDriver_id());
        pst.setString(3,busprofile.getConductor_id());
        pst.setInt(4,busprofile.getNoOfSeats());
        pst.setString(5,busprofile.getRoute());
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static ResultSet get(String busprofile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM busprofile WHERE busprofile_id=?");
        pst.setString(1,busprofile_id);
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM busprofile");
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static int update(String busprofile_id, Busprofile busprofile) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE busprofile SET busprofile_id=?, driver_id=?, conductor_id=?, noOfSeats=?, route=? WHERE busprofile_id=?");
        pst.setString(1,busprofile.getBusprofile_id());
        pst.setString(2,busprofile.getDriver_id());
        pst.setString(3,busprofile.getConductor_id());
        pst.setInt(4,busprofile.getNoOfSeats());
        pst.setString(5,busprofile.getRoute());
        pst.setString(6,busprofile_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static int delete(String busprofile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM busprofile WHERE busprofile_id = ?");
        pst.setString(1,busprofile_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }
}
