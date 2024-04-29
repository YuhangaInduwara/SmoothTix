package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.conductorTable;
import com.smoothtix.dao.ownerTable;
import com.smoothtix.model.Conductor;
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

public class ConductorController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray conductorDataArray = new JSONArray();

        String p_id = request.getParameter("p_id");
        String conductor_id = request.getHeader("conductor_id");
        String op_id = request.getHeader("op_id");
        String cp_id = request.getHeader("cp_id");

        System.out.println("conductor " + p_id);

        try {
            ResultSet rs = null;

            if (conductor_id == null) {
                if (p_id == null) {
                    if (op_id != null) {
                        rs = conductorTable.get_NIC(op_id);
                        while (rs != null && rs.next()) {
                            JSONObject nicData = new JSONObject();
                            nicData.put("nic", rs.getString("nic"));
                            conductorDataArray.put(nicData);
                        }
                    } else if (cp_id != null) { // Check if cp_id is provided
                        // Call getAllByOwner method when cp_id is provided
                        rs = conductorTable.getAllByOwner(cp_id);
                        while (rs != null && rs.next()) {
                            JSONObject conductorData = new JSONObject();
                            conductorData.put("conductor_id", rs.getString("conductor_id"));
                            conductorData.put("p_id", rs.getString("p_id"));
                            conductorData.put("review_points", rs.getFloat("review_points"));

                            conductorDataArray.put(conductorData);
                        }
                    } else {
                        rs = conductorTable.getAll();
                        while (rs != null && rs.next()) {
                            JSONObject conductorData = new JSONObject();
                            conductorData.put("conductor_id", rs.getString("conductor_id"));
                            conductorData.put("p_id", rs.getString("p_id"));
                            conductorData.put("review_points", rs.getFloat("review_points"));

                            conductorDataArray.put(conductorData);
                        }
                    }
                } else {
                    rs = conductorTable.get_by_p_id(p_id);
                    while (rs != null && rs.next()) {
                        JSONObject conductorData = new JSONObject();
                        conductorData.put("conductor_id", rs.getString("conductor_id"));
                        conductorData.put("p_id", rs.getString("p_id"));
                        conductorData.put("review_points", rs.getFloat("review_points"));

                        conductorDataArray.put(conductorData);
                    }
                }
            } else {
                rs = conductorTable.get(conductor_id);
                while (rs != null && rs.next()) {
                    JSONObject conductorData = new JSONObject();
                    conductorData.put("conductor_id", rs.getString("conductor_id"));
                    conductorData.put("p_id", rs.getString("p_id"));
                    conductorData.put("review_points", rs.getFloat("review_points"));

                    conductorDataArray.put(conductorData);
                }
            }
            System.out.println(conductorDataArray);
            out.println(conductorDataArray); // Send JSON data as a response
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }



    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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
                result = conductorTable.insert(nic, ownerID);
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
                out.write("{\"error\": \"The user is already a Conductor!\"}");
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
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String conductor_id = request.getHeader("conductor_id");

            BufferedReader reader = request.getReader();
            Conductor conductor = gson.fromJson(reader, Conductor.class);
            int updateSuccess = conductorTable.update(conductor_id, conductor);

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
            String conductor_id = request.getHeader("conductor_id");
            int deleteSuccess = conductorTable.delete(conductor_id);
            System.out.println(conductor_id);
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