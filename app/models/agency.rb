class Agency < ApplicationRecord
  has_many :recruiters
  has_many :heads, :through => :recruiters
end
