package com.smoothtix.controller;

import com.smoothtix.dao.passengerTable;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;

@WebServlet(name = "LoginController", value = "/loginController")
public class LoginController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String nic = request.getParameter("nic");
        String password = request.getParameter("password");
        try {
            ResultSet resultset = passengerTable.get(nic);
            String pw = null;
            if (resultset.next()) {
                pw = resultset.getString("password");
            } else {
                out.write("No such NIC");
            }
            if(Objects.equals(pw, password)){
                System.out.println("password: " + password);
                out.write("Login successful");
            } else{
                System.out.println("password: " + password);
                out.write("Login Unsuccessful");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

    }
}