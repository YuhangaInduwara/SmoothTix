package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.Driver;
import java.sql.*;

public class driverTable {
    public static int insert(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE p_id=?");
        pst.setString(1, p_id);
        ResultSet rs = pst.executeQuery();
        if (rs.next()) {
            if (rs.getBoolean("flag")) {
                return 2;
            } else {
                if (rs.getInt("privilege_level") == 2) {
                    return 3;
                } else if (rs.getInt("privilege_level") == 1 || rs.getInt("privilege_level") == 3 || rs.getInt("privilege_level") == 4 || rs.getInt("privilege_level") == 5) {
                    return 4;
                } else if (rs.getInt("privilege_level") == 6) {
                    PreparedStatement ps = con.prepareStatement("insert into driver(driver_id, p_id) values (?,?)");
                    ps.setString(1, generate_driver_id());
                    ps.setString(2, rs.getString("p_id"));
                    Passenger passenger = new Passenger(rs.getString("p_id"), 2);
                    int success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
                    if (success == 1) {
                        return ps.executeUpdate();
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        } else {
            return 0;
        }

    }
    private static String generate_driver_id () throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(driver_id, 3) AS SIGNED)), 0) + 1 AS next_driver_id FROM driver";
        stmt = con.createStatement();
        rs = stmt.executeQuery(query);

        int nextdriverID = 1;
        if (rs.next()) {
            nextdriverID = rs.getInt("next_driver_id");
        }

        return "D" + String.format("%04d", nextdriverID);
    }



    public static ResultSet get(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM driver WHERE driver_id=?");
        pst.setString(1,driver_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM driver");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String driver_id, Driver driver) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE driver SET driver_id=?, license_no=? ,review_points=? WHERE driver_id=?");
        pst.setString(1,driver.getDriver_id());
        pst.setString(2,driver.getLicence_no());
        pst.setFloat(3,driver.getPoints());
        pst.setString(4,driver_id);

        int rawCount = pst.executeUpdate();

//        con.close();
        return rawCount;
    }



    public static int delete(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        int success = -1;
        PreparedStatement pst1 = con.prepareStatement("SELECT p_id FROM driver WHERE driver_id = ?");
        pst1.setString(1,driver_id);
        ResultSet rs =  pst1.executeQuery();
        if(rs.next()){
            Passenger passenger = new Passenger (rs.getString("p_id"), 6);
            success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
        }
        PreparedStatement pst2 = con.prepareStatement("DELETE FROM driver WHERE driver_id = ?");
        pst2.setString(1,driver_id);
        if(success >= 1){
            return pst2.executeUpdate();
        }
        else{
            return 0;
        }
    }}

