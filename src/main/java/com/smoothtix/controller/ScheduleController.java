package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
import com.smoothtix.dao.scheduleTable;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Schedule;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

@WebServlet(name = "scheduleController", value = "/scheduleController")
public class ScheduleController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray scheduleDataArray = new JSONArray();

        String schedule_id = request.getHeader("schedule_id");

        try {
            ResultSet rs = null;
            if(schedule_id == null){
                rs = scheduleTable.getAll();
            }
            else{
                rs = scheduleTable.get(schedule_id);
            }

            while (rs.next()) {
                JSONObject scheduleData = new JSONObject();
                scheduleData.put("schedule_id", rs.getString("schedule_id"));
                scheduleData.put("date", rs.getString("date"));
                scheduleData.put("route_id", rs.getString("route_id"));
                scheduleData.put("start", rs.getString("start"));
                scheduleData.put("destination", rs.getString("destination"));
                scheduleData.put("start_time", rs.getString("start_time"));
                scheduleData.put("end_time", rs.getString("end_time"));

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
//    @Override
//    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            Gson gson = new Gson();
//
//            String bus_id = request.getHeader("bus_id");
//
//            BufferedReader reader = request.getReader();
//            Bus bus = gson.fromJson(reader, Bus.class);
//
//
//            int updateSuccess = busTable.update(bus_id, bus);
//
//            if (updateSuccess >= 1) {
//                response.setStatus(HttpServletResponse.SC_OK);
//            } else {
//                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @Override
//    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            String bus_id = request.getHeader("bus_id");
//            int deleteSuccess = busTable.delete(bus_id);
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
