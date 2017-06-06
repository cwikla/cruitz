class Company < ApplicationRecord
  has_many :employers
  has_many :positions, :through => :employers
end
