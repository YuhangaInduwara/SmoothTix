package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.scheduleTable;
import com.smoothtix.dao.routeTable;
import com.smoothtix.model.Schedule;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

public class ScheduleController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

        // Initialize a PrintWriter to send the response
        PrintWriter out = response.getWriter();

        // Create a JSONArray to store schedule data
        JSONArray scheduleDataArray = new JSONArray();

        // Retrieve parameters from the request
        String schedule_id = request.getHeader("schedule_id");
        String driver_id = request.getHeader("driver_id");
        String conductor_id = request.getHeader("conductor_id");

        String start = request.getParameter("start");
        String destination = request.getParameter("destination");
        String date = request.getParameter("date");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");

        try {
            ResultSet rs;

            // If no specific IDs are provided, retrieve all schedule data
            if (schedule_id == null && driver_id == null && conductor_id == null) {
                rs = scheduleTable.getAll();

                // Iterate through the ResultSet and populate the JSON array with schedule data
                while (rs.next()) {
                    JSONObject scheduleData = new JSONObject();
                    scheduleData.put("schedule_id", rs.getString("schedule_id"));
                    scheduleData.put("reg_no", rs.getString("reg_no"));
                    scheduleData.put("start", rs.getString("start"));
                    scheduleData.put("route_no", rs.getString("route_no"));
                    scheduleData.put("destination", rs.getString("destination"));
                    scheduleData.put("date", rs.getDate("date_time"));
                    scheduleData.put("time", rs.getTime("date_time"));

                    // Adjust time by subtracting 1 hour (3600000 milliseconds) for display
                    java.util.Date originalTime = rs.getTime("date_time");
                    java.util.Date adjustedTime = new java.util.Date(originalTime.getTime() - 3600000);
                    SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
                    String formattedTime = timeFormat.format(adjustedTime);
                    scheduleData.put("adjusted_time", formattedTime);

                    scheduleData.put("price_per_ride", rs.getDouble("price_per_ride"));
                    scheduleData.put("available_seats", rs.getInt("available_seats"));
                    scheduleData.put("status", rs.getInt("status"));
                    scheduleDataArray.put(scheduleData);
                }

                // Apply filtering if any search parameters are provided
                if (start != null || destination != null || date != null || startTime != null || endTime != null) {
                    scheduleDataArray = filterScheduleData(scheduleDataArray, start, destination, date, startTime, endTime);
                }
            }
            // If only the schedule ID is provided, retrieve schedule data by ID
            else if (driver_id == null && conductor_id == null) {
                rs = scheduleTable.getByScheduleId(schedule_id);
                while (rs.next()) {
                    JSONObject scheduleData = new JSONObject();
                    scheduleData.put("schedule_id", rs.getString("schedule_id"));
                    scheduleData.put("date", rs.getDate("date_time"));
                    scheduleData.put("time", rs.getTime("date_time"));
                    scheduleData.put("bus_profile_id", rs.getString("bus_profile_id"));
                    scheduleData.put("start", rs.getString("start"));
                    scheduleData.put("destination", rs.getString("destination"));
                    scheduleData.put("status", rs.getInt("status"));
                    scheduleData.put("price_per_ride", rs.getDouble("price_per_ride"));
                    scheduleDataArray.put(scheduleData);
                }
            }
            // If only the driver ID is provided, retrieve schedule data by driver ID
            else if (schedule_id == null && conductor_id == null) {
                rs = scheduleTable.getByDriverId(driver_id);
                while (rs.next()) {
                    JSONObject scheduleData = new JSONObject();
                    scheduleData.put("schedule_id", rs.getString("schedule_id"));
                    scheduleData.put("reg_no", rs.getString("reg_no"));
                    scheduleData.put("conductor_name", rs.getString("conductor_name"));
                    scheduleData.put("route_no", rs.getString("route_no"));
                    scheduleData.put("route", rs.getString("route"));
                    scheduleData.put("date", rs.getDate("date_time"));
                    scheduleData.put("time", rs.getTime("date_time"));
                    scheduleData.put("status", rs.getString("status"));
                    scheduleDataArray.put(scheduleData);
                }
            }
            // If only the conductor ID is provided, retrieve schedule data by conductor ID
            else if (schedule_id == null && driver_id == null) {
                rs = scheduleTable.getByConductorId(conductor_id);
                while (rs.next()) {
                    JSONObject scheduleData = new JSONObject();
                    scheduleData.put("schedule_id", rs.getString("schedule_id"));
                    scheduleData.put("reg_no", rs.getString("reg_no"));
                    scheduleData.put("driver_name", rs.getString("driver_name"));
                    scheduleData.put("route_no", rs.getString("route_no"));
                    scheduleData.put("route", rs.getString("route"));
                    scheduleData.put("date", rs.getDate("date_time"));
                    scheduleData.put("time", rs.getTime("date_time"));
                    scheduleData.put("status", rs.getString("status"));
                    scheduleDataArray.put(scheduleData);
                }
            }
            // Send the JSON array containing schedule data in the response
            out.println(scheduleDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

        try {
            Gson gson = new Gson();

            // Read the request body and parse it into a Schedule object using Gson
            BufferedReader reader = request.getReader();
            Schedule schedule = gson.fromJson(reader, Schedule.class);

            // Insert the parsed Schedule object into the database
            int registrationSuccess = scheduleTable.insert(schedule);

            // Set the response status based on the success of the insertion
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

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html");
        String schedule_id = request.getParameter("schedule_id");
        String status = request.getParameter("status");
        int updateSuccess = 0;

        try {
            // Check if the status parameter is null
            if(status == null){
                Gson gson = new Gson();

                // Read the request body and parse it into a Schedule object using Gson
                BufferedReader reader = request.getReader();
                Schedule schedule = gson.fromJson(reader, Schedule.class);

                // Update the schedule information based on the provided schedule_id
                updateSuccess = scheduleTable.update(schedule_id, schedule);
            }
            else{
                // If status is provided, update only the status of the schedule
                System.out.println(schedule_id + " " + status);
                updateSuccess = scheduleTable.updateStatus(schedule_id, status);
            }

            // Set the response status based on the success of the update operation
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


    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html");

        try {
            // Extract the schedule_id from the request parameters
            String schedule_id = request.getParameter("schedule_id");

            // Attempt to delete the schedule with the provided schedule_id
            int deleteSuccess = scheduleTable.delete(schedule_id);

            // Set the response status based on the success of the delete operation
            if (deleteSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private JSONArray filterScheduleData(JSONArray originalArray, String start, String destination, String date, String startTime, String endTime) throws JSONException, ParseException {
        JSONArray filteredArray = new JSONArray();
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

        for (int i = 0; i < originalArray.length(); i++) {
            JSONObject scheduleData = originalArray.getJSONObject(i);

            if (!startTime.isEmpty() && !endTime.isEmpty()) {
                // Parse the start and end time strings to Date objects
                Date parsedStartTime = timeFormat.parse(startTime);
                Date parsedEndTime = timeFormat.parse(endTime);

                // Extract the schedule time string and parse it to a Date object
                String scheduleTimeStr = scheduleData.getString("time");
                Date scheduleTime = timeFormat.parse(scheduleTimeStr);

                // Check if the schedule time is within the specified range
                if (scheduleTime.after(parsedStartTime) && scheduleTime.before(parsedEndTime)) {
                    // Check if the schedule matches the filtering criteria
                    if ((Objects.equals(start, "") || start.equals(scheduleData.getString("start")))
                            && (Objects.equals(destination, "") || destination.equals(scheduleData.getString("destination")))
                            && (Objects.equals(date, "") || date.equals(scheduleData.getString("date")))) {
                        filteredArray.put(scheduleData);
                    }
                }
            } else {
                // If no time range is specified, only check other filtering criteria
                if ((Objects.equals(start, "") || start.equals(scheduleData.getString("start")))
                        && (Objects.equals(destination, "") || destination.equals(scheduleData.getString("destination")))
                        && (Objects.equals(date, "") || date.equals(scheduleData.getString("date")))) {
                    filteredArray.put(scheduleData);
                }
            }
        }

        return filteredArray;
    }

    private static void generateSchedule(){
        try{
            ResultSet rs1 = routeTable.getAll();
            while (rs1.next()) {
                ResultSet rs2 = scheduleTable.getWeekSchedules(rs1.getString("route_id"));
            }
        }
        catch (Exception e){

        }
    }

}


