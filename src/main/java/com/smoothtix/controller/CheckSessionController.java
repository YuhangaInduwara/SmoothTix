package com.smoothtix.controller;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.servlet.http.HttpSession;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;

public class CheckSessionController extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("session");
        HttpSession session = request.getSession(false); // Get the current session (if it exists)
        if (session != null) {
            // Session is active
            String nic = (String) session.getAttribute("nic");
            int user_role = (int) session.getAttribute("user_role");
            String user_name = (String) session.getAttribute("user_name");
            String p_id = (String) session.getAttribute("p_id");

            // Create a JSON object to send session data to the client
            JSONObject sessionData = new JSONObject();
            try {
                sessionData.put("nic", nic);
                sessionData.put("user_role", user_role);
                sessionData.put("user_name", user_name);
                sessionData.put("p_id", p_id);
                System.out.println(p_id);
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }

            // Set the response content type to JSON
            response.setContentType("application/json");

            // Send the JSON response with session data
            try (PrintWriter out = response.getWriter()) {
                out.print(sessionData.toString());
                response.setStatus(HttpServletResponse.SC_OK);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            // Session has expired
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
