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
        PreparedStatement pst = con.prepareStatement("insert into shedule(schedule_id, date, route_id, start, destination, start_time, end_time) values (?,?,?,?,?,?,?)");
        pst.setString(1,schedule.getSchedule_id());
        pst.setString(2,schedule.getDate());
        pst.setString(3,schedule.getRoute_id());
        pst.setString(4,schedule.getStart());
        pst.setString(5,schedule.getDestination());
        pst.setString(6,schedule.getStart_time());
        pst.setString(7,schedule.getEnd_time());

        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static ResultSet get(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM schedule WHERE schedule_id=?");
        pst.setString(1,schedule_id);
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM schedule");
        ResultSet rs = pst.executeQuery();
//        con.close();
        return rs;
    }

    public static int update(String schedule_id, Schedule schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();

        PreparedStatement pst = con.prepareStatement("UPDATE bus SET schedule_id=?, date=?, route_id=?, start=?, destination=?, start_time=?, end_time=? WHERE schedule_id=?");
        pst.setString(1,schedule.getSchedule_id());
        pst.setString(2,schedule.getDate());
        pst.setString(3,schedule.getRoute_id());
        pst.setString(4,schedule.getStart());
        pst.setString(5,schedule.getDestination());
        pst.setString(6,schedule.getStart_time());
        pst.setString(7,schedule.getEnd_time());
        pst.setString(9,schedule_id);

        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }

    public static int delete(String schedule_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM schedule WHERE schedule_id = ?");
        pst.setString(1,schedule_id);
        int rawCount = pst.executeUpdate();
        con.close();
        return rawCount;
    }
}
