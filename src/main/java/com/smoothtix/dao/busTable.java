package com.smoothtix.dao;
import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import java.sql.*;

public class busTable {
    public static int insert(Bus bus, String owner_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement routeIdQuery = con.prepareStatement("SELECT route_id FROM route WHERE route_no = ?");
        routeIdQuery.setString(1, bus.getRoute_id());
        ResultSet rs = routeIdQuery.executeQuery();

        String routeId;
        if (rs.next()) {
            routeId = rs.getString("route_id");
        } else {
            throw new SQLException("Route ID not found for route number: " + bus.getRoute_id());
        }

        PreparedStatement pst = con.prepareStatement("INSERT INTO bus_request (bus_id, owner_id, reg_no, route_id, no_of_Seats, review_points) VALUES (?, ?, ?, ?, ?, ?)");

        pst.setString(1, generateBusID());
        pst.setString(2, owner_id);
        pst.setString(3, bus.getReg_no());
        pst.setString(4, routeId);
        pst.setInt(5, bus.getNoOfSeats());
        pst.setDouble(6, 0);

        return pst.executeUpdate();
    }

    public static int insert_bus(Bus bus) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into bus(bus_id, owner_id, reg_no, route_id, no_of_Seats, review_points) values (?,?,?,?,?,?)");
        pst.setString(1, bus.getBus_id());
        pst.setString(2, bus.getOwner_id());
        pst.setString(3, bus.getReg_no());
        pst.setString(4, bus.getRoute_id());
        pst.setInt(5, bus.getNoOfSeats());
        pst.setDouble(6, bus.getReview_points());
        return pst.executeUpdate();
    }

    private static String generateBusID() throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(bus_id, 2) AS SIGNED)), 0) + 1 AS next_bus_id FROM bus_request";
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        int nextBusID = 1;
        if (rs.next()) {
            nextBusID = rs.getInt("next_bus_id");
        }

        return "B" + String.format("%03d", nextBusID);
    }

    public static ResultSet get(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT b.*, r.route_no\n" +
        "FROM bus b\n" +
        "JOIN route r ON b.route_id = r.route_id\n" +
        "WHERE b.bus_id = ?;\n");
        pst.setString(1,bus_id);
        return pst.executeQuery();
    }
    public static boolean isBusExists(String regNo) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS count FROM bus WHERE reg_no = ?");
        pst.setString(1, regNo);
        ResultSet rs = pst.executeQuery();
        if (rs.next()) {
            int count = rs.getInt("count");
            return count > 0;
        }
        return false;
    }

    public static ResultSet getRequestData(String bus_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT  * FROM bus_request WHERE bus_id=?");
        pst.setString(1,bus_id);
        return pst.executeQuery();
    }

    public static ResultSet getBusRequest() throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "p.nic,\n" +
                "br.bus_id,\n" +
                "br.owner_id,\n" +
                "    br.reg_no,\n" +
                "    r.route_no,\n" +
                "    CONCAT(r.start, ' - ', r.destination) AS route,\n" +
                "    br.no_of_seats,\n" +
                "    br.status\n" +
                "FROM\n" +
                "bus_request br\n" +
                "JOIN\n" +
                "owner o ON br.owner_id=o.owner_id\n" +
                "JOIN\n" +
                "passenger p ON o.p_id=p.p_id\n" +
                "JOIN \n" +
                "route r ON br.route_id=r.route_id");
        return pst.executeQuery();
    }

    public static ResultSet getBusRequestByPID(String p_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    p.nic,\n" +
                "    br.bus_id,\n" +
                "    br.owner_id,\n" +
                "    br.reg_no,\n" +
                "    r.route_no,\n" +
                "    CONCAT(r.start, ' - ', r.destination) AS route,\n" +
                "    br.no_of_seats,\n" +
                "    br.status\n" +
                "FROM\n" +
                "    bus_request br\n" +
                "JOIN\n" +
                "    owner o ON br.owner_id = o.owner_id\n" +
                "JOIN\n" +
                "    passenger p ON o.p_id = p.p_id\n" +
                "JOIN\n" +
                "    route r ON br.route_id = r.route_id\n" +
                "WHERE\n" +
                "    p.p_id = ?;");
        pst.setString(1, p_id);
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "    b.bus_id,\n" +
                "    b.owner_id,\n" +
                "    p.nic AS owner_nic,\n" +
                "    b.reg_no,\n" +
                "    b.route_id,\n" +
                "    b.no_of_seats,\n" +
                "    b.review_points,\n" +
                "    r.route_no,\n" +
                "\tCONCAT(r.start, '-', r.destination) AS route\n" +
                "FROM \n" +
                "    bus b\n" +
                "JOIN \n" +
                "    owner o ON b.owner_id = o.owner_id\n" +
                "JOIN \n" +
                "    passenger p ON p.p_id = o.p_id\n" +
                "JOIN \n" +
                "    route r ON b.route_id = r.route_id;");
        return pst.executeQuery();
    }

    public static ResultSet counter() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT COUNT(*) AS record_count FROM bus");
        return pst.executeQuery();
    }

    public static ResultSet getByOwner(String p_id) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT b.*, r.route_no, r.start, r.destination\n" +
                "FROM bus b \n" +
                "JOIN owner o ON b.owner_id = o.owner_id \n" +
                "JOIN route r ON b.route_id = r.route_id\n" +
                "WHERE o.p_id = ?;");
        pst.setString(1, p_id);
        return pst.executeQuery();
    }


    public static int update(String bus_id, Bus bus) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE bus SET route_id=(SELECT route_id FROM route WHERE route_no = ?), no_of_Seats=? WHERE bus_id=?");
        pst.setString(1,bus.getRoute_id());
        pst.setInt(2,bus.getNoOfSeats());
        pst.setString(3,bus_id);
        return pst.executeUpdate();
    }

    public static int updateRequestStatus(String bus_id, int status) throws SQLException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE bus_request SET status=? WHERE bus_id=?");
        pst.setInt(1,status);
        pst.setString(2,bus_id);
        return pst.executeUpdate();
    }

    public static int delete(String bus_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM bus WHERE bus_id = ?");
        pst.setString(1,bus_id);
        return pst.executeUpdate();
    }
}
