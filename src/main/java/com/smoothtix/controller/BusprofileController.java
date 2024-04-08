package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.busprofileTable;
import com.smoothtix.model.Busprofile;
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

public class BusprofileController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busprofileDataArray = new JSONArray();

        String bus_profile_id = request.getHeader("bus_profile_id");

        try {
            ResultSet rs = null;
            if(bus_profile_id == null){
                rs = busprofileTable.getAll();
            }
            else{
                rs = busprofileTable.get(bus_profile_id);
            }

            while (rs.next()) {
                JSONObject busprofileData = new JSONObject();
                busprofileData.put("bus_profile_id", rs.getString("bus_profile_id"));
                busprofileData.put("bus_id", rs.getString("bus_id"));
                busprofileData.put("driver_id", rs.getString("driver_id"));
                busprofileData.put("conductor_id", rs.getString("conductor_id"));

                busprofileDataArray.put(busprofileData);
            }

            out.println(busprofileDataArray.toString()); // Send JSON data as a response
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
            Busprofile busprofile = gson.fromJson(reader, Busprofile.class);
            int registrationSuccess = busprofileTable.insert(busprofile);

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

            String bus_profile_id = request.getHeader("bus_profile_id");

            BufferedReader reader = request.getReader();
            Busprofile busprofile = gson.fromJson(reader, Busprofile.class);


            int updateSuccess = busprofileTable.update(bus_profile_id, busprofile);

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
            String bus_profile_id = request.getHeader("bus_profile_id");
            int deleteSuccess = busprofileTable.delete(bus_profile_id);
            System.out.println(bus_profile_id);
            if (deleteSuccess >= 1) {
                System.out.println(deleteSuccess);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                System.out.println(deleteSuccess);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}