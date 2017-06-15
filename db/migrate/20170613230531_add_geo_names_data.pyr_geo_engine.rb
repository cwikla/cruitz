# This migration comes from pyr_geo_engine (originally 20170612220155)
class AddGeoNamesData < ActiveRecord::Migration[5.0]
  def up
    cities = {}
    first = {}

    GeoName.reset_column_information
    location = Gem.loaded_specs['pyr_geo'].full_gem_path

    Pyr::Base::Util::File::unpacker("#{location}/data/allCountries/*.gz") do |gzip|
      gzip.each_line do |l|
        #puts "++++ => #{l}"
			  pieces = l.split("\t").map(&:strip)
        #puts "***** => #{pieces[0]}"
        #puts "-----"
			  gname = GeoName.new
			  gname.iso_country = pieces[0].upcase
        gname.postal_code = pieces[1].upcase
        gname.name = pieces[2].upcase
  
        gname.admin_name_1 = pieces[3]
        gname.admin_code_1 = pieces[4]
        gname.admin_name_2 = pieces[5]
        gname.admin_code_2 = pieces[6]
        gname.admin_name_3 = pieces[7]
        gname.admin_code_3 = pieces[8]
        gname.latitude = pieces[9].to_f
        gname.longitude = pieces[10].to_f
        gname.accuracy = pieces[10].to_i
        gname.save
  
        puts "#{gname.iso_country} | #{gname.name} | #{gname.postal_code}"
  
        key = [gname.iso_country.upcase, gname.postal_code.upcase, gname.name.upcase]
        ll = cities[key] || []
        first[key] ||= gname.id
        ll << [gname.latitude, gname.longitude]
        cities[key] = ll
      end
    end

    puts "Crunching cities" 
    cities.each_pair do |key, ll|
      latish, longish = Pyr::Geo::Util::Coder::cluster(ll)
      iso_country, name = key
      fid = first[key]
      
      gname = GeoName.find(fid)
      gname.cluster_latitude = latish
      gname.cluster_longitude = longish
      gname.save

      puts "#{gname.iso_country} | #{gname.name} | #{gname.postal_code} | #{gname.cluster_latitude},#{gname.cluster_longitude}"

    end
  end

  def down
  end
end
