class LoadCities < ActiveRecord::Migration[5.1]
  def up
    Pyr::Geo::Util::Loader::cities("US")
    Pyr::Geo::Util::Loader::cities("CA")
  end

  def down
    Pyr::Geo::Util::Loader::delete_cities("ALL")
  end
end
