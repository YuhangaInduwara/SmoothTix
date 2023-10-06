package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Login;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

@WebServlet(name = "LoginController", value = "/loginController")
public class LoginController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Login login = gson.fromJson(reader, Login.class);
            ResultSet resultset = passengerTable.get(login.getnic());

            String hashedPassword = null;
            String plainPassword = login.getpassword();
            int priority = 0;

            if (resultset.next()) {
                hashedPassword = resultset.getString("password");
                priority = resultset.getInt("priority");
            } else {
                out.write("No such NIC");
            }

            boolean valid = PasswordHash.checkPassword(plainPassword, hashedPassword);
            if(valid){
                String jsonResponse = "{\"priority\": " + priority + "}";
                out.write(jsonResponse);
                response.setStatus(HttpServletResponse.SC_OK);
            } else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
