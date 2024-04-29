package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.locationTable;
import com.smoothtix.model.Location;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class LocationController extends HttpServlet {
    // Handle HTTP GET requests
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray locationDataArray = new JSONArray();
        String schedule_id = request.getParameter("schedule_id");

        try {
            // Retrieve location data from the database based on the schedule_id
            ResultSet rs = locationTable.getByScheduleId(schedule_id);
            while (rs.next()) {
                JSONObject scheduleData = new JSONObject();
                // Populate JSON object with location data
                scheduleData.put("schedule_id", rs.getString("schedule_id"));
                scheduleData.put("latitude", rs.getString("latitude"));
                scheduleData.put("longitude", rs.getString("longitude"));
                // Add JSON object to the array
                locationDataArray.put(scheduleData);
            }

            // Output JSON array as a string
            out.println(locationDataArray.toString());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    // Handle HTTP POST requests
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            // Deserialize JSON request body into Location object
            Location location = gson.fromJson(reader, Location.class);
            // Insert location data into the database
            int registrationSuccess = locationTable.insert(location);

            if (registrationSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    // Handle HTTP PUT requests
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String schedule_id = request.getHeader("schedule_id");

            BufferedReader reader = request.getReader();
            // Deserialize JSON request body into Location object
            Location location = gson.fromJson(reader, Location.class);

            // Update location data in the database based on schedule_id
            int updateSuccess = locationTable.update(schedule_id, location);

            if (updateSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}
