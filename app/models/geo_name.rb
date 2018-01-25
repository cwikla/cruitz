class GeoName < ApplicationRecord
  include Pyr::Geo::Model::Name
  class << self
    alias_method :geo_name_search, :search
    alias_method :geo_city_search, :city_search
  end

  has_many :job_locations

  MIN_LENGTH = 2

  def self.city_search(s, **options)
    return is_primary.geo_city_search(s, **options)
  end

  def self.search_ids(s) 
    return nil if (s.length < MIN_LENGTH)
    cache_fetch(s) {
      geo_name_search(s).ids
    }
  end

  def self.search(s)
    return nil if (s.length < MIN_LENGTH)
    self.find(search_ids(s))
  end

  def full_name(**options)
    uname = name.strip.upcase
    ucity = admin_code_1.strip.upcase
    upostal_code = postal_code.strip.upcase if postal_code
    ucountry = (iso_country || "US").strip.upcase

    fn = [uname, ucity].join(", ")
    if options[:postal_code]
      fn = fn + ", #{upostal_code}"
    end

    if options[:iso_country] | !["US"].include?(ucountry.upcase)
      fn = fn + ", #{ucountry}"
    end

    #"#{self.id}: " + fn

    return fn
  end


end
