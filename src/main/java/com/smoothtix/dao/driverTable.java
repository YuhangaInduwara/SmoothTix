package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.Driver;
import java.sql.*;

public class driverTable {
    public static int insert(String nic, String license_no,String owner_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE nic=?");
        pst.setString(1, nic);
        ResultSet rs = pst.executeQuery();
        if (rs.next()) {

            if (rs.getInt("privilege_level") == 4) {
                return 3;
            } else if (rs.getInt("privilege_level") == 1 || rs.getInt("privilege_level") == 2 || rs.getInt("privilege_level") == 3 || rs.getInt("privilege_level") == 5) {
                return 4;
            } else if (rs.getInt("privilege_level") == 6) {
                PreparedStatement ps = con.prepareStatement("insert into driver(driver_id, p_id,license_no ,review_points, owner_id) values (?,?,?,?,?)");

                ps.setString(1, generate_driver_id());
                ps.setString(2, rs.getString("p_id"));
                ps.setString(3, license_no);
                ps.setFloat(4, 1.0f);
                ps.setString(5, owner_id);

                Passenger passenger = new Passenger(rs.getString("nic"), 4);
                int success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
                if (success == 1) {
                    int success1 = ps.executeUpdate();
                    if (success1 == 1) {
                        return 1;
                    } else {
                        Passenger passenger2 = new Passenger(rs.getString("nic"), 6);
                        int success2 = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger2);
                        return -1;
                    }
                } else {
                    return -1;
                }
            } else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }
    private static String generate_driver_id () throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(driver_id, 4) AS SIGNED)), 0) + 1 AS next_driver_id FROM driver";
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

    public static ResultSet get_by_p_id(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        System.out.println("dao: "+p_id);
        PreparedStatement pst = con.prepareStatement("SELECT * FROM driver WHERE p_id=?");
        pst.setString(1,p_id);
        return pst.executeQuery();
    }
    public static ResultSet get_NIC(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String sql = "SELECT p.nic " +
                "FROM owner o " +
                "JOIN driver d ON o.owner_id = d.owner_id " +
                "JOIN passenger p ON d.p_id = p.p_id " +
                "WHERE o.p_id = ?;";

        PreparedStatement pst = con.prepareStatement(sql);
        pst.setString(1, p_id);
        return pst.executeQuery();
    }

    public static ResultSet getAllByOwner(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement(
                "SELECT * FROM driver " +
                        "WHERE owner_id IN (SELECT owner_id FROM driver WHERE owner_id IN (SELECT owner_id FROM owner WHERE p_id = ?))"
        );
        pst.setString(1, p_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }



    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM driver");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet counter() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS record_count FROM driver");
        return pst.executeQuery();
    }

    public static int update(String driver_id, Driver driver) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE driver SET license_no=? WHERE driver_id=?");
        pst.setString(1,driver.getLicense_no());
        pst.setString(2,driver_id);

        int rawCount = pst.executeUpdate();
        return rawCount;
    }


    public static int delete(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        int success = -1;
        System.out.println(driver_id);
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
    }
}