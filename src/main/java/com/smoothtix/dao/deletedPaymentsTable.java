package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.SmoothPoint;

import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class deletedPaymentsTable {
    // Method to insert a deleted payment record based on an existing payment ID
    public static int insert(String payment_id, String p_id) throws SQLException, ClassNotFoundException {
        ResultSet rs = paymentTable.get_by_payment_id(payment_id);
        if (rs.next()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime currentDateTime = LocalDateTime.now();
            String date_time = currentDateTime.format(formatter);
            double amount = rs.getDouble("amount");

            // Initialize database connection
            Connection con = dbConnection.initializeDatabase();

            // Prepare SQL statement to insert the deleted payment record
            PreparedStatement pst1 = con.prepareStatement("insert into deleted_payment(payment_id, date_time, amount) values (?,?,?)");
            pst1.setString(1, payment_id);
            pst1.setString(2, date_time);
            pst1.setDouble(3, amount);

            int insertSuccess = pst1.executeUpdate();
            if (insertSuccess > 0) {
                // If insertion is successful, update or add SmoothPoint based on the amount
                SmoothPoint smoothPoint = new SmoothPoint(p_id, amount);
                return smoothPointTable.updateAdd(smoothPoint);
            } else {
                return 0;  // Return 0 if insertion fails
            }
        } else {
            return 0;  // Return 0 if no corresponding payment record is found
        }
    }

    // Method to insert a partially deleted payment record
    public static int insertPartially(String payment_id, double amount, String p_id) throws SQLException, ClassNotFoundException {
        ResultSet rs = paymentTable.get_by_payment_id(payment_id);
        if (rs.next()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime currentDateTime = LocalDateTime.now();
            String date_time = currentDateTime.format(formatter);

            Connection con = dbConnection.initializeDatabase();
            PreparedStatement pst1 = con.prepareStatement("insert into deleted_payment(payment_id, date_time, amount) values (?,?,?)");
            pst1.setString(1, payment_id);
            pst1.setString(2, date_time);
            pst1.setDouble(3, amount);

            int insertSuccess = pst1.executeUpdate();
            if (insertSuccess > 0) {
                SmoothPoint smoothPoint = new SmoothPoint(p_id, amount);
                return smoothPointTable.updateAdd(smoothPoint);
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    // Method to retrieve all booking records
    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM booking");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    // Method to delete a booking record based on booking_id
    public static int delete(String booking_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM booking WHERE booking_id = ?");
        pst.setString(1,booking_id);
        int rawCount = pst.executeUpdate();
        return rawCount;  // Return the number of affected rows
    }
}
