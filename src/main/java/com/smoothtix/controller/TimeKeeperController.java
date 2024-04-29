package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.dao.timeKprTable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smoothtix.model.Passenger;
import com.smoothtix.model.TimeKeeper;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class TimeKeeperController extends HttpServlet {
    @Override
    // handle an HTTP GET request
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();
        JSONArray timeKprDataArray = new JSONArray();
        String p_id = request.getParameter("p_id");
        String timekpr_id = request.getParameter("timekpr_id");

        try {
            ResultSet rs;
          //both timekpr_id and p_id are null, it retrieves all data from the timeKprTable
            if(timekpr_id == null){
                if(p_id == null){

                    rs = timeKprTable.getAll();
                }
                // p_id not null
                else{
                    rs = timeKprTable.get_by_p_id(p_id);
                }
            }

            //timekpr_id is not null, it retrieves data from the timeKprTable
            else{
                rs = timeKprTable.get(timekpr_id);
            }

            //constructs a JSON response containing data retrieved from the database and sends it as the HTTP response,
            while (rs.next()) {
                JSONObject timeKprData = new JSONObject();
                timeKprData.put("timekpr_id", rs.getString("timekpr_id"));
                timeKprData.put("p_id", rs.getString("p_id"));
                timeKprData.put("stand", rs.getString("stand"));
                timeKprDataArray.put(timeKprData);
            }
            out.println(timeKprDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    //handle an HTTP POST reques
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws  IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();  //gets a writer to send data back to the client in JSON format.

        try {
            //retrieves the JSON data from the request
            BufferedReader reader = request.getReader();
            JsonElement jsonElement = JsonParser.parseReader(reader);
            int result;

            //processes JSON data by extracting specific values from a JSON object
            if (jsonElement.isJsonObject()) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                String nic = jsonObject.get("nic").getAsString();
                String stand = jsonObject.get("stand").getAsString();
                result = timeKprTable.insert(nic, stand);
            } else{
                return;
            }

           //represents different error scenarios
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
    //handles HTTP PUT requests.
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();  // read the JSON data sent in the request body
            TimeKeeper timekeeper = gson.fromJson(reader, TimeKeeper.class);
            int updateSuccess = 0;
            System.out.println(timekeeper.get_timekpr_id());
            System.out.println(timekeeper.get_stand());

            //ensures that the database is only updated if both timekpr_id and stand properties are not null,
            if(timekeeper.get_timekpr_id() != null && timekeeper.get_stand() != null){
                updateSuccess = timeKprTable.update(timekeeper);
                if(updateSuccess == 1){
                    response.setStatus(HttpServletResponse.SC_OK);
                }
            }
            else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override

    //handling HTTP DELETE requests
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/json");

        //handles a DELETE request by extracting the timekpr_id from the request header
        try {
            //the deleteSuccess variable would hold the result of the deletion operation
            String timekpr_id = request.getHeader("timekpr_id");
            int deleteSuccess = timeKprTable.delete(timekpr_id);
            //Delete success
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
