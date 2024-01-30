package com.smoothtix.model;

public class TimeKeeper {
    private final String timekpr_id;
    private final String p_id;
    private final String stand;

    public TimeKeeper(String timekpr_id, String p_id, String stand){
        this.timekpr_id = timekpr_id;
        this.p_id = p_id;
        this.stand = stand;
    }

    public String get_timekpr_id(){
        return timekpr_id;
    }
    public String get_p_id(){
        return p_id;
    }
    public String get_stand(){
        return stand;
    }


}
