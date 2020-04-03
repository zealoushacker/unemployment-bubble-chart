# pull state shapefiles from census
# https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_us_state_20m.zip
build/cb_2018_us_state_20m.zip:
	mkdir -p $(dir $@)
	curl -o $@ http://www2.census.gov/geo/tiger/GENZ2018/$(notdir $@)

# unzip shape files
build/cb_2018_us_state_20m.shp: build/cb_2018_us_state_20m.zip
	unzip -od $(dir $@) $<
	touch $@

# convert shapefiles to TopoJSON
build/state.json: build/cb_2018_us_state_20m.shp
	node_modules/.bin/topojson \
		-o $@ \
		--projection='width = 960, height = 600, d3.geo.albersUsa() \
			.scale(1280) \
			.translate([width / 2, height / 2])' \
		--simplify=.5 \
		-- states=$<
