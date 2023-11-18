package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.busTable;
import com.smoothtix.dao.routeTable;
import com.smoothtix.dao.timeKprTable;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Route;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class RouteController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();
        String route_id = request.getHeader("route_id");

        try {
            ResultSet rs;

//            if(route_id == null){
                rs = routeTable.getAll();
//            }
//            else{
//                rs = routeTable.get(route_id);
//            }

            while (rs.next()) {
                JSONObject routeData = new JSONObject();
                routeData.put("route_id", rs.getString("route_id"));
                routeData.put("route_no", rs.getString("route_no"));
                routeData.put("start", rs.getString("start"));
                routeData.put("destination", rs.getString("destination"));
                routeData.put("distance", rs.getString("distance"));
                routeData.put("price_per_ride", rs.getString("price_per_ride"));
                passengerDataArray.put(routeData);
            }

            out.println(passengerDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws  IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Route route = gson.fromJson(reader, Route.class);
            int registrationSuccess = routeTable.insert(route);

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

//    @Override
//    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
//        response.setContentType("text/json");
//
//        try {
//            String timekpr_id = request.getHeader("timekpr_id");
//            int deleteSuccess = timeKprTable.delete(timekpr_id);
//
//            if (deleteSuccess >= 1) {
//                response.setStatus(HttpServletResponse.SC_OK);
//            } else {
//                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }

}