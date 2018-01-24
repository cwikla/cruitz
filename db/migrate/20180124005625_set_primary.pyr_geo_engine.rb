# This migration comes from pyr_geo_engine (originally 20180124005525)
class SetPrimary < ActiveRecord::Migration[5.1]
  def change
    Pyr::Geo::Util::Loader::set_primary
  end
end
