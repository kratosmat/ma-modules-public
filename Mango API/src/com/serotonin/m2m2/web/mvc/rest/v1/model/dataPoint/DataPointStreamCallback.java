/**
 * Copyright (C) 2015 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.serotonin.m2m2.web.mvc.rest.v1.model.dataPoint;

import java.io.IOException;

import com.serotonin.m2m2.db.dao.DataPointDao;
import com.serotonin.m2m2.vo.DataPointVO;
import com.serotonin.m2m2.vo.User;
import com.serotonin.m2m2.vo.permission.PermissionException;
import com.serotonin.m2m2.vo.permission.Permissions;
import com.serotonin.m2m2.web.mvc.rest.v1.MangoVoRestController;
import com.serotonin.m2m2.web.mvc.rest.v1.model.DataPointModel;
import com.serotonin.m2m2.web.mvc.rest.v1.model.VoStreamCallback;

/**
 * Class to discard any data points that the user does not have access to during a query response.
 * 
 * @author Terry Packer
 *
 */
public class DataPointStreamCallback extends VoStreamCallback<DataPointVO, DataPointModel, DataPointDao>{

	private final User user;
	
	/**
	 * @param controller
	 */
	public DataPointStreamCallback(
			MangoVoRestController<DataPointVO, DataPointModel, DataPointDao> controller,
			User user) {
		super(controller);
		this.user = user;

	}

	/**
	 * Do the work of writing the VO
	 * @param vo
	 * @throws IOException
	 */
	@Override
	protected void writeJson(DataPointVO vo) throws IOException{
		
		try{
    		if(Permissions.hasDataPointReadPermission(user, vo)){
    			DataPointModel model = this.controller.createModel(vo);
    			this.jgen.writeObject(model);
    		}
    	}catch(PermissionException e){
    		//Munched
    	}
		
		
	}
	@Override
	protected void writeCsv(DataPointVO vo) throws IOException{
		try{
    		if(Permissions.hasDataPointReadPermission(user, vo)){
    			DataPointModel model = this.controller.createModel(vo);
    			this.csvWriter.writeNext(model);
    		}
    	}catch(PermissionException e){
    		//Munched
    	}
		
	}
	
}
