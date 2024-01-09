package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.locationTable;
import com.smoothtix.dao.scheduleTable;
import com.smoothtix.model.Location;
import com.smoothtix.model.Schedule;
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
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray scheduleDataArray = new JSONArray();
        String schedule_id = request.getHeader("schedule_id");
//        String driver_id = request.getHeader("driver_id");
        System.out.println(schedule_id);

        try {
            ResultSet rs = locationTable.getByScheduleId(schedule_id);
//            if(schedule_id == null && driver_id == null){
//                rs = scheduleTable.getAll();
//            }
//            else if(driver_id == null){
//                rs = scheduleTable.getByScheduleId(schedule_id);
//            }
//            else if(schedule_id == null){
//                rs = scheduleTable.getByDriverId(driver_id);
//            }

//            while (rs.next()) {
//                JSONObject scheduleData = new JSONObject();
//                scheduleData.put("schedule_id", rs.getString("schedule_id"));
//                scheduleData.put("date", rs.getString("date"));
//                scheduleData.put("route_id", rs.getString("route_id"));
//                scheduleData.put("start", rs.getString("start"));
//                scheduleData.put("destination", rs.getString("destination"));
//                scheduleData.put("start_time", rs.getString("start_time"));
//                scheduleData.put("end_time", rs.getString("end_time"));
//
//                scheduleDataArray.put(scheduleData);
//            }

            while (rs.next()) {
                JSONObject scheduleData = new JSONObject();
//                scheduleData.put("location_id", rs.getString("location_id"));
                scheduleData.put("schedule_id", rs.getString("schedule_id"));
                scheduleData.put("latitude", rs.getString("latitude"));
                scheduleData.put("longitude", rs.getString("longitude"));
//                System.out.println(scheduleData);
                scheduleDataArray.put(scheduleData);
            }

            out.println(scheduleDataArray.toString()); // Send JSON data as a response
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Location location = gson.fromJson(reader, Location.class);
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
//
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String schedule_id = request.getHeader("schedule_id");

            BufferedReader reader = request.getReader();
            Location location = gson.fromJson(reader, Location.class);


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

//    @Override
//    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            String schedule_id = request.getHeader("schedule_id");
//            int deleteSuccess = scheduleTable.delete(schedule_id);
//
//            if (deleteSuccess >= 1) {
//                response.setStatus(HttpServletResponse.SC_OK);
//            } else {
//                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }

}
