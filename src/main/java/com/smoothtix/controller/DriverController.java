package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.driverTable;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.dao.timeKprTable;
import com.smoothtix.model.Driver;
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
import java.sql.SQLException;

public class DriverController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();

        String driver_id = request.getHeader("driver_id");
        String p_id = request.getHeader("p_id");
        System.out.println("hello: " + p_id);

        try {
            ResultSet rs;

            if(driver_id == null){
                if(p_id == null){

                    rs = driverTable.getAll();
                }
                else{
                    rs = driverTable.get_by_p_id(p_id);
                }
            }
            else{
                rs = driverTable.get(driver_id);
            }

            while (rs.next()) {
                JSONObject driverData = new JSONObject();
                driverData.put("driver_id", rs.getString("driver_id"));
                driverData.put("p_id", rs.getString("p_id"));
                driverData.put("license_no", rs.getString("license_no"));
                driverData.put("review_points", rs.getString("review_points"));
                passengerDataArray.put(driverData);
            }
            out.println(passengerDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws  IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();

        try {
            BufferedReader reader = request.getReader();
            JsonElement jsonElement = JsonParser.parseReader(reader);
            int result;

            if (jsonElement.isJsonObject()) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                String p_id = jsonObject.get("p_id").getAsString();
                String license_no = jsonObject.get("license_no").getAsString();
                Float review_points = jsonObject.get("review_points").getAsFloat();
                result = driverTable.insert(p_id, license_no, review_points);
                System.out.println(p_id);
            } else{
                return;
            }

            if(result == 0){
                out.write("{\"error\": \"Incorrect PID!\"}");
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
            else if(result == 1){
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else if(result == 3){
                out.write("{\"error\": \"The user is already a driver!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if(result == 4){
                out.write("{\"error\": \"The user is holding an another role!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

//    @Override
//    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            Gson gson = new Gson();
//
//            String driver_id = request.getHeader("driver_id");
//
//            BufferedReader reader = request.getReader();
//            Driver driver = gson.fromJson(reader, Driver.class);
//
//
//            int updateSuccess = driverTable.update(driver_id, driver);
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

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            String driver_id = request.getHeader("driver_id");
            int deleteSuccess = driverTable.delete(driver_id);
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