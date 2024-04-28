package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.busprofileTable;
import com.smoothtix.dao.driverTable;
import com.smoothtix.model.Busprofile;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BusprofileController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String bus_profile_id = request.getHeader("bus_profile_id");
        String conductor_id = request.getParameter("conductor_id");
        String driver_id = request.getParameter("driver_id");
        String p_id = request.getHeader("p_id");

        System.out.println("BP_P_ID"+p_id);
        System.out.println("BP_C_ID"+conductor_id);

        try {
            JSONArray busprofileDataArray = new JSONArray();

            if (p_id== null && conductor_id== null&& driver_id==null){
                ResultSet rs = busprofileTable.getByBPId(bus_profile_id);

                while (rs.next()) {
                    JSONObject busprofileData = new JSONObject();
                    busprofileData.put("bus_profile_id", rs.getString("bus_profile_id"));
                    busprofileData.put("reg_no", rs.getString("reg_no"));
                    busprofileData.put("driver_nic", rs.getString("driver_nic"));
                    busprofileData.put("conductor_nic", rs.getString("conductor_nic"));
                    busprofileDataArray.put(busprofileData);
                }

            }
            else if (p_id == null&&driver_id==null){
                ResultSet rs = busprofileTable.getBPbyc_id(conductor_id);
                while (rs.next()) {
                    JSONObject busprofileData = new JSONObject();
                    busprofileData.put("reg_no", rs.getString("reg_no"));
                    busprofileData.put("route_no", rs.getString("route_no"));
                    busprofileData.put("route", rs.getString("start") + " - " + rs.getString("destination"));
                    busprofileData.put("driver_name", rs.getString("driver_name") );
                    busprofileData.put("conductor_name", rs.getString("conductor_name") );
                    busprofileDataArray.put(busprofileData);
                }

            }
            else if (p_id == null&& conductor_id==null){
                ResultSet rs = busprofileTable.getBPbyd_id(driver_id);

                while (rs.next()) {
                    JSONObject busprofileData = new JSONObject();
                    busprofileData.put("reg_no", rs.getString("reg_no"));
                    busprofileData.put("route_no", rs.getString("route_no"));
                    busprofileData.put("route", rs.getString("start") + " - " + rs.getString("destination"));
                    busprofileData.put("driver_name", rs.getString("driver_name") );
                    //busprofileData.put("driver_id", rs.getString("driver_id"));
                    busprofileData.put("conductor_name", rs.getString("conductor_name") );
                    //busprofileData.put("conductor_id", rs.getString("conductor_id"));

                    busprofileDataArray.put(busprofileData);
                }

            }

            else{
                ResultSet rs = busprofileTable.getAllDetails(p_id);
//                JSONArray busprofileDataArray = new JSONArray();
                while (rs.next()) {
                    JSONObject busprofileData = new JSONObject();
                    busprofileData.put("bus_profile_id", rs.getString("bus_profile_id"));
                    busprofileData.put("bus_registration_no", rs.getString("bus_registration_no"));
                    busprofileData.put("route", rs.getString("route_start") + " - " + rs.getString("route_destination"));
                    busprofileData.put("driver_name", rs.getString("driver_first_name") + " " + rs.getString("driver_last_name"));
                    busprofileData.put("driver_nic", rs.getString("driver_nic"));
                    busprofileData.put("conductor_name", rs.getString("conductor_first_name") + " " + rs.getString("conductor_last_name"));
                    busprofileData.put("conductor_nic", rs.getString("conductor_nic"));

                    busprofileDataArray.put(busprofileData);
                }

            }
            // Send JSON data as a response
            out.println(busprofileDataArray.toString());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();

        try {
            // Read JSON data from the request
            BufferedReader reader = request.getReader();
            JsonElement jsonElement = JsonParser.parseReader(reader);

            if (jsonElement.isJsonObject()) {
                // Parse the JSON object
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                String reg_no = jsonObject.get("reg_no").getAsString();
                String driver_nic = jsonObject.get("driver_nic").getAsString();
                String conductor_nic = jsonObject.get("conductor_nic").getAsString();

                // Call the insert method with the parsed parameters
                int result = busprofileTable.insert(reg_no, driver_nic, conductor_nic);

                JsonObject jsonResponse = new JsonObject();
                if (result == 1) {
                    jsonResponse.addProperty("message", "Insertion successful");
                    response.setStatus(HttpServletResponse.SC_OK);
                } else if (result == 0) {
                    jsonResponse.addProperty("error", "Bus, driver, or conductor not found");
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                } else {
                    jsonResponse.addProperty("error", "Insertion failed");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
                out.println(jsonResponse.toString()); // Send JSON response
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"error\": \"Invalid JSON data\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"Internal server error\"}");
        }
    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();
            String busProfileId = request.getHeader("bus_profile_id");
            System.out.println(busProfileId);
            BufferedReader reader = request.getReader();
            Busprofile busprofile = gson.fromJson(reader, Busprofile.class);

            // Retrieve bus_id, driver_id, and conductor_id based on provided reg_no, driver_nic, and conductor_nic
            String busId = busprofileTable.retrieveBusId(busprofile.getBus_id());
            System.out.println(busId);
            String driverId = busprofileTable.retrieveDriverId(busprofile.getDriver_id());
            System.out.println(driverId);
            String conductorId = busprofileTable.retrieveConductorId(busprofile.getConductor_id());

            // Update bus_profile table with retrieved IDs
            int updateSuccess = busprofileTable.update(busProfileId, busId, driverId, conductorId);
            System.out.println(updateSuccess);
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
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            String bus_profile_id = request.getHeader("bus_profile_id");
            int deleteSuccess = busprofileTable.delete(bus_profile_id);

            if (deleteSuccess >= 1) {
                System.out.println(deleteSuccess);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                System.out.println(deleteSuccess);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


}
