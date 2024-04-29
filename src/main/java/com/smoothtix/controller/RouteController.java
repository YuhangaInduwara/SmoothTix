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
    //// handle an HTTP GET request
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();
        JSONArray routeDataArray = new JSONArray();
        String route_id = request.getHeader("route_id");
        String request_data = request.getParameter("request_data");
        try {
            ResultSet rs;

            // Check if route_id is null
            if(route_id == null){
                // If route_id is null
                if(request_data == null){
                    // If request_data parameter is also null, retrieve all route data
                    rs = routeTable.getAll();

                    // Iterate through the result set and create JSON objects for each route
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
                } else if (Objects.equals(request_data, "stand_list")){
                    // If request_data is "stand_list", retrieve stand list data
                    rs = routeTable.getStands();

                    // Iterate through the result set and create JSON objects for each stand
                    while (rs.next()) {
                        JSONObject routeData = new JSONObject();
                        routeData.put("stand_list", rs.getString("stand_list"));
                        // Commenting out the following line
                        // System.out.println(routeData);
                        routeDataArray.put(routeData);
                    }
                }
            } else {
                // If route_id is not null, retrieve route data for the specified route_id
                rs = routeTable.get(route_id);

                // Iterate through the result set and create JSON objects for each route
                while (rs.next()) {
                    JSONObject routeData = new JSONObject();
                    routeData.put("route_id", rs.getString("route_id"));
                    routeData.put("route_no", rs.getString("route_no"));
                    routeData.put("start", rs.getString("start"));
                    routeData.put("destination", rs.getString("destination"));
                    routeData.put("distance", rs.getString("distance"));
                    routeData.put("price_per_ride", rs.getString("price_per_ride"));
                    // Commenting out the following line
                    // System.out.println(routeData);
                    routeDataArray.put(routeData);
                }
            }

            // Print the JSON array to the response
            out.println(routeDataArray);
            // Set response status to OK (200)
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            // If an exception occurs, set response status to Internal Server Error (500)
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Set response content type
        response.setContentType("text/html");

        // Initialize PrintWriter to write response
        PrintWriter out = response.getWriter();

        try {
            // Initialize Gson for JSON parsing
            Gson gson = new Gson();

            // Read request body using BufferedReader
            BufferedReader reader = request.getReader();

            // Parse JSON request body into Route object
            Route route = gson.fromJson(reader, Route.class);

            // Insert the Route object into the database and get the insertion status
            int insertionSuccess = routeTable.insert(route);

            // Check the insertion status and respond accordingly
            if(insertionSuccess == 100){
                // If insertion failed due to duplicate route number
                out.write("{\"error\": \"The route number is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if(insertionSuccess == 101){
                // If insertion failed due to existing route with the same start and destination
                out.write("{\"error\": \"A route with the same start and destination is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if (insertionSuccess >= 1) {
                // If insertion was successful
                out.write("{\"error\": \"Route added successfully!\"}");
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else {
                // If insertion failed for some other reason
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            // If an exception occurs, print the stack trace and set response status to Internal Server Error
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Set response content type
        response.setContentType("text/html");

        // Initialize PrintWriter to write response
        PrintWriter out = response.getWriter();

        try {
            // Initialize Gson for JSON parsing
            Gson gson = new Gson();

            // Get the route_id from request header
            String route_id = request.getHeader("route_id");

            // Read request body using BufferedReader and parse JSON into Route object
            BufferedReader reader = request.getReader();
            Route route = gson.fromJson(reader, Route.class);

            // Update the route in the database and get the update status
            int updateSuccess = routeTable.update(route_id, route);

            // Check the update status and respond accordingly
            if(updateSuccess == 100){
                // If update failed due to duplicate route number
                out.write("{\"error\": \"The route number is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if(updateSuccess == 101){
                // If update failed due to existing route with the same start and destination
                out.write("{\"error\": \"A route with the same start and destination is already exist!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if (updateSuccess >= 1) {
                // If update was successful
                out.write("{\"error\": \"Route updated successfully!\"}");
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else {
                // If update failed for some other reason
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            // If an exception occurs, print the stack trace and set response status to Internal Server Error
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
        // Set response content type
        response.setContentType("text/json");

        try {
            // Get the route_id from request header
            String route_id = request.getHeader("route_id");

            // Delete the route from the database and get the deletion status
            int deleteSuccess = routeTable.delete(route_id);

            // Check the deletion status and respond accordingly
            if (deleteSuccess >= 1) {
                // If deletion was successful
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                // If deletion failed
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            // If an exception occurs, set response status to Internal Server Error
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


}