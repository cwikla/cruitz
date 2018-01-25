# This migration comes from pyr_geo_engine (originally 20180124233800)
class Reprimary < ActiveRecord::Migration[5.1]
  def change
    GeoName.reset_column_information

    Pyr::Geo::Util::Loader::reprimary
  end
end
