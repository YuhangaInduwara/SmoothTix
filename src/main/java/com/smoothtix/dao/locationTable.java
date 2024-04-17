package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Location;
import com.smoothtix.model.Schedule;

import java.sql.*;

public class locationTable {
    public static int insert(Location location) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into location(location_id, schedule_id, latitude, longitude) values (?,?,?,?)");
        pst.setString(1,generateLocationID());
        pst.setString(2,location.getSchedule_id());
        pst.setDouble(3,location.getLatitude());
        pst.setDouble(4,location.getLongitude());

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    private static String generateLocationID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(location_id, 2) AS SIGNED)), 0) + 1 AS next_location_id FROM location";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextLocationID = 1;
        if (rs.next()) {
            nextLocationID = rs.getInt("next_location_id");
        }

        return "L" + String.format("%04d", nextLocationID);
    }

    public static ResultSet getByScheduleId(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM location WHERE schedule_id=?");
        pst.setString(1,schedule_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }
//
//    public static ResultSet getByDriverId(String driver_id) throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("SELECT s.*, r.route_no, r.start, r.destination\n" +
//                "FROM schedule s\n" +
//                "JOIN bus_profile b ON s.bus_profile_id = b.bus_profile_id\n" +
//                "JOIN bus bs ON b.bus_id = bs.bus_id\n" +
//                "JOIN route r ON bs.route_id = r.route_id\n" +
//                "WHERE b.driver_id = ?;");
//        pst.setString(1,driver_id);
//        ResultSet rs = pst.executeQuery();
//        return rs;
//    }
//
//    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("SELECT * FROM schedule");
//        ResultSet rs = pst.executeQuery();
//        return rs;
//    }
//
    public static int update(String schedule_id, Location location) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

        PreparedStatement pst = con.prepareStatement("UPDATE location SET latitude=?, longitude=? WHERE schedule_id=?");
        pst.setDouble(1,location.getLatitude());
        System.out.println("lat: " + location.getLatitude());
        pst.setDouble(2,location.getLongitude());
        System.out.println("lon: " + location.getLongitude());
        pst.setString(3,schedule_id);

        int rawCount = pst.executeUpdate();
        return rawCount;
    }
//
//    public static int delete(String schedule_id) throws SQLException, ClassNotFoundException {
//        Connection con = dbConnection.initializeDatabase();
//        PreparedStatement pst = con.prepareStatement("DELETE FROM schedule WHERE schedule_id = ?");
//        pst.setString(1,schedule_id);
//        int rawCount = pst.executeUpdate();
//        return rawCount;
//    }
}
