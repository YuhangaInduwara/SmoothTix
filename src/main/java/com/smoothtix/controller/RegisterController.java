package com.smoothtix.controller;

import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Passenger;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "RegisterController", value = "/registerController")
public class RegisterController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String fname = request.getParameter("fName");
        String lname = request.getParameter("lName");
        String nic = request.getParameter("nic");
        String mobileNo = request.getParameter("mobileNo");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        try{
            Passenger passenger = new Passenger(fname, lname, nic, mobileNo, email, password);
            passengerTable.insert(passenger);
            System.out.println("Username: " + fname);
            System.out.println("password: " + password);
            out.write("Data inserted successfully");
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}