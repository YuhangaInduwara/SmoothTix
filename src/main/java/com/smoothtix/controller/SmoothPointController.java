package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.smoothPointTable;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.SmoothPoint;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

import static com.smoothtix.controller.PasswordHash.checkPassword;

public class SmoothPointController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set content type of the response
        response.setContentType("text/html");

        // Get PrintWriter object for writing response
        PrintWriter out = response.getWriter();

        // Initialize an empty JSONArray to hold passenger data
        JSONArray passengerDataArray = new JSONArray();

        // Get the passenger ID from the request parameter
        String p_id = request.getParameter("p_id");

        // Declare a variable to store the smooth point
        double smooth_point;

        try {
            // Retrieve smooth point data from the database for the specified passenger ID
            ResultSet rs = smoothPointTable.getBy_p_id(p_id);

            // If data is found for the passenger ID
            if(rs.next()) {
                // Retrieve the smooth point value from the ResultSet
                smooth_point = rs.getDouble("smooth_points");

                // Write the smooth point value as a JSON object to the response
                out.println("{\"smooth_points\": " + smooth_point + "}");

                // Set response status to OK (200)
                response.setStatus(HttpServletResponse.SC_OK);
            }
            // If no data is found for the passenger ID
            else{
                // Set response status to BAD_REQUEST (400)
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        }
        // If an exception occurs, print the stack trace and set response status to INTERNAL_SERVER_ERROR (500)
        catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set content type of the response
        response.setContentType("text/html");

        // Get PrintWriter object for writing response
        PrintWriter out = response.getWriter();

        // Get the action parameter from the request
        String action = request.getParameter("action");

        try {
            // Initialize Gson object for JSON parsing
            Gson gson = new Gson();

            // Get BufferedReader object for reading request body
            BufferedReader reader = request.getReader();

            // Parse JSON request body into SmoothPoint object
            SmoothPoint smoothPoint = gson.fromJson(reader, SmoothPoint.class);

            // Variable to track the success of the update operation
            int updateSuccess = 0;

            // Check the action parameter and perform corresponding update operation
            if(action.equals("add")) {
                updateSuccess = smoothPointTable.updateAdd(smoothPoint);
            }
            else if(action.equals("subtract")) {
                updateSuccess = smoothPointTable.updateSubtract(smoothPoint);
            }

            // If the update operation is successful
            if(updateSuccess > 0) {
                // Set response status to OK (200)
                response.setStatus(HttpServletResponse.SC_OK);
            }
            // If the update operation fails
            else{
                // Set response status to BAD_REQUEST (400)
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }

        }
        // If an exception occurs, print the stack trace and set response status to INTERNAL_SERVER_ERROR (500)
        catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}