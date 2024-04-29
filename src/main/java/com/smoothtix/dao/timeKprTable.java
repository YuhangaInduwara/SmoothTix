package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.TimeKeeper;

import java.sql.*;

public class timeKprTable {
    //attempts to insert data into a database table
    public static int insert(String nic, String stand) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM passenger WHERE nic=?");
        pst.setString(1, nic);
        ResultSet rs = pst.executeQuery();

        if (rs.next()) {
            if(rs.getBoolean("flag")){
                return 2;
            }

            else{
                if(rs.getInt("privilege_level") == 2){
                    return 3;
                }
                else if(rs.getInt("privilege_level") == 1 || rs.getInt("privilege_level") == 4 || rs.getInt("privilege_level") == 5){
                    return 4;
                }
                //executed if the value of the privilege_level column in the result set rs is equal to 6.
                else if(rs.getInt("privilege_level") == 6){
                    PreparedStatement ps = con.prepareStatement("insert into timekeeper(timekpr_id, p_id,stand) values (?,?,?)");
                    ps.setString(1, generate_timekpr_id());
                    ps.setString(2, rs.getString("p_id"));
                    ps.setString(3, stand);
                    System.out.println("nic: " + rs.getString("nic"));
                    System.out.println("p_id: " + rs.getString("p_id"));
                    System.out.println("stand: " + stand);

                    //creates a new Passenger object and then updates its privilege level in the database using a method from a passengerTable object
                    Passenger passenger = new Passenger (rs.getString("nic"), 2);
                    int success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);

                    //Checking Success of Privilege Level Update
                    if(success == 1){
                        int success1 = ps.executeUpdate();  //Executing Insertion Query
                        if(success1 == 1){
                            return 1;
                        }
                        //Handling Insertion Failure
                        else{
                            Passenger passenger2 = new Passenger (rs.getString("nic"), 6); //creates a new Passenger object named passenger2
                            int success2 = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger2);
                            return -1;
                        }
                    }
                    else{
                        return -1;
                    }
                }
                else{
                    return 0;
                }
            }
        }
        else{
            return 0;
        }
    }

    private static String generate_timekpr_id() throws SQLException {
        Connection con;        // Declare a Connection object for database connection.
        Statement stmt;        // Declare a Statement object for executing SQL queries.
        ResultSet rs;          // Declare a ResultSet object for storing query results.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Define the SQL query to find the next available timekeeper ID.
        String query = "SELECT COALESCE(MAX(CAST(SUBSTRING(timekpr_id, 3) AS SIGNED)), 0) + 1 AS next_timekpr_id FROM timekeeper";

        // Create a Statement object for executing SQL statements.
        stmt = con.createStatement();

        // Execute the SQL query to retrieve the next available timekeeper ID.
        rs = stmt.executeQuery(query);

        // Initialize nextTimekprID to 1 as default value.
        int nextTimekprID = 1;

        // If the query returns a result, retrieve the next timekeeper ID.
        if (rs.next()) {
            nextTimekprID = rs.getInt("next_timekpr_id");
        }

        // Generate the next timekeeper ID by formatting it with leading zeros and "TK" prefix.
        return "TK" + String.format("%04d", nextTimekprID);
    }


    public static ResultSet get(String timekpr_id) throws SQLException, ClassNotFoundException {
        Connection con;        // Declare a Connection object for database connection.
        PreparedStatement pst;    // Declare a PreparedStatement object for executing parameterized SQL queries.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Define the SQL query to retrieve timekeeper information based on the timekeeper ID.
        String query = "SELECT * FROM timekeeper WHERE timekpr_id=?";

        // Create a PreparedStatement object with the defined SQL query.
        pst = con.prepareStatement(query);

        // Set the value of the parameter in the PreparedStatement to the provided timekeeper ID.
        pst.setString(1, timekpr_id);

        // Execute the SQL query and return the ResultSet containing the timekeeper information.
        return pst.executeQuery();
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con;            // Declare a Connection object for database connection.
        PreparedStatement pst;    // Declare a PreparedStatement object for executing SQL queries.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Define the SQL query to retrieve all timekeeper information.
        String query = "SELECT * FROM timekeeper";

        // Create a PreparedStatement object with the defined SQL query.
        pst = con.prepareStatement(query);

        // Execute the SQL query and return the ResultSet containing all timekeeper information.
        return pst.executeQuery();
    }

    public static ResultSet counter() throws SQLException, ClassNotFoundException {
        Connection con;            // Declare a Connection object for database connection.
        PreparedStatement pst;    // Declare a PreparedStatement object for executing SQL queries.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Define the SQL query to count the number of records in the timekeeper table.
        String query = "SELECT COUNT(*) AS record_count FROM timekeeper";

        // Create a PreparedStatement object with the defined SQL query.
        pst = con.prepareStatement(query);

        // Execute the SQL query and return the ResultSet containing the count of records.
        return pst.executeQuery();
    }

    public static ResultSet get_by_p_id(String p_id) throws SQLException, ClassNotFoundException {
        Connection con;            // Declare a Connection object for database connection.
        PreparedStatement pst;    // Declare a PreparedStatement object for executing parameterized SQL queries.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Define the SQL query to retrieve timekeeper information based on the passenger ID.
        String query = "SELECT * FROM timekeeper WHERE p_id=?";

        // Create a PreparedStatement object with the defined SQL query.
        pst = con.prepareStatement(query);

        // Set the value of the parameter in the PreparedStatement to the provided passenger ID.
        pst.setString(1, p_id);

        // Execute the SQL query and return the ResultSet containing the timekeeper information for the specified passenger.
        return pst.executeQuery();
    }

    public static int update(TimeKeeper timeKeeper) throws SQLException, ClassNotFoundException {
        Connection con;            // Declare a Connection object for database connection.
        PreparedStatement pst;    // Declare a PreparedStatement object for executing parameterized SQL queries.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Define the SQL query to update the stand information for a timekeeper.
        String query = "UPDATE Timekeeper SET stand=? WHERE timekpr_id=?";

        // Create a PreparedStatement object with the defined SQL query.
        pst = con.prepareStatement(query);

        // Set the values of the parameters in the PreparedStatement to the stand and timekpr_id of the TimeKeeper object.
        pst.setString(1, timeKeeper.get_stand());
        pst.setString(2, timeKeeper.get_timekpr_id());

        // Execute the SQL update query and return the number of rows affected by the update operation.
        return pst.executeUpdate();
    }

    public static int delete(String timekpr_id) throws SQLException, ClassNotFoundException {
        Connection con;            // Declare a Connection object for database connection.
        int success = -1;         // Initialize a variable to track the success of the privilege level update.
        PreparedStatement pst1;    // Declare a PreparedStatement object for executing parameterized SQL queries.
        PreparedStatement pst2;    // Declare a PreparedStatement object for executing parameterized SQL queries.

        // Initialize the database connection.
        con = dbConnection.initializeDatabase();

        // Prepare and execute a query to select the passenger ID associated with the provided timekeeper ID.
        pst1 = con.prepareStatement("SELECT p_id FROM timekeeper WHERE timekpr_id = ?");
        pst1.setString(1, timekpr_id);
        ResultSet rs = pst1.executeQuery();

        // If a record is found, update the passenger's privilege level to 6.
        if (rs.next()) {
            Passenger passenger = new Passenger(rs.getString("p_id"), 6);
            success = passengerTable.updatePrivilegeLevel(rs.getString("p_id"), passenger);
        }

        // Prepare and execute a query to delete the timekeeper record if the privilege level update is successful.
        pst2 = con.prepareStatement("DELETE FROM timekeeper WHERE timekpr_id = ?");
        pst2.setString(1, timekpr_id);

        // If the privilege level update is successful, delete the timekeeper record and return the number of rows affected.
        if (success >= 1) {
            return pst2.executeUpdate();
        } else {
            return 0;  // Return 0 if the privilege level update failed.
        }
    }
}
