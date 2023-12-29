package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Booking;
import com.smoothtix.model.Payment;

import java.sql.*;

public class paymentTable {
    public static String insert(Payment payment) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into payment(payment_id, date_time, amount) values (?,?,?)");
        String payment_id = generatePaymentID();
        pst.setString(1, payment_id);
        pst.setString(2, payment.getDate_Time());
        pst.setDouble(3, payment.getAmount());

        int rawCount = pst.executeUpdate();
        if(rawCount >= 0){
//            return payment_id;
            return "{\"payment_id\":\"" + payment_id + "\"}";
        }
        return "Unsuccessful";
    }

    private static String generatePaymentID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(payment_id, 4) AS SIGNED)), 0) + 1 AS next_payment_id FROM payment";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextPaymentID = 1;
        if (rs.next()) {
            nextPaymentID = rs.getInt("next_payment_id");
        }

        return "PMT" + String.format("%04d", nextPaymentID);
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


//    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("SELECT * FROM booking");
//        ResultSet rs = pst.executeQuery();
//        return rs;
//    }
}