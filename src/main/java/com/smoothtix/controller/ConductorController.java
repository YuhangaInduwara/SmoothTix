package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.conductorTable;
import com.smoothtix.model.Conductor;
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

@WebServlet(name = "conductorController", value = "/conductorController")
public class ConductorController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray conductorDataArray = new JSONArray();

        String conductor_id = request.getHeader("conductor_id");

        try {
            ResultSet rs = null;
            if(conductor_id == null){
                rs = conductorTable.getAll();
            }
            else{
                rs = conductorTable.get(conductor_id);
            }

            while (rs.next()) {
                JSONObject conductorData = new JSONObject();
                conductorData.put("conductor_id", rs.getString("conductor_id"));
                conductorData.put("nic", rs.getString("nic"));


                conductorDataArray.put(conductorData);
            }

            out.println(conductorDataArray.toString()); // Send JSON data as a response
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            Gson gson = new Gson();
//
//            BufferedReader reader = request.getReader();
//            Bus bus = gson.fromJson(reader, Bus.class);
//            int registrationSuccess = busTable.insert(bus);
//
//            if (registrationSuccess >= 1) {
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
//
}