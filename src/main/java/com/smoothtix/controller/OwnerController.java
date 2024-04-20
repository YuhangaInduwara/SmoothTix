package com.smoothtix.controller;

import com.smoothtix.dao.ownerTable;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class OwnerController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String p_id = request.getHeader("p_id"); // Get the user's p_id from the request header
        try {
            boolean isOwner = ownerTable.isOwner(p_id); // Check if the user is an owner
            if (isOwner) {
                response.setStatus(HttpServletResponse.SC_OK); // Set response status to indicate success
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // Set response status to indicate user is not an owner
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // Set response status to indicate internal server error
        }
    }
}
