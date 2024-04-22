package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.driverTable;
import com.smoothtix.dao.ownerTable;
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
import java.sql.SQLOutput;

public class DriverController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();

        String driver_id = request.getHeader("driver_id");
        String p_id = request.getHeader("p_id");
        String op_id = request.getHeader("op_id");
        String dp_id = request.getHeader("dp_id");

        try {
            ResultSet rs = null;

            if (driver_id == null && p_id == null && op_id != null) {
                rs = driverTable.get_NIC(op_id);
                while (rs != null && rs.next()) {
                    JSONObject nicData = new JSONObject();
                    nicData.put("nic", rs.getString("nic"));
                    passengerDataArray.put(nicData);
                }
            } else if (driver_id != null) {
                // Fetch driver data by driver_id
                rs = driverTable.get(driver_id);
                while (rs != null && rs.next()) {
                    JSONObject driverData = new JSONObject();
                    driverData.put("driver_id", rs.getString("driver_id"));
                    driverData.put("p_id", rs.getString("p_id"));
                    driverData.put("license_no", rs.getString("license_no"));
                    driverData.put("review_points", rs.getDouble("review_points"));
                    passengerDataArray.put(driverData);
                }
            } else if (p_id != null) {
                // Fetch driver data by p_id
                rs = driverTable.get_by_p_id(p_id);
                while (rs != null && rs.next()) {
                    JSONObject driverData = new JSONObject();
                    driverData.put("driver_id", rs.getString("driver_id"));
                    driverData.put("p_id", rs.getString("p_id"));
                    driverData.put("license_no", rs.getString("license_no"));
                    driverData.put("review_points", rs.getDouble("review_points"));
                    passengerDataArray.put(driverData);
                }
            } else if (dp_id != null) { // Check if dp_id is provided
                // Call getAllByOwner method when dp_id is provided
                rs = driverTable.getAllByOwner(dp_id);
                while (rs != null && rs.next()) {
                    JSONObject driverData = new JSONObject();
                    driverData.put("driver_id", rs.getString("driver_id"));
                    driverData.put("p_id", rs.getString("p_id"));
                    driverData.put("license_no", rs.getString("license_no"));
                    driverData.put("review_points", rs.getDouble("review_points"));
                    passengerDataArray.put(driverData);
                }
            } else {
                // Fetch all driver data
                rs = driverTable.getAll();
                while (rs != null && rs.next()) {
                    JSONObject driverData = new JSONObject();
                    driverData.put("driver_id", rs.getString("driver_id"));
                    driverData.put("p_id", rs.getString("p_id"));
                    driverData.put("license_no", rs.getString("license_no"));
                    driverData.put("review_points", rs.getDouble("review_points"));
                    passengerDataArray.put(driverData);
                }
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

        String p_id = request.getHeader("p_id");

        try {
            BufferedReader reader = request.getReader();
            JsonElement jsonElement = JsonParser.parseReader(reader);
            String ownerID = ownerTable.getOwnerIDByPassengerID(p_id);
            int result;

            if (jsonElement.isJsonObject()) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                String nic = jsonObject.get("nic").getAsString();
                String license_no = jsonObject.get("license_no").getAsString();
                result = driverTable.insert(nic, license_no,ownerID);
                System.out.println(result);
            } else{
                return;
            }

            if(result == 0){
                out.write("{\"error\": \"Incorrect NIC!\"}");
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
            else if(result == 1){
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else if(result == 3){
                out.write("{\"error\": \"The user is already a Driver!\"}");
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

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String driver_id = request.getHeader("driver_id");

            BufferedReader reader = request.getReader();
            Driver driver = gson.fromJson(reader, Driver.class);


            int updateSuccess = driverTable.update(driver_id, driver);

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
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/json");

        try {
            String driver_id = request.getHeader("driver_id");
            int deleteSuccess = driverTable.delete(driver_id);
            System.out.println(driver_id);
            if (deleteSuccess >= 1) {
                System.out.println(deleteSuccess);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                System.out.println(deleteSuccess);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}