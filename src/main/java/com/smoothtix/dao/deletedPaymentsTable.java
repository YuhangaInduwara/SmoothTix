package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.SmoothPoint;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class deletedPaymentsTable {
    public static int insert(String payment_id, String p_id) throws SQLException, ClassNotFoundException {
        ResultSet rs = paymentTable.get_by_payment_id(payment_id);
        if (rs.next()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime currentDateTime = LocalDateTime.now();
            String date_time = currentDateTime.format(formatter);
            double amount = rs.getDouble("amount");
            Connection con = dbConnection.initializeDatabase();
            PreparedStatement pst1 = con.prepareStatement("insert into deleted_payment(payment_id, date_time, amount) values (?,?,?)");
            pst1.setString(1, payment_id);
            pst1.setString(2, date_time);
            pst1.setDouble(3, amount);
            int insertSuccess = pst1.executeUpdate();
            if (insertSuccess > 0) {
                SmoothPoint smoothPoint = new SmoothPoint(p_id, amount);
                return smoothPointTable.updateAdd(smoothPoint);
            }
            else{
                return 0;
            }
        }
        else{
            return 0;
        }
    }

    public static int insertPartially(String payment_id, double amount, String p_id) throws SQLException, ClassNotFoundException {
        ResultSet rs = paymentTable.get_by_payment_id(payment_id);
        if (rs.next()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime currentDateTime = LocalDateTime.now();
            String date_time = currentDateTime.format(formatter);
            System.out.println(amount);
            Connection con = dbConnection.initializeDatabase();
            PreparedStatement pst1 = con.prepareStatement("insert into deleted_payment(payment_id, date_time, amount) values (?,?,?)");
            pst1.setString(1, payment_id);
            pst1.setString(2, date_time);
            pst1.setDouble(3, amount);
            int insertSuccess = pst1.executeUpdate();
            if (insertSuccess > 0) {
                SmoothPoint smoothPoint = new SmoothPoint(p_id, amount);
                return smoothPointTable.updateAdd(smoothPoint);
            }
            else{
                return 0;
            }
        }
        else{
            return 0;
        }
    }

    private static String generateBookingID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(booking_id, 4) AS SIGNED)), 0) + 1 AS next_booking_id FROM booking";
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
                "SELECT \n" +
                        "    b.booking_id, \n" +
                        "    bu.reg_no, \n" +
                        "    s.date_time, \n" +
                        "    s.schedule_id, \n" +
                        "    s.status AS schedule_status, \n" +
                        "    r.start, \n" +
                        "    r.destination, \n" +
                        "    r.route_no, \n" +
                        "    b.status, \n" +
                        "    p.amount, \n" +
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
                        "JOIN \n" +
                        "    payment p ON b.payment_id = p.payment_id\n" +
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
                "SELECT \n" +
                        "    b.booking_id, \n" +
                        "    bu.reg_no, \n" +
                        "    s.date_time, \n" +
                        "    s.schedule_id, \n" +
                        "    r.start, \n" +
                        "    r.destination, \n" +
                        "    b.status, \n" +
                        "    p.payment_id, \n" +
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
                        "JOIN \n" +
                        "    payment p ON b.payment_id = p.payment_id\n" +
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


    public static int deleteBookedSeats(String booking_id, int[] selectedSeats) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM booked_seats WHERE booking_id = ? AND seat_no = ?");

        int deletedCount = 0;

        for (int seat : selectedSeats) {
            pst.setString(1, booking_id);
            pst.setInt(2, seat);
            int rowsAffected = pst.executeUpdate();
            deletedCount += rowsAffected;
        }

        return deletedCount;
    }
}