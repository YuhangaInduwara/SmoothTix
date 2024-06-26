package com.smoothtix.dao;
import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Conductor;
import com.smoothtix.model.Passenger;

import java.sql.*;

public class conductorTable {
    public static int insert(String nic,String owner_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE nic=?");
        pst.setString(1, nic);
        ResultSet rs = pst.executeQuery();
        if (rs.next()) {

            if (rs.getInt("privilege_level") == 5) {
                return 3;
            } else if (rs.getInt("privilege_level") == 1 || rs.getInt("privilege_level") == 2 || rs.getInt("privilege_level") == 3 || rs.getInt("privilege_level") == 4) {
                return 4;
            } else if (rs.getInt("privilege_level") == 6) {
                PreparedStatement ps = con.prepareStatement("insert into conductor(conductor_id, p_id ,review_points, owner_id) values (?,?,?,?)");

                ps.setString(1, generate_conductor_id());
                ps.setString(2, rs.getString("p_id"));
                ps.setDouble(3, 0);
                ps.setString(4, owner_id);
                Passenger passenger = new Passenger(rs.getString("nic"), 5);
                int success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
                if (success == 1) {
                    int success1 = ps.executeUpdate();
                    if (success1 == 1) {
                        return 1;
                    } else {
                        Passenger passenger2 = new Passenger(rs.getString("nic"), 6);
                        passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger2);
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

    private static String generate_conductor_id() throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(conductor_id, 4) AS SIGNED)), 0) + 1 AS next_conductor_id FROM conductor";
        stmt = con.createStatement();
        rs = stmt.executeQuery(query);

        int nextconductorID = 1;
        if (rs.next()) {
            nextconductorID = rs.getInt("next_conductor_id");
        }

        return "C" + String.format("%04d", nextconductorID);
    }

    public static ResultSet get(String conductor_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM conductor WHERE conductor_id=?");
        pst.setString(1,conductor_id);
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM conductor");
        return pst.executeQuery();
    }
    public static ResultSet get_by_p_id(String p_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM conductor WHERE p_id=?");
        pst.setString(1,p_id);
        return pst.executeQuery();
    }

    public static ResultSet counter() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS record_count FROM conductor");
        return pst.executeQuery();
    }

    public static ResultSet get_NIC(String p_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
            String sql = "SELECT p.nic " +
                    "FROM owner o " +
                    "JOIN conductor c ON o.owner_id = c.owner_id " +
                    "JOIN passenger p ON c.p_id = p.p_id " +
                    "WHERE o.p_id = ?;";

        PreparedStatement pst = con.prepareStatement(sql);
        pst.setString(1, p_id);
        return pst.executeQuery();
    }

    public static ResultSet getAllByOwner(String p_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement(
                "SELECT * FROM conductor " +
                        "WHERE owner_id IN (SELECT owner_id FROM conductor WHERE owner_id IN (SELECT owner_id FROM owner WHERE p_id = ?))"
        );
        pst.setString(1, p_id);
        return pst.executeQuery();
    }

    public static int update(String conductor_id,Conductor conductor) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE conductor SET review_points=? WHERE conductor_id=?");
        pst.setFloat(1,conductor.getReview_points());
        pst.setString(2,conductor_id);

        return pst.executeUpdate();
    }

    public static int delete(String conductor_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        int success = -1;
        PreparedStatement pst1 = con.prepareStatement("SELECT p_id FROM conductor WHERE conductor_id = ?");
        pst1.setString(1,conductor_id);
        ResultSet rs =  pst1.executeQuery();
        if(rs.next()){
            Passenger passenger = new Passenger (rs.getString("p_id"), 6);
            success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
        }
        PreparedStatement pst2 = con.prepareStatement("DELETE FROM conductor WHERE conductor_id = ?");
        pst2.setString(1,conductor_id);
        if(success >= 1){
            return pst2.executeUpdate();
        }
        else{
            return 0;
        }
    }
}
