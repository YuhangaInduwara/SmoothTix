package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Passenger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class passengerTable {
    public static int insert(Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into passenger(fname,lname,nic,mobileNo,email,password,priority) values (?,?,?,?,?,?,?)");
        pst.setString(1,passenger.getfname());
        pst.setString(2,passenger.getlname());
        pst.setString(3,passenger.getnic());
        pst.setString(4,passenger.getmobileNo());
        pst.setString(5,passenger.getemail());
        pst.setString(6,passenger.getpassword());
        pst.setInt(7,passenger.getpriority());
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static ResultSet get(String nic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE nic=?");
        pst.setString(1,nic);
        return pst.executeQuery();
    }

    public static int update(String nic, Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET fname=?, lname=?, nic=?, mobileNo=?, email=?, password=? WHERE nic=?");
        pst.setString(1,passenger.getfname());
        pst.setString(2,passenger.getlname());
        pst.setString(3,passenger.getnic());
        pst.setString(4,passenger.getmobileNo());
        pst.setString(5,passenger.getemail());
        pst.setString(6,passenger.getpassword());
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static int delete(String nic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM passenger WHERE nic = ?");
        pst.setString(1,nic);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }
}
