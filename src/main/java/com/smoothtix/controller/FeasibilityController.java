package com.smoothtix.controller;
import java.sql.Connection;

import com.google.gson.*;
import com.smoothtix.dao.feasibilityTable;
import com.smoothtix.model.Feasibility;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Date;
import java.sql.SQLException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class FeasibilityController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("FeasibilityController doPost method invoked.");
        response.setContentType("application/json");  // Set the content type to JSON
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();  // Specify date format

            try (BufferedReader reader = request.getReader()) {
                // Log the raw JSON data
                StringBuilder requestData = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    requestData.append(line);
                }

                System.out.println("Received raw data: " + requestData.toString());

                // Attempt to deserialize the JSON data
                Feasibility feasible_schedule = gson.fromJson(requestData.toString(), Feasibility.class);
                System.out.println("Received data: " + feasible_schedule.toString());

                int registrationSuccess = feasibilityTable.insert(feasible_schedule);

                if (registrationSuccess >= 1) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    out.println(gson.toJson("Registration successful"));
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.println(gson.toJson("Registration failed"));
                }
            }
        } catch (JsonSyntaxException | SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Internal Server Error: " + e.getMessage());
        } finally {
            out.close();  // Close the PrintWriter
        }
    }


}