package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Booking;
import com.smoothtix.model.Bus;

import java.sql.*;

public class bookingTable {
    public static int insert(Booking booking) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into booking(booking_id, schedule_id, route_id, date, time, seat_no, price) values (?,?,?,?,?,?,?)");
        pst.setString(1, booking.getBooking_id());
        pst.setString(2, booking.getSchedule_id());
        pst.setString(3, booking.getRoute_id());
        pst.setString(4, booking.getdate());
        pst.setString(5, booking.getTime());
        pst.setInt(6, booking.getseat_no());
        pst.setString(7, booking.getPrice());
        int rawCount = pst.executeUpdate();
        con.close();
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

        con.close();

        return "B" + String.format("%03d", nextBusID);
    }

//    private static String generateOwnerID(String owner_nic) throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("SELECT owner_id FROM owner WHERE owner_nic=?");
//        pst.setString(1,owner_nic);
//        ResultSet rs = pst.executeQuery();
//
//        if (rs.next()) {
//            return rs.getString("owner_id");
//        }
//        else{
//            String query = "SELECT MAX(CAST(SUBSTRING(owner_id, 2) AS SIGNED)) + 1 AS next_owner_id FROM owner";
//            Statement stmt = con.createStatement();
//            ResultSet rs_new = ((Statement) stmt).executeQuery(query);
//
//            int nextOwnerID = 1;
//            if (rs_new.next()) {
//                nextOwnerID = rs_new.getInt("next_owner_id");
//            }
//            return "Owner" + String.format("%03d", nextOwnerID);
//        }
//    }


    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM booking");
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }
}