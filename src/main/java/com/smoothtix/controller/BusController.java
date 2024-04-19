package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
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

        HttpSession session = request.getSession();
        String p_id = (String) session.getAttribute("p_id"); // Retrieve p_id from session
        System.out.println(p_id);

        try {
            ResultSet rs = null;
            if (bus_id != null) {
                rs = busTable.get(bus_id);
            } else if (p_id != null) {
                rs = busTable.getByOwner(p_id); // Filter by p_id instead of owner_id
            } else {
                rs = busTable.getAll();
            }

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