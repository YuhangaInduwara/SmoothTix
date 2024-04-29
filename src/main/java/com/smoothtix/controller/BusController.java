package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
import com.smoothtix.dao.ownerTable;
import com.smoothtix.model.Bus;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class BusController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray();

        String bus_id = request.getHeader("bus_id");
        String p_id = request.getHeader("p_id");

        try {
            ResultSet rs = null;
            if (bus_id != null) {
                rs = busTable.get(bus_id);
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_no", rs.getString("route_no"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("review_points", rs.getFloat("review_points"));
                    busDataArray.put(busData);
                }

            } else if (p_id != null) {
                rs = busTable.getByOwner(p_id);
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_id", rs.getString("route_id"));
                    busData.put("route", rs.getString("start") + " - " + rs.getString("destination"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("review_points", rs.getFloat("review_points"));
                    busDataArray.put(busData);
                }
            } else {
                rs = busTable.getAll();
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_id", rs.getString("route_id"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("review_points", rs.getFloat("review_points"));
                    busDataArray.put(busData);
                }
            }

            out.println(busDataArray.toString()); // Send JSON data as a response
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        System.out.println("hello");
        try {
            String p_id = request.getHeader("p_id");// Get passenger's ID from request header
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Bus bus = gson.fromJson(reader, Bus.class);
            System.out.println(bus.getReg_no());
            boolean busExists = busTable.isBusExists(bus.getReg_no());
            System.out.println(busExists);
            if (busExists) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                out.println("Bus with registration number already exists.");
                return;
            }

            String ownerID = getOwnerID(p_id); // Retrieve owner ID or null if not found
            if (ownerID != null) {
                int registrationSuccess = busTable.insert(bus, ownerID); // Pass owner's ID to insert method

                if (registrationSuccess >= 1) {
                    response.setStatus(HttpServletResponse.SC_OK);
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                }
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
    // Retrieve owner ID based on passenger ID
    private String getOwnerID(String p_id) {
        try {
            // Check if the passenger is also an owner
            boolean isOwner = ownerTable.isOwner(p_id);

            if (isOwner) {
                // If the passenger is an owner, retrieve their owner ID
                return ownerTable.getOwnerIDByPassengerID(p_id);

            } else {
                // If the passenger is not an owner, insert a new entry into the owner table
                String ownerID = ownerTable.insertOwner(p_id);
                return ownerID;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String bus_id = request.getHeader("bus_id");

            BufferedReader reader = request.getReader();
            Bus bus = gson.fromJson(reader, Bus.class);


            int updateSuccess = busTable.update(bus_id, bus);

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
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            String bus_id = request.getHeader("bus_id");
            int deleteSuccess = busTable.delete(bus_id);

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

}