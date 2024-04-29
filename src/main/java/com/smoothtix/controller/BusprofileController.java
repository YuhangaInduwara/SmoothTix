package com.smoothtix.controller;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.busprofileTable;
import com.smoothtix.model.Busprofile;
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

public class BusprofileController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String bus_profile_id = request.getHeader("bus_profile_id");
        String conductor_id = request.getParameter("conductor_id");
        String driver_id = request.getParameter("driver_id");
        String p_id = request.getHeader("p_id");

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
                    busprofileData.put("conductor_name", rs.getString("conductor_name") );
                    busprofileDataArray.put(busprofileData);
                }
            }

            else{
                ResultSet rs = busprofileTable.getAllDetails(p_id);
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
            out.println(busprofileDataArray);
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
            BufferedReader reader = request.getReader();
            JsonElement jsonElement = JsonParser.parseReader(reader);

            if (jsonElement.isJsonObject()) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                String reg_no = jsonObject.get("reg_no").getAsString();
                String driver_nic = jsonObject.get("driver_nic").getAsString();
                String conductor_nic = jsonObject.get("conductor_nic").getAsString();

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
                out.println(jsonResponse);
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

        try {
            Gson gson = new Gson();
            String busProfileId = request.getHeader("bus_profile_id");
            BufferedReader reader = request.getReader();
            Busprofile busprofile = gson.fromJson(reader, Busprofile.class);

            String busId = busprofileTable.retrieveBusId(busprofile.getBus_id());
            String driverId = busprofileTable.retrieveDriverId(busprofile.getDriver_id());
            String conductorId = busprofileTable.retrieveConductorId(busprofile.getConductor_id());

            int updateSuccess = busprofileTable.update(busProfileId, busId, driverId, conductorId);
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

        try {
            String bus_profile_id = request.getHeader("bus_profile_id");
            int deleteSuccess = busprofileTable.delete(bus_profile_id);

            if (deleteSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


}
