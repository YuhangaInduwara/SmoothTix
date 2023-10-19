package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
import com.smoothtix.model.Bus;
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

@WebServlet(name = "busController", value = "/busController")
public class BusController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray();

        String bus_id = request.getHeader("bus_id");

        try {
            ResultSet rs = null;
            if(bus_id == null){
                rs = busTable.getAll();
            }
            else{
                rs = busTable.get(bus_id);
            }

            while (rs.next()) {
                JSONObject busData = new JSONObject();
                busData.put("bus_id", rs.getString("bus_id"));
                busData.put("owner_id", rs.getString("owner_id"));
                busData.put("route", rs.getString("route"));
                busData.put("engineNo", rs.getString("engineNo"));
                busData.put("chassisNo", rs.getString("chassisNo"));
                busData.put("noOfSeats", rs.getInt("noOfSeats"));
                busData.put("manufact_year", rs.getString("manufact_year"));
                busData.put("brand", rs.getString("brand"));
                busData.put("model", rs.getString("model"));

                busDataArray.put(busData);
            }

            out.println(busDataArray.toString()); // Send JSON data as a response
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
            Bus bus = gson.fromJson(reader, Bus.class);
            int registrationSuccess = busTable.insert(bus);

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