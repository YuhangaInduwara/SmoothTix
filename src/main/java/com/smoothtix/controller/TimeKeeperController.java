package com.smoothtix.controller;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.timeKprTable;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class TimeKeeperController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();
        String p_id = request.getParameter("p_id");
        String timekpr_id = request.getHeader("timekpr_id");

        try {
            ResultSet rs;

            if(timekpr_id == null){
                if(p_id == null){

                    rs = timeKprTable.getAll();
                }
                else{
                    rs = timeKprTable.get_by_p_id(p_id);
                }
            }
            else{
                rs = timeKprTable.get(timekpr_id);
            }

            while (rs.next()) {
                JSONObject timeKprData = new JSONObject();
                timeKprData.put("timekpr_id", rs.getString("timekpr_id"));
                timeKprData.put("p_id", rs.getString("p_id"));
                timeKprData.put("stand", rs.getString("stand"));
                passengerDataArray.put(timeKprData);
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
                String nic = jsonObject.get("nic").getAsString();
                String stand = jsonObject.get("stand").getAsString();
                result = timeKprTable.insert(nic, stand);
                System.out.println(stand);
            } else{
                return;
            }

            if(result == 0){
                out.write("{\"error\": \"Incorrect nic!\"}");
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
            else if(result == 1){
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else if(result == 2){
                out.write("{\"error\": \"An unauthorized person!\"}");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            else if(result == 3){
                out.write("{\"error\": \"The user is already a timekeeper!\"}");
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
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/json");

        try {
            String timekpr_id = request.getHeader("timekpr_id");
            int deleteSuccess = timeKprTable.delete(timekpr_id);

            if (deleteSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}