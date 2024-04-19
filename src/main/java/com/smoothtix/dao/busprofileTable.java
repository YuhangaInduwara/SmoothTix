package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Busprofile;

import java.sql.*;
public class busprofileTable {

    public static int insert(String regNo, String driverNIC, String conductorNIC) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

        try {
            // Step 1: Fetch bus_id using regNo
            String busIdQuery = "SELECT bus_id FROM bus WHERE reg_no = ?";
            String busId;
            try (PreparedStatement busIdPst = con.prepareStatement(busIdQuery)) {
                busIdPst.setString(1, regNo);
                try (ResultSet busIdRs = busIdPst.executeQuery()) {
                    if (!busIdRs.next()) {
                        return 0; // Bus not found
                    }
                    busId = busIdRs.getString("bus_id");
                }
            }

            // Step 2: Fetch conductor_id using conductorNIC
            String conductorIdQuery = "SELECT conductor_id FROM conductor WHERE p_id = (SELECT p_id FROM passenger WHERE nic = ?)";
            String conductorId;
            try (PreparedStatement conductorIdPst = con.prepareStatement(conductorIdQuery)) {
                conductorIdPst.setString(1, conductorNIC);
                try (ResultSet conductorIdRs = conductorIdPst.executeQuery()) {
                    if (!conductorIdRs.next()) {
                        return 0; // Conductor not found
                    }
                    conductorId = conductorIdRs.getString("conductor_id");
                }
            }

            // Step 3: Fetch driver_id using driverNIC
            String driverIdQuery = "SELECT driver_id FROM driver WHERE p_id = (SELECT p_id FROM passenger WHERE nic = ?)";
            String driverId;
            try (PreparedStatement driverIdPst = con.prepareStatement(driverIdQuery)) {
                driverIdPst.setString(1, driverNIC);
                try (ResultSet driverIdRs = driverIdPst.executeQuery()) {
                    if (!driverIdRs.next()) {
                        return 0; // Driver not found
                    }
                    driverId = driverIdRs.getString("driver_id");
                }
            }

            // Step 4: Insert into bus_profile
            String insertQuery = "INSERT INTO bus_profile (bus_profile_id, bus_id, driver_id, conductor_id) VALUES (?, ?, ?, ?)";
            try (PreparedStatement insertPst = con.prepareStatement(insertQuery)) {
                insertPst.setString(1, generate_bus_profile_id());
                insertPst.setString(2, busId);
                insertPst.setString(3, driverId);
                insertPst.setString(4, conductorId);

                int rowsAffected = insertPst.executeUpdate();
                if (rowsAffected == 1) {
                    return 1; // Successful insertion
                } else {
                    return -1; // Insertion failed
                }
            }
        } catch (SQLException e) {
            throw e; // Rethrow or handle exception
        }
    }
    private static String generate_bus_profile_id() throws SQLException {
        Connection con;
        Statement stmt;
        ResultSet rs;

        con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(bus_profile_id, 3) AS SIGNED)), 0) + 1 AS next_bus_profile_id FROM bus_profile";
        stmt = con.createStatement();
        rs = stmt.executeQuery(query);

        int next_busprofileID = 1;
        if (rs.next()) {
            next_busprofileID = rs.getInt("next_bus_profile_id");
        }

        return "BP" + String.format("%04d", next_busprofileID);
    }

    public static ResultSet get(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile WHERE bus_profile_id=?");
        pst.setString(1,bus_profile_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }
    public static ResultSet getAllDetails(String p_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    bp.bus_profile_id,\n" +
                "    b.reg_no AS bus_registration_no,\n" +
                "    r.start AS route_start,\n" +
                "    r.destination AS route_destination,\n" +
                "    p_conductor.first_name AS conductor_first_name,\n" +
                "    p_conductor.last_name AS conductor_last_name,\n" +
                "    p_conductor.nic AS conductor_nic,\n" +
                "    p_driver.first_name AS driver_first_name,\n" +
                "    p_driver.last_name AS driver_last_name,\n" +
                "    p_driver.nic AS driver_nic,\n" +
                "    bp.conductor_id,\n" +
                "    bp.driver_id,\n" +
                "    bp.bus_id\n" +
                "FROM\n" +
                "    bus_profile bp\n" +
                "JOIN\n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN\n" +
                "    route r ON b.route_id = r.route_id\n" +
                "LEFT JOIN\n" +
                "    conductor c ON bp.conductor_id = c.conductor_id\n" +
                "LEFT JOIN\n" +
                "    driver d ON bp.driver_id = d.driver_id\n" +
                "LEFT JOIN\n" +
                "    passenger p_conductor ON c.p_id = p_conductor.p_id\n" +
                "LEFT JOIN\n" +
                "    passenger p_driver ON d.p_id = p_driver.p_id\n" +
                "JOIN\n" +
                "    bus bu ON bp.bus_id = bu.bus_id\n" +
                "JOIN\n" +
                "    owner o ON bu.owner_id = o.owner_id\n" +
                "WHERE\n" +
                "    o.p_id = ?;");
        pst.setString(1, p_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM bus_profile");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getByBPId(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "    bp.bus_profile_id,\n" +
                "    b.reg_no,\n" +
                "    b.no_of_seats,\n" +
                "    p_driver.nic AS driver_nic,\n" +
                "    p_conductor.nic AS conductor_nic\n" +
                "FROM \n" +
                "    bus_profile bp\n" +
                "JOIN \n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN \n" +
                "    driver d ON bp.driver_id = d.driver_id\n" +
                "JOIN \n" +
                "    passenger p_driver ON d.p_id = p_driver.p_id\n" +
                "JOIN \n" +
                "    conductor c ON bp.conductor_id = c.conductor_id\n" +
                "JOIN \n" +
                "    passenger p_conductor ON c.p_id = p_conductor.p_id\n" +
                "WHERE \n" +
                "    bp.bus_profile_id = ?;");
        pst.setString(1,bus_profile_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getRowDetails(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("");
        pst.setString(1, bus_profile_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet get_start_dest(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    route.start AS start,\n" +
                "    route.destination AS destination\n" +
                "FROM\n" +
                "    bus_profile\n" +
                "JOIN\n" +
                "    bus ON bus_profile.bus_id = bus.bus_id\n" +
                "JOIN\n" +
                "    route ON bus.route_id = route.route_id\n" +
                "WHERE\n" +
                "    bus_profile.bus_profile_id = ?;");
        pst.setString(1,bus_profile_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String bus_profile_id, String reg_no, String driver_nic, String conductor_nic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

            // Update bus_profile with new values
            String updateQuery = "UPDATE bus_profile SET bus_id=?, driver_id=?, conductor_id=? WHERE bus_profile_id=?";

        try (PreparedStatement updatePst = con.prepareStatement(updateQuery)) {
                updatePst.setString(1, reg_no);
                updatePst.setString(2, driver_nic);
                updatePst.setString(3, conductor_nic);
                updatePst.setString(4, bus_profile_id);

                int rowsAffected = updatePst.executeUpdate();
                if (rowsAffected == 1) {
                    return 1; // Successful update
                } else {
                    return -1; // Update failed
                }
        } catch (SQLException e) {
            throw e; // Rethrow or handle exception
        }
    }
    public static String retrieveBusId(String regNo) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String busId = null;

        try (
             PreparedStatement pst = con.prepareStatement("SELECT bus_id FROM bus WHERE reg_no = ?");
        ) {
            pst.setString(1, regNo);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    busId = rs.getString("bus_id");
                }
            }
        }

        return busId;
    }


    public static String retrieveDriverId(String driverNic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String driverId = null;

        try (
            PreparedStatement pst = con.prepareStatement("SELECT driver_id FROM driver WHERE p_id = (SELECT p_id FROM passenger WHERE nic = ?)");
            ) {
                pst.setString(1, driverNic);
                try (ResultSet rs = pst.executeQuery()) {
                    if (rs.next()) {
                        driverId = rs.getString("driver_id");
                    }
                }
            }

            return driverId;
        }

    public static String retrieveConductorId(String conductorNic) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String conductorId = null;

        try (
            PreparedStatement pst = con.prepareStatement("SELECT conductor_id FROM conductor WHERE p_id = (SELECT p_id FROM passenger WHERE nic = ?)");
        ) {
            pst.setString(1, conductorNic);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    conductorId = rs.getString("conductor_id");
                }
            }
        }

        return conductorId;
    }
    public static int delete(String bus_profile_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM bus_profile WHERE bus_profile_id = ?");
        pst.setString(1,bus_profile_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }
}
