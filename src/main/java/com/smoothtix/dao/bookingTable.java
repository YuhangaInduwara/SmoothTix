package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Booking;
import com.smoothtix.model.Bus;

import java.sql.*;
import java.util.Arrays;

public class bookingTable {
    public static String insert(Booking booking) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst1 = con.prepareStatement("insert into booking(booking_id, payment_id, schedule_id, p_id, status) values (?,?,?,?,?)");
        String booking_id = generateBookingID();
        pst1.setString(1, booking_id);
        pst1.setString(2, booking.getPayment_id());
        pst1.setString(3, booking.getSchedule_id());
        pst1.setString(4, booking.getP_id());
        pst1.setBoolean(5, booking.getStatus());
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
            }
        }
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

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM booking");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

//    public static ResultSet counter() throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS record_count FROM booking");
//        return pst.executeQuery();
//    }

    // schedule_id, booking id, from, to, date, time, status, price, seat no, bus
    // schedule -
    public static ResultSet getByP_id(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement(
//                "SELECT b.booking_id, bs.seat_no, bu.reg_no, s.date_time, r.start, r.destination, b.status" +
//                        "FROM booking b" +
//                        "JOIN booked_seats bs ON bs.booking_id = b.booking_id" +
//                        "JOIN schedule s ON b.schedule_id = s.schedule_id" +
//                        "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id" +
//                        "JOIN bus bu ON bp.bus_id = bu.bus_id" +
//                        "JOIN route r ON bu.route_id = r.route_id" +
//                        "WHERE b.p_id = ?" +
//                        "ORDER BY s.date_time;"

//                "SELECT b.booking_id, bu.reg_no, s.date_time, r.start, r.destination, b.status " +
//                        "FROM booking b " +
//                        "JOIN schedule s ON b.schedule_id = s.schedule_id " +
//                        "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id " +
//                        "JOIN bus bu ON bp.bus_id = bu.bus_id " +
//                        "JOIN route r ON bu.route_id = r.route_id " +
//                        "WHERE b.p_id = ? " +
//                        "ORDER BY s.date_time;"
                "SELECT \n" +
                        "    b.booking_id, \n" +
                        "    bu.reg_no, \n" +
                        "    s.date_time, \n" +
                        "    r.start, \n" +
                        "    r.destination, \n" +
                        "    r.route_no, \n" +
                        "    b.status, \n" +
                        "    GROUP_CONCAT(bs.seat_no) AS booked_seats\n" +
                        "FROM \n" +
                        "    booking b \n" +
                        "JOIN \n" +
                        "    schedule s ON b.schedule_id = s.schedule_id \n" +
                        "JOIN \n" +
                        "    bus_profile bp ON s.bus_profile_id = bp.bus_profile_id \n" +
                        "JOIN \n" +
                        "    bus bu ON bp.bus_id = bu.bus_id \n" +
                        "JOIN \n" +
                        "    route r ON bu.route_id = r.route_id \n" +
                        "JOIN \n" +
                        "    booked_seats bs ON b.booking_id = bs.booking_id\n" +
                        "WHERE \n" +
                        "    b.p_id = ?\n" +
                        "GROUP BY \n" +
                        "    b.booking_id, \n" +
                        "    bu.reg_no, \n" +
                        "    s.date_time, \n" +
                        "    r.start, \n" +
                        "    r.destination, \n" +
                        "    b.status\n" +
                        "ORDER BY \n" +
                        "    s.date_time;"
        );
        pst.setString(1,p_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getByBooking_id(String booking_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement(
//                "SELECT b.booking_id, bs.seat_no, bu.reg_no, s.date_time, r.start, r.destination, b.status" +
//                        "FROM booking b" +
//                        "JOIN booked_seats bs ON bs.booking_id = b.booking_id" +
//                        "JOIN schedule s ON b.schedule_id = s.schedule_id" +
//                        "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id" +
//                        "JOIN bus bu ON bp.bus_id = bu.bus_id" +
//                        "JOIN route r ON bu.route_id = r.route_id" +
//                        "WHERE b.p_id = ?" +
//                        "ORDER BY s.date_time;"

                "SELECT \n" +
                        "    b.booking_id, \n" +
                        "    bu.reg_no, \n" +
                        "    s.date_time, \n" +
                        "    s.schedule_id, \n" +
                        "    r.start, \n" +
                        "    r.destination, \n" +
                        "    b.status, \n" +
                        "    GROUP_CONCAT(bs.seat_no) AS booked_seats\n" +
                        "FROM \n" +
                        "    booking b\n" +
                        "JOIN \n" +
                        "    schedule s ON b.schedule_id = s.schedule_id\n" +
                        "JOIN \n" +
                        "    bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                        "JOIN \n" +
                        "    bus bu ON bp.bus_id = bu.bus_id\n" +
                        "JOIN \n" +
                        "    route r ON bu.route_id = r.route_id\n" +
                        "JOIN \n" +
                        "    booked_seats bs ON b.booking_id = bs.booking_id\n" +
                        "WHERE \n" +
                        "    b.booking_id = ?\n" +
                        "ORDER BY \n" +
                        "    s.date_time;"
        );
        pst.setString(1,booking_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

//    public static int update(String booking_id, Booking booking) throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("UPDATE booking SET owner_id=?, route=?, engineNo=?, chassisNo=?, noOfSeats=?, manufact_year=?, brand=?, model=? WHERE bus_id=?");
//        pst.setString(1,booking.getOwner_nic());
//        pst.setString(2,booking.getRoute());
//        pst.setString(3,booking.getEngineNo());
//        pst.setString(4,booking.getChassisNo());
//        pst.setInt(5,booking.getNoOfSeats());
//        pst.setString(6,booking.getManufact_year());
//        pst.setString(7,booking.getBrand());
//        pst.setString(8,booking.getModel());
//        pst.setString(9,booking_id);
//        int rawCount = pst.executeUpdate();
//        return rawCount;
//    }

    public static int update_status(String booking_id, Boolean status) throws SQLException, ClassNotFoundException{
        System.out.println("Booking Id: " + booking_id + " Status: " + status);
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE booking SET status=? WHERE booking_id=?");
        pst.setBoolean(1,status);
        pst.setString(2,booking_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int delete(String booking_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM booking WHERE booking_id = ?");
        pst.setString(1,booking_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }


}