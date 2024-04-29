package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.seatAvailabilityTable;
import com.smoothtix.model.Schedule;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

public class SeatAvailabilityController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set the content type of the response to HTML
        response.setContentType("text/html");

        // Initialize a PrintWriter to send the response
        PrintWriter out = response.getWriter();

        // Create a JSONArray to store seat availability data
        JSONArray seatAvailabilityDataArray = new JSONArray();

        // Retrieve the schedule ID parameter from the request
        String schedule_id = request.getParameter("schedule_id");

        try {
            // Declare a ResultSet to store the query result
            ResultSet rs;

            // Check if the schedule_id parameter is not null
            if (schedule_id != null) {
                // Retrieve seat availability data for the specified schedule ID
                rs = seatAvailabilityTable.getByScheduleId(schedule_id);

                // Iterate over the ResultSet and construct JSON objects for each row
                while (rs.next()) {
                    // Create a JSONObject to represent seat availability data
                    JSONObject seatAvailabilityData = new JSONObject();

                    // Add seat number and availability status to the JSONObject
                    seatAvailabilityData.put("seat_no", rs.getString("seat_no"));
                    seatAvailabilityData.put("availability", rs.getString("availability"));

                    // Add the JSONObject to the JSONArray
                    seatAvailabilityDataArray.put(seatAvailabilityData);
                }
            }

            // Print the JSONArray to the PrintWriter
            out.println(seatAvailabilityDataArray);

            // Set the HTTP status code to OK
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            // Print the stack trace of any exceptions that occur
            e.printStackTrace();

            // Set the HTTP status code to INTERNAL_SERVER_ERROR
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}