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
        JSONArray locationDataArray = new JSONArray();
        String schedule_id = request.getParameter("schedule_id");

        try {
            ResultSet rs = locationTable.getByScheduleId(schedule_id);
            while (rs.next()) {
                JSONObject scheduleData = new JSONObject();
                scheduleData.put("schedule_id", rs.getString("schedule_id"));
                scheduleData.put("latitude", rs.getString("latitude"));
                scheduleData.put("longitude", rs.getString("longitude"));
                locationDataArray.put(scheduleData);
            }

            out.println(locationDataArray.toString());
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
//            System.out.println("hello_location");
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
