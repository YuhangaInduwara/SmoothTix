package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.TimeKeeper;

import java.sql.*;

public class timeKprTable {
    public static int insert(String nic, String stand) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE nic=?");
        pst.setString(1, nic);
        ResultSet rs = pst.executeQuery();

        if (rs.next()) {
            if(rs.getBoolean("flag")){
                return 2;
            }
            else{
                if(rs.getInt("privilege_level") == 2){
                    return 3;
                }
                else if(rs.getInt("privilege_level") == 1 || rs.getInt("privilege_level") == 3 || rs.getInt("privilege_level") == 4 || rs.getInt("privilege_level") == 5){
                    return 4;
                }
                else if(rs.getInt("privilege_level") == 6){
                    PreparedStatement ps = con.prepareStatement("insert into timekeeper(timekpr_id, p_id,stand) values (?,?,?)");
                    ps.setString(1, generate_timekpr_id());
                    ps.setString(2, rs.getString("p_id"));
                    ps.setString(3, stand);
                    System.out.println("nic: " + rs.getString("nic"));
                    System.out.println("p_id: " + rs.getString("p_id"));
                    System.out.println("stand: " + stand);
                    Passenger passenger = new Passenger (rs.getString("nic"), 2);
                    int success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
                    if(success == 1){
                        int success1 = ps.executeUpdate();
                        if(success1 == 1){
                            return 1;
                        }
                        else{
                            Passenger passenger2 = new Passenger (rs.getString("nic"), 6);
                            int success2 = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger2);
                            return -1;
                        }
                    }
                    else{
                        return -1;
                    }
                }
                else{
                    return 0;
                }
            }
        }
        else{
            return 0;
        }
    }


    private static String generate_timekpr_id() throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(timekpr_id, 3) AS SIGNED)), 0) + 1 AS next_timekpr_id FROM timekeeper";
        stmt = con.createStatement();
        rs = stmt.executeQuery(query);

        int nextTimekprID = 1;
        if (rs.next()) {
            nextTimekprID = rs.getInt("next_timekpr_id");
        }

        return "TK" + String.format("%04d", nextTimekprID);
    }


    public static ResultSet get(String timekpr_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM timekeeper WHERE timekpr_id=?");
        pst.setString(1,timekpr_id);
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM timekeeper");

        return pst.executeQuery();
    }

    public static ResultSet counter() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS record_count FROM timekeeper");
        return pst.executeQuery();
    }

    public static ResultSet get_by_p_id(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM timekeeper WHERE p_id=?");
        pst.setString(1,p_id);
        return pst.executeQuery();
    }

    public static int update(TimeKeeper timeKeeper) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE Timekeeper SET stand=? WHERE timekpr_id=?");
        pst.setString(1,timeKeeper.get_stand());
        pst.setString(2,timeKeeper.get_timekpr_id());
        return pst.executeUpdate();
    }

    public static int delete(String timekpr_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        int success = -1;
        PreparedStatement pst1 = con.prepareStatement("SELECT p_id FROM timekeeper WHERE timekpr_id = ?");
        pst1.setString(1,timekpr_id);
        ResultSet rs =  pst1.executeQuery();
        if(rs.next()){
            Passenger passenger = new Passenger (rs.getString("p_id"), 6);
            success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
        }
        PreparedStatement pst2 = con.prepareStatement("DELETE FROM timekeeper WHERE timekpr_id = ?");
        pst2.setString(1,timekpr_id);
        if(success >= 1){
            return pst2.executeUpdate();
        }
        else{
            return 0;
        }
    }
}
