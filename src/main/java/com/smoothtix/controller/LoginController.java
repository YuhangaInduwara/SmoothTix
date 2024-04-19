package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Login;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.Key;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class LoginController extends HttpServlet {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final Set<String> blacklistedTokens = new HashSet<>();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
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

                LocalDateTime currentDateTime = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String formattedDateTime = currentDateTime.format(formatter);

                if (!resultset.getBoolean("flag")) {
                    if (PasswordHash.checkPassword(plainPassword, hashedPassword)) {
                        // Generate JWT token
                        String jwtToken = Jwts.builder()
                                .setSubject(login.get_nic())
                                .claim("user_name", resultset.getString("first_name") + " " + resultset.getString("last_name"))
                                .claim("user_role", privilege_level)
                                .claim("p_id", resultset.getString("p_id"))
                                .claim("date_time", formattedDateTime)
                                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                                .compact();
                        response.setHeader("Authorization", "Bearer " + jwtToken);

                        HttpSession session = request.getSession();
                        session.setAttribute("p_id", resultset.getString("p_id"));

                        JSONObject userData = new JSONObject();
                        userData.put("user_name", resultset.getString("first_name") + " " + resultset.getString("last_name"));
                        userData.put("nic", login.get_nic());
                        userData.put("user_role", privilege_level);
                        userData.put("p_id", resultset.getString("p_id"));
                        userData.put("token", jwtToken);

                        response.setStatus(HttpServletResponse.SC_OK);
                        out.print(userData);
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

@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    String action = request.getParameter("action");
    System.out.println(action);
    if(Objects.equals(action, "validate")){
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwtToken = authHeader.substring(7);
                if (blacklistedTokens.contains(jwtToken)) {
                    System.out.println("hello2");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.write("{\"error\": \"Unauthorized - Token has been blacklisted!\"}");
                    return;
                }
                try {
                    Jws<Claims> claims = Jwts.parser()
                            .setSigningKey(SECRET_KEY) // Set your secret key
                            .build()
                            .parseClaimsJws(jwtToken);
                    System.out.println(claims);
                    JSONObject userData = new JSONObject();
                    userData.put("user_name", claims.getBody().get("user_name"));
                    userData.put("nic", claims.getBody().getSubject());
                    userData.put("user_role", claims.getBody().get("user_role"));
                    userData.put("p_id", claims.getBody().get("p_id"));
                    userData.put("date_time", claims.getBody().get("date_time"));
                    System.out.println(claims.getBody().get("p_id"));

                    out.print(userData);
                    response.setStatus(HttpServletResponse.SC_OK);
                } catch (Exception e) {
                    System.out.println("hello3");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.write("{\"error\": \"Unauthorized - Invalid token!\"}");
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.write("{\"error\": \"Unauthorized - Missing or invalid token!\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Internal Server Error\"}");
        }
    }
    else if(Objects.equals(action, "logout")) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwtToken = authHeader.substring(7);
            addToBlacklist(jwtToken);

            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        System.out.println(blacklistedTokens);
        out.write("{\"error\": \"Invalid Request!\"}");
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    } else{
        out.write("{\"error\": \"Invalid Request!\"}");
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }
}
    private void addToBlacklist(String token) {
        blacklistedTokens.add(token);
    }
}
