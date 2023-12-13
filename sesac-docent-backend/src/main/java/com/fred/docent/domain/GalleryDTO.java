package com.fred.docent.domain;

import lombok.Data;

@Data
public class GalleryDTO {
	
	private Long gallery_id;
	private String gallery_name;
	private String gallery_location;
	private String gallery_number;
	private String gallary_url;
	private int gallary_valid;
}
