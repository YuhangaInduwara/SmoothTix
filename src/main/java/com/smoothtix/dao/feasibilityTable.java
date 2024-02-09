package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Feasibility;

import java.sql.*;

public class feasibilityTable {
    public static int insert(Feasibility feasible_schedule) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        try (PreparedStatement statement = con.prepareStatement(
                "INSERT INTO feasible_schedule (bus_id, date, time_range, availability) VALUES (?, ?, ?, ?)")) {
            statement.setString(1, feasible_schedule.getBusId());
            statement.setString(2, feasible_schedule.getDate());
            statement.setString(3, feasible_schedule.getTimeRange());
            statement.setString(4, feasible_schedule.getAvailability());

            int rawCount = statement.executeUpdate();
            return rawCount;
        }
    }
}