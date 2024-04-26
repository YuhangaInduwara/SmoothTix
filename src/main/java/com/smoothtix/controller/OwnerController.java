package com.smoothtix.controller;

import com.smoothtix.dao.ownerTable;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class OwnerController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String p_id = request.getHeader("p_id");
        String action = request.getParameter("action");
        try {
            if(action == null){
                boolean isOwner = ownerTable.isOwner(p_id); // Check if the user is an owner
                if (isOwner) {
                    response.setStatus(HttpServletResponse.SC_OK); // Set response status to indicate success
                } else {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN); // Set response status to indicate user is not an owner
                }
            }
            else if(action.equals("owner_id")){
                ResultSet rs = ownerTable.getByP_id(p_id);
                if(rs.next()){
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("owner_id", rs.getString("owner_id"));
                    String jsonOutput = jsonObject.toString();
                    out.write(jsonOutput);

                    response.setStatus(HttpServletResponse.SC_OK);
                }
                else{
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            }
            else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // Set response status to indicate internal server error
        }
    }
}
