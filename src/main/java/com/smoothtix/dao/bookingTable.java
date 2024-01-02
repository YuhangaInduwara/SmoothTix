package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Booking;

import java.sql.*;
import java.util.Arrays;

public class bookingTable {
    public static String insert(Booking booking) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst1 = con.prepareStatement("insert into booking(booking_id, payment_id, schedule_id, p_id) values (?,?,?,?)");
        String booking_id = generateBookingID();
        pst1.setString(1, booking_id);
        pst1.setString(2, booking.getPayment_id());
        pst1.setString(3, booking.getSchedule_id());
        pst1.setString(4, booking.getP_id());
        int rawCount1 = pst1.executeUpdate();
        if(rawCount1 >= 0){
            for (int seat : booking.getSelectedSeats()) {
                PreparedStatement pst2 = con.prepareStatement("insert into booked_seats(p_id, booking_id, seat_no) values (?,?,?)");
                pst2.setString(1, booking.getP_id());
                pst2.setString(2, booking_id);
                pst2.setInt(3, seat);
                int rawCount2 = pst2.executeUpdate();
                if(rawCount2 <= 0){
                    return "Unsuccessful";
                }
                else{
                    PreparedStatement pst3 = con.prepareStatement("UPDATE seat_availability SET availability=false WHERE schedule_id=? AND seat_no=?");
                    pst3.setString(1, booking.getSchedule_id());
                    pst3.setInt(2, seat);
                    int rawCount3 = pst3.executeUpdate();
                    if(rawCount3 <= 0){
                        return "Unsuccessful";
                    }
                }
            }

            PreparedStatement pst4 = con.prepareStatement("SELECT email FROM passenger WHERE p_id = ?");
            pst4.setString(1, booking.getP_id());
            ResultSet rs = pst4.executeQuery();
            if (rs.next()) {
                return "{\"booking_id\":\"" + booking_id + "\", \"p_id\":\"" + booking.getP_id() + "\", \"email\":\"" + rs.getString("email") + "\"}";
            } else {
                return "Unsuccessful";
            }        }
        return "Unsuccessful";
    }

    private static String generateBookingID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(booking_id, 3) AS SIGNED)), 0) + 1 AS next_booking_id FROM booking";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextBookingID = 1;
        if (rs.next()) {
            nextBookingID = rs.getInt("next_booking_id");
        }

        return "BK" + String.format("%04d", nextBookingID);
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
        return rs;
    }
}