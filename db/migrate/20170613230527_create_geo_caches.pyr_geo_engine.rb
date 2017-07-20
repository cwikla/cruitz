# This migration comes from pyr_geo_engine (originally 20130313205246)
class CreateGeoCaches < ActiveRecord::Migration[4.2]
  def change
    create_table(:pyr_geo_caches) do |t|
      t.timestamps
      t.decimal :latitude, :precision => 9, :scale => 6, :null => false
      t.decimal :longitude, :precision => 9, :scale => 6, :null => false
      t.string :city, :limit => 64
      t.string :state, :limit => 64
      t.string :country, :limit => 2
      t.string :postal_code, :limit => 12
      t.string :address
    end

    add_index :pyr_geo_caches, [:latitude, :longitude], :unique => true, :name => :gcllidx
    add_index :pyr_geo_caches, [:city, :state, :country]
    add_index :pyr_geo_caches, [:postal_code, :country]
  end
end
