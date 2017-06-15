# This migration comes from pyr_geo_engine (originally 20170614065622)
require 'csv'

ENCODING = "iso-8859-1:UTF-8"

class AddGeoCitiesData < ActiveRecord::Migration[5.0]
  def up
    GeoCity.reset_column_information
    location = Gem.loaded_specs['pyr_geo'].full_gem_path

    i = 0
    Pyr::Base::Util::File::unpacker("#{location}/data/worldcitiespop/*.gz", encoding: ENCODING) do |gzip|
      csv = CSV.new(gzip)
      csv.each do |l|
        i = i + 1
        next if i == 1
    
		    pieces = l.map{ |x| x.nil? ? nil : x.strip }
		    gcity = GeoCity.new
		    gcity.iso_country = pieces[0].upcase
        gcity.city_normalized = pieces[1]
        gcity.city = pieces[2]
    
        gcity.region = pieces[3].to_i
        gcity.population = pieces[4].to_i
        gcity.latitude = pieces[5].to_f
        gcity.longitude = pieces[6].to_f
    
        gcity.save

        puts "#{gcity.iso_country} | #{gcity.city} | #{gcity.population}"
      end
    end
  end

  def down
  end
end
