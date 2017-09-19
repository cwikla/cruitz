class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  acts_as_simple_cache
  acts_as_paranoid

  #include Pyr::Base::UuidHelp
  include Hashid

end
