package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.scheduleTable;
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
        PrintWriter out = response.getWriter();
        JSONArray scheduleDataArray = new JSONArray();
        String schedule_id = request.getHeader("schedule_id");
        String driver_id = request.getHeader("driver_id");

        String start = request.getParameter("start");
        String destination = request.getParameter("destination");
        String date = request.getParameter("date");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");

        try {
            ResultSet rs;
            if(schedule_id == null && driver_id == null){
                rs = scheduleTable.getAll();

                while (rs.next()) {
                    JSONObject scheduleData = new JSONObject();
                    scheduleData.put("schedule_id", rs.getString("schedule_id"));
                    scheduleData.put("reg_no", rs.getString("reg_no"));
                    scheduleData.put("start", rs.getString("start"));
                    scheduleData.put("destination", rs.getString("destination"));
                    scheduleData.put("date", rs.getDate("date_time"));
                    scheduleData.put("time", rs.getTime("date_time"));
                    java.util.Date originalTime = rs.getTime("date_time");
                    java.util.Date adjustedTime = new java.util.Date(originalTime.getTime() - 3600000);
                    SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
                    String formattedTime = timeFormat.format(adjustedTime);
                    scheduleData.put("adjusted_time", formattedTime);
                    scheduleData.put("price_per_ride", rs.getDouble("price_per_ride"));
                    scheduleData.put("available_seats", rs.getInt("available_seats"));
                    scheduleDataArray.put(scheduleData);
                }
                if(start != null || destination != null || date != null || startTime != null || endTime != null){
                    scheduleDataArray = filterScheduleData(scheduleDataArray, start, destination, date, startTime, endTime);
                }
            }
            else if(driver_id == null){
                rs = scheduleTable.getByScheduleId(schedule_id);
            }
            else if(schedule_id == null){
                rs = scheduleTable.getByDriverId(driver_id);
                while (rs.next()) {
                    JSONObject scheduleData = new JSONObject();
                    scheduleData.put("schedule_id", rs.getString("schedule_id"));
                    scheduleData.put("bus_profile_id", rs.getString("bus_profile_id"));
                    scheduleData.put("date_time", rs.getString("date_time"));
                    scheduleData.put("route_no", rs.getString("route_no"));
                    scheduleData.put("start", rs.getString("start"));
                    scheduleData.put("destination", rs.getString("destination"));
                    scheduleDataArray.put(scheduleData);
                }
            }

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
//        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Schedule schedule = gson.fromJson(reader, Schedule.class);
            int registrationSuccess = scheduleTable.insert(schedule);

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
//
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String schedule_id = request.getHeader("schedule_id");

            BufferedReader reader = request.getReader();
            Schedule schedule = gson.fromJson(reader, Schedule.class);


            int updateSuccess = scheduleTable.update(schedule_id, schedule);

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
//        PrintWriter out = response.getWriter();

        try {
            String schedule_id = request.getHeader("schedule_id");
            int deleteSuccess = scheduleTable.delete(schedule_id);

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
                Date parsedStartTime = timeFormat.parse(startTime);
                Date parsedEndTime = timeFormat.parse(endTime);
                String scheduleTimeStr = scheduleData.getString("time");
                Date scheduleTime = timeFormat.parse(scheduleTimeStr);

                if (scheduleTime.after(parsedStartTime) && scheduleTime.before(parsedEndTime)) {
                    if ((Objects.equals(start, "") || start.equals(scheduleData.getString("start")))
                            && (Objects.equals(destination, "") || destination.equals(scheduleData.getString("destination")))
                            && (Objects.equals(date, "") || date.equals(scheduleData.getString("date")))) {
                        filteredArray.put(scheduleData);
                    }
                }
            } else {
                if ((Objects.equals(start, "") || start.equals(scheduleData.getString("start")))
                        && (Objects.equals(destination, "") || destination.equals(scheduleData.getString("destination")))
                        && (Objects.equals(date, "") || date.equals(scheduleData.getString("date")))) {
                    filteredArray.put(scheduleData);
                }
            }
        }

        return filteredArray;
    }

}
