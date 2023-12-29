package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Schedule;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class scheduleTable {
    public static int insert(Schedule schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into schedule(schedule_id, date, route_id, start, destination, start_time, end_time) values (?,?,?,?,?,?,?)");
        pst.setString(1,schedule.getSchedule_id());
        pst.setString(2,schedule.getDate());
        pst.setString(3,schedule.getRoute_id());
        pst.setString(4,schedule.getStart());
        pst.setString(5,schedule.getDestination());
        pst.setString(6,schedule.getStart_time());
        pst.setString(7,schedule.getEnd_time());

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static ResultSet getByScheduleId(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM schedule WHERE schedule_id=?");
        pst.setString(1,schedule_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getByDriverId(String driver_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT s.*, r.route_no, r.start, r.destination\n" +
                "FROM schedule s\n" +
                "JOIN bus_profile b ON s.bus_profile_id = b.bus_profile_id\n" +
                "JOIN bus bs ON b.bus_id = bs.bus_id\n" +
                "JOIN route r ON bs.route_id = r.route_id\n" +
                "WHERE b.driver_id = ?;");
        pst.setString(1,driver_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT\n" +
                "    s.schedule_id,\n" +
                "    r_start.start AS start,\n" +
                "    r_end.destination AS destination,\n" +
                "    s.date_time,\n" +
                "    r_start.price_per_ride,\n" +
                "    COUNT(sa.seat_no) AS available_seats,\n" +
                "    b.reg_no\n" +
                "FROM\n" +
                "    schedule s\n" +
                "JOIN\n" +
                "    bus_profile bp ON s.bus_profile_id = bp.bus_profile_id\n" +
                "JOIN\n" +
                "    bus b ON bp.bus_id = b.bus_id\n" +
                "JOIN\n" +
                "    route r_start ON b.route_id = r_start.route_id\n" +
                "JOIN\n" +
                "    seat_availability sa ON s.schedule_id = sa.schedule_id \n" +
                "JOIN\n" +
                "    route r_end ON b.route_id = r_end.route_id\n" +
                "WHERE\n" +
                "    sa.availability = true\n" +
                "GROUP BY\n" +
                "    s.schedule_id, r_start.start, r_end.destination, s.date_time, r_start.price_per_ride, b.reg_no;");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String schedule_id, Schedule schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

        PreparedStatement pst = con.prepareStatement("UPDATE schedule SET schedule_id=?, date=?, route_id=?, start=?, destination=?, start_time=?, end_time=? WHERE schedule_id=?");
        pst.setString(1,schedule.getSchedule_id());
        pst.setString(2,schedule.getDate());
        pst.setString(3,schedule.getRoute_id());
        pst.setString(4,schedule.getStart());
        pst.setString(5,schedule.getDestination());
        pst.setString(6,schedule.getStart_time());
        pst.setString(7,schedule.getEnd_time());
        pst.setString(8,schedule_id);

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int delete(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM schedule WHERE schedule_id = ?");
        pst.setString(1,schedule_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }
}
