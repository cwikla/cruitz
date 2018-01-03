class LoadGeoNames < ActiveRecord::Migration[5.1]
  def up
    Pyr::Geo::Util::Loader::country("US")
    Pyr::Geo::Util::Loader::country("CA")
  end

  def down
    Pyr::Geo::Util::Loader::delete_country("ALL")
  end
end
