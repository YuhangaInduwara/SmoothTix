package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import java.sql.*;

public class passengerTable {
    public static int insert(Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into passenger(p_id,first_name,last_name,nic,email,password,flag,privilege_level) values (?,?,?,?,?,?,?,?)");
        pst.setString(1,generate_p_id());
        pst.setString(2,passenger.get_first_name());
        pst.setString(3,passenger.get_last_name());
        pst.setString(4,passenger.get_nic());
        pst.setString(5,passenger.get_email());
        pst.setString(6,passenger.get_password());
        pst.setBoolean(7,false);
        pst.setInt(8,6);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    private static String generate_p_id() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(p_id, 2) AS SIGNED)), 0) + 1 AS next_p_id FROM passenger";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextPassengerID = 1;
        if (rs.next()) {
            nextPassengerID = rs.getInt("next_p_id");
        }

        return "P" + String.format("%04d", nextPassengerID);
    }

    public static ResultSet getBy_p_id(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE p_id=?");
        pst.setString(1,p_id);
        return pst.executeQuery();
    }

    public static ResultSet getBy_nic(String nic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE nic=?");
        pst.setString(1,nic);
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String p_id, Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET first_name=?, last_name=?, nic=?, email=? WHERE p_id=?");
        pst.setString(1,passenger.get_first_name());
        pst.setString(2,passenger.get_last_name());
        pst.setString(3,passenger.get_nic());
        pst.setString(4,passenger.get_email());
        pst.setString(5,p_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int updatePassword(String p_id, Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET password=? WHERE p_id=?");
        pst.setString(1,passenger.get_password());
        pst.setString(2,p_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int updateFlag(String p_id, Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET flag=? WHERE p_id=?");
        pst.setBoolean(1,!passenger.get_flag());
        pst.setString(2,p_id);
        int rawCount = pst.executeUpdate();

        return rawCount;
    }

    public static int updatePrivilegeLevel(String p_id, Passenger passenger) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET privilege_level=? WHERE p_id=?");
        pst.setInt(1,passenger.get_privilege_level());
        pst.setString(2,p_id);
        int rawCount = pst.executeUpdate();


        return rawCount;
    }

    public static int delete(String nic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM passenger WHERE nic = ?");
        pst.setString(1,nic);
        int rawCount = pst.executeUpdate();

        return rawCount;
    }
}
