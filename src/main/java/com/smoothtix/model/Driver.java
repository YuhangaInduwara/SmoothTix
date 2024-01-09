package com.smoothtix.model;

public class Driver {
    String driver_id;
    String passenger_id;
    String licence_no;
    String name;
    String nic;
    String mobile;
    String email;
    String points;

    public Driver(String driver_id, String passenger_id, String licence_no, String name, String nic, String mobile, String email, String points){
        this.driver_id = driver_id;
        this.passenger_id = passenger_id;
        this.licence_no = licence_no;
        this.name = name;
        this.nic = nic;
        this.mobile = mobile;
        this.email = email;
        this.points = points;
    }

    public String getDriver_id(){
        return driver_id;
    }
    public String getPassenger_id(){ return passenger_id; }
    public String getLicence_no(){ return licence_no; }
    public String getName(){
        return name;
    }
    public String getNic(){
        return nic;
    }
    public String getMobile(){
        return mobile;
    }
    public String getEmail(){
        return email;
    }
    public String getPoints(){
        return points;
    }


    public void setDriver_id(String driver_id){
        this.driver_id = driver_id;
    }
    public void setPassenger_id(String passenger_id){
        this.passenger_id = passenger_id;
    }
    public void setLicence_no(String licence_no){this.licence_no = licence_no; }
    public void setName(String name){ this.name = name; }
    public void setNic(String nic){ this.nic = nic; }
    public void setMobile(String mobile){ this.mobile = mobile; }
    public void setEmail(String email){
        this.email = email;
    }
    public void setPoints(String points){
        this.points = points;
    }

<<<<<<< HEAD
}
=======
}

>>>>>>> f09315cfbd28407d7638b0099ffb0e187081eb71
