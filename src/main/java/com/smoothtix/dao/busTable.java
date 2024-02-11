package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;

import java.sql.*;

public class busTable {
    public static int insert(Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into bus(bus_id, owner_id, reg_no, route_id, no_of_Seats, reveiw_points) values (?,?,?,?,?,?)");
        pst.setString(1,generateBusID());
//        pst.setString(2,generateOwnerID(bus.getOwner_nic()));
        pst.setString(2,bus.getOwner_id());
        pst.setString(3,bus.getReg_no());
        pst.setString(4,bus.getRoute_id());
        pst.setInt(5,bus.getNoOfSeats());
        pst.setFloat(6,bus.getReveiw_points());
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    private static String generateBusID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT MAX(CAST(SUBSTRING(bus_id, 2) AS SIGNED)) + 1 AS next_bus_id FROM bus";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextBusID = 1;
        if (rs.next()) {
            nextBusID = rs.getInt("next_bus_id");
        }

        return "B" + String.format("%03d", nextBusID);
    }

    public static ResultSet get(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus WHERE bus_id=?");
        pst.setString(1,bus_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet counter() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS record_count FROM bus");
        return pst.executeQuery();
    }

    public static ResultSet get_by_reg_no(String reg_no) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus WHERE reg_no=?");
        pst.setString(1,reg_no);
        return pst.executeQuery();
    }

    public static int update(String bus_id, Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE bus SET owner_id=?, reg_no=?, route_id=?, no_of_Seats=?, reveiw_points=? WHERE bus_id=?");
//        pst.setString(1,generateOwnerID(bus.getOwner_nic()));
        pst.setString(1,bus.getOwner_id());
        pst.setString(2,bus.getReg_no());
        pst.setString(3,bus.getRoute_id());
        pst.setInt(4,bus.getNoOfSeats());
        pst.setFloat(5,bus.getReveiw_points());
        pst.setString(6,bus_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int delete(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM bus WHERE bus_id = ?");
        pst.setString(1,bus_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }
}
