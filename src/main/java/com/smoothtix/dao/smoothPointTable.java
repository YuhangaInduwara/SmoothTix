package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.SmoothPoint;

import java.sql.*;

public class smoothPointTable {
    public static ResultSet getBy_p_id(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT smooth_points FROM passenger WHERE p_id=?");
        pst.setString(1,p_id);
        return pst.executeQuery();
    }

    public static int updateAdd(SmoothPoint smoothPoint) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET smooth_points=smooth_points+? WHERE p_id=?");
        pst.setDouble(1,getSmoothPoints(smoothPoint.get_amount()));
        pst.setString(2,smoothPoint.get_p_id());
        return pst.executeUpdate();
    }

    public static int updateSubtract(SmoothPoint smoothPoint) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE passenger SET smooth_points=smooth_points-? WHERE p_id=?");
        pst.setDouble(1,getSmoothPoints(smoothPoint.get_amount()));
        pst.setString(2,smoothPoint.get_p_id());
        return pst.executeUpdate();
    }

    private static double getSmoothPoints(double amount){
        return amount/100;
    }
}
