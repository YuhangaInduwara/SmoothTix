package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Review;

import java.sql.*;git add .

//public class reviewTable {
//    public static String insert(Review review) throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("insert into review(review_id, point_id, bus_profile_id, comment) values (?,?,?,?)");
//        String review_id = generateReviewID();
//        pst.setString(1, payment_id);
//        pst.setString(2, payment.getDate_Time());
//        pst.setDouble(3, payment.getAmount());
//
//        int rawCount = pst.executeUpdate();
//        if(rawCount >= 0){
////            return payment_id;
//            return "{\"payment_id\":\"" + payment_id + "\"}";
//        }
//        return "Unsuccessful";
//    }
//
//
//
//}
