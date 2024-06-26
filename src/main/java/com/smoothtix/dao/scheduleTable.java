package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Schedule;

import java.sql.*;

public class scheduleTable {
    //Inserts a new schedule into the database
    public static int insert(Schedule schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String schedule_id = generateScheduleID();
        PreparedStatement pst = con.prepareStatement("insert into schedule(schedule_id, bus_profile_id, date_time, status) values (?,?,?,?)");
        pst.setString(1,schedule_id);
        pst.setString(2,schedule.getBus_profile_id());
        pst.setString(3,schedule.getDate_time());
        pst.setInt(4,schedule.getStatus());
        int rawCount = pst.executeUpdate();
        int rawCount2 = 0;
        if(rawCount > 0){
            ResultSet rs1 = busprofileTable.getByBPId(schedule.getBus_profile_id());
            if(rs1.next()){
                int no_of_seats = rs1.getInt("no_of_seats");
                if(no_of_seats > 0){
                    rawCount2 = seatAvailabilityTable.insert(schedule_id, no_of_seats);
                }
            }
        }
        return rawCount2;
    }

//Generates a new schedule ID for inserting a new schedule into the database
    private static String generateScheduleID() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(schedule_id, 3) AS SIGNED)), 0) + 1 AS next_schedule_id FROM schedule";
        Statement stmt = con.createStatement();
        ResultSet rs = ((Statement) stmt).executeQuery(query);

        int nextScheduleID = 1;
        if (rs.next()) {
            nextScheduleID = rs.getInt("next_schedule_id");
        }

        return "SH" + String.format("%04d", nextScheduleID);
    }
