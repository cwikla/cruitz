class Upload < ApplicationRecord
  include Pyr::Base::Model::Upload

  belongs_to :user
  has_many :companies
end

