package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Login;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.json.JSONException;
import org.json.JSONObject;

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
            ResultSet resultset = passengerTable.getBy_nic(login.get_nic());
            String plainPassword = login.get_password();

            if (resultset.next()) {
                String hashedPassword = resultset.getString("password");
                int privilege_level = resultset.getInt("privilege_level");

                if(!resultset.getBoolean("flag")){
                    if (PasswordHash.checkPassword(plainPassword, hashedPassword)) {
                        HttpSession session = request.getSession();

                        session.setAttribute("nic", login.get_nic());
                        session.setAttribute("user_name", resultset.getString("first_name") + " " + resultset.getString("last_name"));
                        session.setAttribute("user_role", privilege_level);
                        session.setMaxInactiveInterval(30*60);
                        Cookie userName = new Cookie("nic", login.get_nic());
                        userName.setMaxAge(30*60);
                        response.addCookie(userName);
                        JSONObject sessionData = new JSONObject();
                        try {
                            sessionData.put("user_name", session.getAttribute("user_name"));
                            sessionData.put("nic", session.getAttribute("nic"));
                            sessionData.put("user_role", session.getAttribute("user_role"));
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }
                        try (PrintWriter out1 = response.getWriter()) {
                            out1.print(sessionData.toString());
                            response.setStatus(HttpServletResponse.SC_OK);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } else {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        out.write("{\"error\": \"Incorrect password!\"}");
                    }
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.write("{\"error\": \"You are not allowed to login!\"}");
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
