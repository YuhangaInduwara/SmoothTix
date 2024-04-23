package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Point;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class pointTable {
    public static String insert(Point point) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into points(point_id, driver_points, conductor_points, bus_points) values (?,?,?,?)");
        String bookingID = point.getBooking_id();
        System.out.println("Point_2");

        String point_id = generatePointID(bookingID);

        pst.setString(1, point_id);
        pst.setInt(2, point.getDriverRating());
        pst.setInt(3, point.getConductorRating());
        pst.setInt(4, point.getBusRating());

        int rawCount = pst.executeUpdate();
        if(rawCount >= 0){

            return "{\"point_id\":\"" + point_id + "\"}";
        }
        return "Unsuccessful";
    }

    public static String generatePointID(String bookingID) throws SQLException{

        String pointID = bookingID.replace("BK","POINT");
        System.out.println("Point ID: " + pointID);
        return pointID;
    }
}
