# This migration comes from pyr_geo_engine (originally 20180124005500)
class Recluster < ActiveRecord::Migration[5.1]
  def up
    Pyr::Geo::Util::Loader::recluster
  end
end
