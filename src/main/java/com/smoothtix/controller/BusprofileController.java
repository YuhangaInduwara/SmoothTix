package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busprofileTable;
import com.smoothtix.model.Busprofile;
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

@WebServlet(name = "busprofileController", value = "/busprofileController")
public class BusprofileController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busprofileDataArray = new JSONArray();

        String busprofile_id = request.getHeader("busprofile_id");

        try {
            ResultSet rs = null;
            if(busprofile_id == null){
                rs = busprofileTable.getAll();
            }
            else{
                rs = busprofileTable.get(busprofile_id);
            }

            while (rs.next()) {
                JSONObject busprofileData = new JSONObject();
                busprofileData.put("busprofile_id", rs.getString("busprofile_id"));
                busprofileData.put("driver_id", rs.getString("driver_id"));
                busprofileData.put("conductor_id", rs.getString("conductor_id"));
                busprofileData.put("noOfSeats", rs.getInt("noOfSeats"));
                busprofileData.put("route", rs.getString("route"));

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

            String busprofile_id = request.getHeader("busprofile_id");

            BufferedReader reader = request.getReader();
            Busprofile busprofile = gson.fromJson(reader, Busprofile.class);


            int updateSuccess = busprofileTable.update(busprofile_id, busprofile);

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
            String busprofile_id = request.getHeader("busprofile_id");
            int deleteSuccess = busprofileTable.delete(busprofile_id);

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