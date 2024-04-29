package com.smoothtix.controller;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Passenger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import static com.smoothtix.controller.PasswordHash.checkPassword;

public class PassengerController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // handle get (retrieve) requests
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();
        // get p_id, flag, nic, privilege level and password from header
        String p_id = request.getHeader("p_id");
        String flag = request.getHeader("flag");
        String nic = request.getParameter("nic");
        String nicForgot = request.getHeader("nic");
        String privilege_level = request.getHeader("privilege_level");
        String password = request.getHeader("password");

        try {
            ResultSet rs;

            // if a p_id and password is sent with the request
            if(p_id != null && password != null){
                String hashedPassword = passengerTable.getPassword(p_id);
                if(checkPassword(password, hashedPassword)){
                    response.setStatus(HttpServletResponse.SC_OK);

                }
                else{
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
                return;
            }

            // if a nic is sent with the request
            if(nicForgot != null){
                rs = passengerTable.getEmailPid(nicForgot);
                // if data are exist add to a json object array
                if(rs.next()) {
                    JsonObject passengerData = new JsonObject();
                    passengerData.addProperty("email", rs.getString("email"));
                    passengerData.addProperty("p_id", rs.getString("p_id"));
                    out.print(passengerData);
                    response.setStatus(HttpServletResponse.SC_OK);
                }else{
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
                return;
            }

            if(p_id == null){
                if(flag == null){
                    if(nic == null){
                        rs = passengerTable.getAll(); // if p_id, flag and nic are null
                    }
                    else{
                        rs = passengerTable.getBy_nic(nic); // // if p_id and nic are null
                    }
                }
                else{
                    if(privilege_level == null){
                        rs = passengerTable.getBy_flag(flag); // if p_id and privilege is null
                    }
                    else{
                        rs = passengerTable.getBy_flag_p_l(flag, privilege_level); // if p_id is null
                    }
                }
            }
            else{
                rs = passengerTable.getBy_p_id(p_id); // if p_id exist
            }

            // if data are exist add to a json object array
            while (rs.next()) {
                JSONObject passengerData = new JSONObject();
                passengerData.put("p_id", rs.getString("p_id"));
                passengerData.put("first_name", rs.getString("first_name"));
                passengerData.put("last_name", rs.getString("last_name"));
                passengerData.put("nic", rs.getString("nic"));
                passengerData.put("email", rs.getString("email"));
                passengerData.put("password", rs.getString("password"));
                passengerData.put("flag", rs.getBoolean("flag"));
                passengerData.put("privilege_level", rs.getInt("privilege_level"));
                passengerDataArray.put(passengerData);
            }

            out.println(passengerDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // handle put (update) requests
        response.setContentType("text/html");

        try {
            // parse the json request data to passenger object
            Gson gson = new Gson();
            String p_id = request.getHeader("p_id");

            BufferedReader reader = request.getReader();
            Passenger passenger = gson.fromJson(reader, Passenger.class);
            int updateSuccess;

            // if passenger's password is not null and not empty
            if(passenger.get_password() != null && !passenger.get_password().isEmpty()){
                String hashedPassword = PasswordHash.hashPassword(passenger.get_password());
                passenger.set_password(hashedPassword);
                updateSuccess = passengerTable.updatePassword(p_id, passenger); // update the database
            }
            // if passenger's flag is not null
            else if(passenger.get_flag() != null){
                updateSuccess = passengerTable.updateFlag(p_id, passenger);
            }
            // if passenger's privilege level is an integer
            else if(passenger.get_privilege_level() >= 1){
                 updateSuccess = passengerTable.updatePrivilegeLevel(p_id, passenger);
            }
            // if only got p_id
            else{
                updateSuccess = passengerTable.update(p_id, passenger);
            }
            if (updateSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // handle delete requests
        response.setContentType("text/html");

        try {
            // get nic from request and pass it to delete from nic
            String nic = request.getHeader("nic");
            int deleteSuccess = passengerTable.delete(nic);
            if (deleteSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}