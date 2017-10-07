class ApplicationRecord < ActiveRecord::Base
  include Pyr::Base::SimpleCache

  self.abstract_class = true

  acts_as_simple_cache
  acts_as_paranoid

  #include Pyr::Base::UuidHelp
  #include Hashid

  def self.hashid(hid)
    return hid
  end

  def self.dehashid(hid)
    return hid
  end

  def hashid
    return self.id
  end

end
