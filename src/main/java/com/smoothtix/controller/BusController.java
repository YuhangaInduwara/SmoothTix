package com.smoothtix.controller;

import com.smoothtix.dao.busTable;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

@WebServlet(name = "busController", value = "/busController")
public class BusController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray(); // Create a JSON array for data

        try {
            ResultSet rs = busTable.getAll();
            while (rs.next()) {
                JSONObject busData = new JSONObject();
                busData.put("bus_id", rs.getString("bus_id"));
                busData.put("owner_id", rs.getString("owner_id"));
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

    }
}