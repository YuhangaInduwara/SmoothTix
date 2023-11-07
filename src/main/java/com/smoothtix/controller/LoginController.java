package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Login;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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
            ResultSet resultset = passengerTable.get(login.get_nic());
            String plainPassword = login.get_password();

            if (resultset.next()) {
                String hashedPassword = resultset.getString("password");
                int privilege_level = resultset.getInt("privilege_level");

                if (PasswordHash.checkPassword(plainPassword, hashedPassword)) {
                    HttpSession session = request.getSession();
                    session.setAttribute("username", login.get_nic());

                    String jsonResponse = "{\"priority\": " + privilege_level + "}";
                    response.setStatus(HttpServletResponse.SC_OK);
                    out.write(jsonResponse);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.write("{\"error\": \"Incorrect password!\"}");
                }
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.write("{\"error\": \"Incorrect NIC!\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Internal Server Error\"}");
        }
    }
}
