/*
    Copyright (C) 2014 Infinite Automation Systems Inc. All rights reserved.
    @author Matthew Lohbihler
 */
package com.serotonin.m2m2.watchlist;

import org.apache.commons.lang3.StringUtils;

import com.serotonin.ShouldNeverHappenException;
import com.serotonin.m2m2.web.dwr.beans.BasePointState;

public class WatchListState extends BasePointState {
    private String value;
    private String time;

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public WatchListState clone() {
        try {
            return (WatchListState) super.clone();
        }
        catch (CloneNotSupportedException e) {
            throw new ShouldNeverHappenException(e);
        }
    }

    public void removeEqualValue(WatchListState that) {
    	//Don't call super removeEqualValue as we want to always keep the messages
        if (StringUtils.equals(getChange(), that.getChange()))
            setChange(null);
        if (StringUtils.equals(getChart(), that.getChart()))
            setChart(null);
        
        if (StringUtils.equals(value, that.value))
            value = null;
        if (StringUtils.equals(time, that.time))
            time = null;
    }

    @Override
    public boolean isEmpty() {
        return value == null && time == null && super.isEmpty();
    }
}
