# This migration comes from pyr_geo_engine (originally 20180208224444)
class ConnectPrimaryId < ActiveRecord::Migration[5.1]
  def up
    GeoName.reset_column_information

    GeoName.where(is_primary: true).find_each do |geo|
      q = GeoName.where(is_primary: false)
      q = q.where("lower(iso_country) = ?", geo.iso_country.downcase)
      q = q.where("lower(name) = ?", geo.name.downcase)
      q = q.where("lower(admin_code_1) = ?", geo.admin_code_1.downcase)

      q.update_all(primary_id: geo.id)
    end
  end
end
