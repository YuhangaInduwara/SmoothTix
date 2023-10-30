package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Passenger;

import java.sql.*;

public class passengerTable {
    public static int insert(Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into passenger(p_id,fname,lname,nic,mobileNo,email,password,priority) values (?,?,?,?,?,?,?,?)");
        pst.setString(1,generatePID());
        pst.setString(2,passenger.getfname());
        pst.setString(3,passenger.getlname());
        pst.setString(4,passenger.getnic());
        pst.setString(5,passenger.getmobileNo());
        pst.setString(6,passenger.getemail());
        pst.setString(7,passenger.getpassword());
        pst.setInt(8,passenger.getpriority());
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    private static String generatePID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT MAX(CAST(SUBSTRING(p_id, 2) AS SIGNED)) + 1 AS next_p_id FROM passenger";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextPassengerID = 1;
        if (rs.next()) {
            nextPassengerID = rs.getInt("next_p_id");
        }

        con.close();

        return "P" + String.format("%03d", nextPassengerID);
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
