package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Route;

import java.sql.*;
import java.util.Objects;

public class routeTable {
    public static int insert(Route route) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement ps1 = con.prepareStatement("SELECT * FROM route WHERE route_no=?");
        ps1.setString(1,route.get_route_no());
        ResultSet rs1= ps1.executeQuery();
        if(rs1.next()){
            return 100;
        }

        PreparedStatement ps2 = con.prepareStatement("SELECT * FROM route WHERE start=? AND destination=?");
        ps2.setString(1,route.get_start());
        ps2.setString(2,route.get_destination());
        ResultSet rs2= ps2.executeQuery();
        if(rs2.next()){
            return 101;
        }

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

    public static ResultSet getStands(String route_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT start FROM route UNION SELECT destination FROM route;");
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    route.route_id,\n" +
                "    route.route_no,\n" +
                "    route.start,\n" +
                "    route.destination,\n" +
                "    route.distance,\n" +
                "    route.price_per_ride,\n" +
                "    COUNT(bus.bus_id) AS number_of_buses\n" +
                "FROM\n" +
                "    route\n" +
                "LEFT JOIN\n" +
                "    bus ON route.route_id = bus.route_id\n" +
                "GROUP BY\n" +
                "    route.route_id, route.route_no, route.start, route.destination, route.distance, route.price_per_ride;");
        return pst.executeQuery();
    }

    public static int update(String route_id, Route route) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement ps1 = con.prepareStatement("SELECT * FROM route WHERE route_no=?");
        ps1.setString(1,route.get_route_no());
        ResultSet rs1= ps1.executeQuery();
        while(rs1.next()){
            if(!Objects.equals(rs1.getString("route_id"), route_id)){
                return 100;
            }
        }

        PreparedStatement ps2 = con.prepareStatement("SELECT * FROM route WHERE start=? AND destination=?");
        ps2.setString(1,route.get_start());
        ps2.setString(2,route.get_destination());
        ResultSet rs2= ps2.executeQuery();
        while(rs2.next()){
            if(!Objects.equals(rs1.getString("route_id"), route_id)){
                return 101;
            }
        }

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
