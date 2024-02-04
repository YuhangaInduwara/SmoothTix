package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Review;

import java.sql.*;

public class reviewTable {
    public static String insert(Review review) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into review(review_id, point_id, bus_profile_id, comment) values (?,?,?,?)");
//        String review_id = generateReviewID();
//        String point_id = generatePointID();
//        String busProfile_id = getBusProfileID();
//        pst.setString(1, review_id);
//        pst.setString(2, point_id);
//        pst.setString(3, busProfile_id);
        pst.setString(4, review.getComments());

        int rawCount = pst.executeUpdate();
        if(rawCount >= 0){
////            return payment_id;
//            return "{\"payment_id\":\"" + payment_id + "\"}";
        }
        return "Unsuccessful";
    }

//    public static String generateReviewID() throws SQLException{
//
//
//        return "RV" + bookingID.subString(2);
//    }



}
