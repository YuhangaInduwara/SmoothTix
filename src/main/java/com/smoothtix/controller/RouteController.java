package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.routeTable;
import com.smoothtix.model.Route;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.Objects;

public class RouteController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();
        JSONArray routeDataArray = new JSONArray();
        String route_id = request.getHeader("route_id");
        String request_data = request.getParameter("request_data");
        try {
            ResultSet rs;
            if(route_id == null){
                if(request_data == null){
                    rs = routeTable.getAll();
                    while (rs.next()) {
                        JSONObject routeData = new JSONObject();
                        routeData.put("route_id", rs.getString("route_id"));
                        routeData.put("route_no", rs.getString("route_no"));
                        routeData.put("start", rs.getString("start"));
                        routeData.put("destination", rs.getString("destination"));
                        routeData.put("distance", rs.getString("distance"));
                        routeData.put("price_per_ride", rs.getString("price_per_ride"));
                        routeData.put("number_of_buses", rs.getString("number_of_buses"));
                        routeDataArray.put(routeData);
                    }
                }
                else if (Objects.equals(request_data, "stand_list")){
                    rs = routeTable.getStands();
                    while (rs.next()) {
                        JSONObject routeData = new JSONObject();
                        routeData.put("stand_list", rs.getString("stand_list"));
                        System.out.println(routeData);
                        routeDataArray.put(routeData);
                    }
                }
            }
            else{
                rs = routeTable.get(route_id);
                while (rs.next()) {
                    JSONObject routeData = new JSONObject();
                    routeData.put("route_id", rs.getString("route_id"));
                    routeData.put("route_no", rs.getString("route_no"));
                    routeData.put("start", rs.getString("start"));
                    routeData.put("destination", rs.getString("destination"));
                    routeData.put("distance", rs.getString("distance"));
                    routeData.put("price_per_ride", rs.getString("price_per_ride"));
                    System.out.println(routeData);
                    routeDataArray.put(routeData);
                }
            }
            out.println(routeDataArray);
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
            int insertionSuccess = routeTable.insert(route);

            if(insertionSuccess == 100){
                out.write("{\"error\": \"The route number is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if(insertionSuccess == 101){
                out.write("{\"error\": \"A route with the same start and destination is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if (insertionSuccess >= 1) {
                out.write("{\"error\": \"Route added successfully!\"}");
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String route_id = request.getHeader("route_id");

            BufferedReader reader = request.getReader();
            Route route = gson.fromJson(reader, Route.class);


            int updateSuccess = routeTable.update(route_id, route);

            if(updateSuccess == 100){
                out.write("{\"error\": \"The route number is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if(updateSuccess == 101){
                out.write("{\"error\": \"A route with the same start and destination is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if (updateSuccess >= 1) {
                out.write("{\"error\": \"Route added successfully!\"}");
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/json");

        try {
            String route_id = request.getHeader("route_id");
            int deleteSuccess = routeTable.delete(route_id);

            if (deleteSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}