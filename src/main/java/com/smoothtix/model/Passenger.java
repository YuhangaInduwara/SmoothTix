package com.smoothtix.model;

public class Passenger {
    private String fname;
    private String lname;
    private String nic;
    private String mobileNo;
    private String email;
    private String password;
    private int priority;

    public Passenger(String fname, String lname, String nic, String mobileNo, String email, String password, int priority){
        this.fname = fname;
        this.lname = lname;
        this.nic = nic;
        this.mobileNo = mobileNo;
        this.email = email;
        this.password = password;
        this.priority = priority;
    }

    public String getfname(){
        return fname;
    }
    public String getlname(){
        return lname;
    }
    public String getnic(){
        return nic;
    }
    public String getmobileNo(){
        return mobileNo;
    }
    public String getemail(){
        return email;
    }
    public String getpassword(){
        return password;
    }
    public int getpriority(){
        return priority;
    }
    public void setfname(String fname){
        this.fname = fname;
    }
    public void setlname(String lname){
        this.lname = lname;
    }
    public void setnic(String nic){
        this.nic = nic;
    }
    public void setmobileNo(String mobileNo){
        this.mobileNo = mobileNo;
    }
    public void setemail(String email){
        this.email = email;
    }
    public void setpassword(String password){
        this.password = password;
    }
    public void setpriority(int priority){
        this.priority = priority;
    }

}
