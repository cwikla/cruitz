class GeoName < ApplicationRecord
  include Pyr::Geo::Model::Name
  class << self
    alias_method :geo_name_search, :search
  end

  MIN_LENGTH = 2


  def self.search_ids(s) 
    return nil if (s.length < MIN_LENGTH)
    cache_fetch(s) {
      geo_name_search(s).map(&:id).uniq
    }
  end

  def self.search(s)
    return nil if (s.length < MIN_LENGTH)
    self.find(search_ids(s))
  end

end