//Retrieves schedule information based on the provided schedule ID
    public static ResultSet getByScheduleId(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "s.schedule_id, \n" +
                "    s.date_time, \n" +
                "    s.bus_profile_id, \n" +
                "    s.status,\n" +
                "    r.price_per_ride, \n" +
                "    r.start, \n" +
                "    r.destination \n" +
                "FROM\n" +
                "schedule s\n" +
                "JOIN\n" +
                "bus_profile bp ON s.bus_profile_id=bp.bus_profile_id\n" +
                "JOIN\n" +
                "bus b ON bp.bus_id=b.bus_id\n" +
                "JOIN\n" +
                "route r ON b.route_id=r.route_id\n" +
                "WHERE\n" +
                "schedule_id=?;");
        pst.setString(1,schedule_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

      //retrieves schedule information for a specific driver based on the provided driver ID
    public static ResultSet getByDriverId(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "    s.schedule_id,\n" +
                "    b.reg_no,\n" +
                "    CONCAT(c.first_name, ' ', c.last_name) AS conductor_name,\n" +
                "    r.route_no,\n" +
                "    CONCAT(r.start, ' - ', r.destination) AS route,\n" +
                "    s.date_time,\n" +
                "    s.status\n" +
                "FROM \n" +
                "    driver d\n" +
                "JOIN \n" +
                "    bus_profile bp ON d.driver_id = bp.driver_id\n" +
                "JOIN \n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN \n" +
                "    conductor co ON bp.conductor_id = co.conductor_id\n" +
                "JOIN \n" +
                "    passenger c ON co.p_id = c.p_id\n" +
                "JOIN \n" +
                "    schedule s ON bp.bus_profile_id = s.bus_profile_id  \n" +
                "JOIN \n" +
                "    route r ON b.route_id = r.route_id\n" +
                "WHERE \n" +
                "    d.driver_id = ?\n" +
                "    AND s.date_time > DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)\n" +
                "    AND (s.status = 0 OR s.status = 1)\n" +
                "ORDER BY \n" +
                "    s.date_time ASC\n" +
                "LIMIT 1");
        pst.setString(1,driver_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }
     //retrieves schedule information for a specific conductor based on the provided conductor ID
    public static ResultSet getByConductorId(String conductor_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "    s.schedule_id,\n" +
                "    b.reg_no,\n" +
                "    CONCAT(c.first_name, ' ', c.last_name) AS driver_name,\n" +
                "    r.route_no,\n" +
                "    CONCAT(r.start, ' - ', r.destination) AS route,\n" +
                "    s.date_time,\n" +
                "    s.status\n" +
                "FROM \n" +
                "    conductor co\n" +
                "JOIN \n" +
                "    bus_profile bp ON co.conductor_id = bp.conductor_id\n" +
                "JOIN \n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN \n" +
                "    driver d ON bp.driver_id = d.driver_id\n" +
                "JOIN \n" +
                "    passenger c ON d.p_id = c.p_id\n" +
                "JOIN \n" +
                "    schedule s ON bp.bus_profile_id = s.bus_profile_id  \n" +
                "JOIN \n" +
                "    route r ON b.route_id = r.route_id\n" +
                "WHERE \n" +
                "    co.conductor_id = ?\n" +
                "    AND s.date_time > DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)\n" +
                "    AND (s.status = 0 OR s.status = 1)\n" +
                "ORDER BY \n" +
                "    s.date_time ASC\n" +
                "LIMIT 1");
        pst.setString(1,conductor_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

   //retrieves all schedule information from the database. It selects details such as schedule ID
    public static ResultSet getByRouteByScheduleId(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT r.start, r.destination, b.reg_no\n" +
                "FROM schedule s\n" +
                "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN route r ON b.route_id = r.route_id\n" +
                "WHERE s.schedule_id = ?;");
        pst.setString(1,schedule_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    //retrieves all schedule information from the database
    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT \n" +
                "    s.schedule_id, \n" +
                "    r_start.start AS start, \n" +
                "    r_end.destination AS destination,\n" +
                "    s.date_time, \n" +
                "    s.status, \n" +
                "    r_start.price_per_ride, \n" +
                "    COUNT(sa.seat_no) AS available_seats, \n" +
                "    b.reg_no, \n" +
                "    r_start.route_no \n" +
                "FROM \n" +
                "    schedule s \n" +
                "JOIN \n" +
                "    bus_profile bp ON s.bus_profile_id = bp.bus_profile_id \n" +
                "JOIN \n" +
                "    bus b ON bp.bus_id = b.bus_id \n" +
                "JOIN \n" +
                "    route r_start ON b.route_id = r_start.route_id \n" +
                "JOIN \n" +
                "    seat_availability sa ON s.schedule_id = sa.schedule_id \n" +
                "JOIN \n" +
                "    route r_end ON b.route_id = r_end.route_id \n" +
                "WHERE \n" +
                "    sa.availability = true \n" +
                "GROUP BY \n" +
                "    s.schedule_id, r_start.start, r_end.destination, s.date_time, r_start.price_per_ride, b.reg_no, r_start.route_no;");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

      //retrieves schedules with booked seats for the next day
    public static ResultSet getRemainderSchedules() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    passenger.first_name,\n" +
                "    passenger.last_name,\n" +
                "    passenger.email,\n" +
                "    bus.reg_no AS bus_reg_no,\n" +
                "    booked_seats.seat_no,\n" +
                "    schedule.date_time\n" +
                "FROM\n" +
                "    passenger\n" +
                "JOIN\n" +
                "    booking ON passenger.p_id = booking.p_id\n" +
                "JOIN\n" +
                "    booked_seats ON booking.booking_id = booked_seats.booking_id\n" +
                "JOIN\n" +
                "    schedule ON booking.schedule_id = schedule.schedule_id\n" +
                "JOIN\n" +
                "    bus_profile ON schedule.bus_profile_id = bus_profile.bus_profile_id\n" +
                "JOIN\n" +
                "    bus ON bus_profile.bus_id = bus.bus_id\n" +
                "WHERE\n" +
                "    schedule.date_time > NOW() AND\n" +
                "    DATE(schedule.date_time) = CURDATE() + INTERVAL 1 DAY;");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

     //updates the schedule information in the database for a given schedule ID
    public static int update(String schedule_id, Schedule schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

        PreparedStatement pst = con.prepareStatement("UPDATE schedule SET bus_profile_id=?, date_time=?, status=? WHERE schedule_id=?");
        pst.setString(1,schedule.getBus_profile_id());
        pst.setString(2,schedule.getDate_time());
        pst.setInt(3,schedule.getStatus());
        pst.setString(4,schedule_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    //updates the status of a schedule in the database.
    //takes the schedule ID and the new status as parameters.
    public static int updateStatus(String schedule_id, String status) throws SQLException {
        Connection con = dbConnection.initializeDatabase();

        PreparedStatement pst = con.prepareStatement("UPDATE schedule SET status=? WHERE schedule_id=?");
        pst.setInt(1, Integer.parseInt(status));
        pst.setString(2,schedule_id);

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    //deletes a schedule from the database based on the provided schedule ID.
    public static int delete(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM schedule WHERE schedule_id = ?");
        pst.setString(1,schedule_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

//retrieves schedules for a specific route within the past week.
    public static ResultSet getWeekSchedules(String route_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT s.schedule_id, s.bus_profile_id, s.date_time\n" +
                "FROM schedule s\n" +
                "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN bus b ON bp.bus_id = b.bus_id\n" +
                "WHERE b.route_id = ?\n" +
                "AND s.date_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK)\n" +
                "AND s.date_time < NOW();");
        pst.setString(1,route_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    //retrieves schedules for a specific route within the past month.
    public static ResultSet getMonthSchedules(String route_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT s.schedule_id, s.bus_profile_id, s.date_time\n" +
                "FROM schedule s\n" +
                "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN bus b ON bp.bus_id = b.bus_id\n" +
                "WHERE b.route_id = ?\n" +
                "AND s.date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)\n" +
                "AND s.date_time < NOW();");
        pst.setString(1,route_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    //retrieves schedules for a specific route within the past year.
    public static ResultSet getYearSchedules(String route_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT s.schedule_id, s.bus_profile_id, s.date_time\n" +
                "FROM schedule s\n" +
                "JOIN bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN bus b ON bp.bus_id = b.bus_id\n" +
                "WHERE b.route_id = ?\n" +
                "AND s.date_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)\n" +
                "AND s.date_time < NOW();");
        pst.setString(1,route_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

}
