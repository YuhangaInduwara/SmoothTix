package com.smoothtix.model;

public class Owner {
    private String owner_id;
    private String p_id;
    public Owner() {
    }

    public Owner(String owner_id, String p_id, String owner_name) {
        this.owner_id = owner_id;
        this.p_id = p_id;
    }

    // Getters and setters
    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }

    public String getP_id() {
        return p_id;
    }

    public void setP_id(String p_id) {
        this.p_id = p_id;
    }



    // Override toString() method for debugging purposes
    @Override
    public String toString() {
        return "Owner{" +
                "owner_id='" + owner_id + '\'' +
                ", p_id='" + p_id + '\'' +
                '}';
    }
}
