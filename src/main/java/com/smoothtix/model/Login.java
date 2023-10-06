package com.smoothtix.model;

public class Login {
    private String nic;
    private String password;

    public Login(String nic, String password){
        this.nic = nic;
        this.password = password;
    }

    public String getnic(){
        return nic;
    }
    public String getpassword(){
        return password;
    }
    public void setnic(){
        this.nic = nic;
    }
    public void setpassword(){
        this.password = password;
    }

}
