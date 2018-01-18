class Upload < ActiveRecord::Base
  acts_as_simple_cache :key

  include Pyr::Base::Model::Upload

  belongs_to :user
  has_many :companies
end

