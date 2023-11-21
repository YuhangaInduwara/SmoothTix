package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.Route;

import java.sql.*;

public class routeTable {
    public static int insert(Route route) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into route(route_id, route_no, start, destination, distance, price_per_ride) values (?,?,?,?,?,?)");
        pst.setString(1,generateRouteID());
        pst.setString(2,route.get_route_no());
        pst.setString(3,route.get_start());
        pst.setString(4,route.get_destination());
        pst.setDouble(5,route.get_distance());
        pst.setDouble(6,route.get_price_per_ride());
        return pst.executeUpdate();
    }


    private static String generateRouteID() throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(route_id, 3) AS SIGNED)), 0) + 1 AS next_route_id FROM route";
        stmt = con.createStatement();
        rs = stmt.executeQuery(query);

        int nextRouteID = 1;
        if (rs.next()) {
            nextRouteID = rs.getInt("next_route_id");
        }

        return "R" + String.format("%04d", nextRouteID);
    }


    public static ResultSet get(String route_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM route WHERE route_id=?");
        pst.setString(1,route_id);
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM route");
        return pst.executeQuery();
    }

    public static int update(String route_id, Route route) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE route SET route_no=?, start=?, destination=?, distance=?, price_per_ride=? WHERE route_id=?");
        pst.setString(1,route.get_route_no());
        pst.setString(2,route.get_start());
        pst.setString(3,route.get_destination());
        pst.setDouble(4,route.get_distance());
        pst.setDouble(5,route.get_price_per_ride());
        pst.setString(6,route_id);
        return pst.executeUpdate();
    }


    public static int delete(String route_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM route WHERE route_id = ?");
        pst.setString(1,route_id);
            return pst.executeUpdate();
    }
}
