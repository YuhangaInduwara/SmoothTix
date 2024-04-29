package com.smoothtix.dao;
import com.smoothtix.database.dbConnection;
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
            return "{\"payment_id\":\"" + payment_id + "\"}";
        }
        return "Unsuccessful";
    }

    private static String generatePaymentID() throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(payment_id, 4) AS SIGNED)), 0) + 1 AS next_payment_id FROM payment";
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        int nextPaymentID = 1;
        if (rs.next()) {
            nextPaymentID = rs.getInt("next_payment_id");
        }
        return "PMT" + String.format("%04d", nextPaymentID);
    }

    public static int updateFlag(String payment_id, boolean flag) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE payment SET flag=? WHERE payment_id=?");
        pst.setBoolean(1,flag);
        pst.setString(2,payment_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int updateAmount(String payment_id, double priceDeduct) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE payment SET amount=amount-? WHERE payment_id=?");
        pst.setDouble(1,priceDeduct);
        pst.setString(2,payment_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static ResultSet get_by_payment_id(String payment_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM payment WHERE payment_id=?");
        pst.setString(1,payment_id);
        return pst.executeQuery();
    }
}