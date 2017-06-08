class Company < ApplicationRecord
  has_many :employers
  has_many :jobs, :through => :employers
end
