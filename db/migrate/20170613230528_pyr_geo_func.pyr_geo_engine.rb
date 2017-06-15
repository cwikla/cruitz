# This migration comes from pyr_geo_engine (originally 20151218014224)
class PyrGeoFunc < ActiveRecord::Migration
  def up
    execute <<CMD
-- Haversine Formula based pyr_geo_distance in miles (constant is diameter of Earth in miles)
-- Based on a similar PostgreSQL function found here: https://gist.github.com/831833
-- Updated to use distance formulas found here: http://www.codecodex.com/wiki/Calculate_distance_between_two_points_on_a_globe
CREATE OR REPLACE FUNCTION pyr_geo_distance(alat double precision, alng double precision, blat double precision, blng double precision)
  RETURNS double precision AS 
$BODY$
SELECT asin(
  sqrt(
    sin(radians($3-$1)/2)^2 +
    sin(radians($4-$2)/2)^2 *
    cos(radians($1)) *
    cos(radians($3))
  ) 
) * 7926.3352 AS distance;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;
CMD

  end

  def down
  end
end

