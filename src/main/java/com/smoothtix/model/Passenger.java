package com.smoothtix.model;

public class Passenger {
    private String fname;
    private String lname;
    private String nic;
    private String mobileNo;
    private String email;
    private String password;

    public Passenger(String fname, String lname, String nic, String mobileNo, String email, String password){
        this.fname = fname;
        this.lname = lname;
        this.nic = nic;
        this.mobileNo = mobileNo;
        this.email = email;
        this.password = password;
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

    public void setfname(){
        this.fname = fname;
    }

    public void setlname(){
        this.lname = lname;
    }

    public void setnic(){
        this.nic = nic;
    }

    public void setmobileNo(){
        this.mobileNo = mobileNo;
    }

    public void setemail(){
        this.email = email;
    }

    public void setpassword(){
        this.password = password;
    }

}
