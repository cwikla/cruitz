class CompanyLocation < ApplicationRecord
  belongs_to :company
  belongs_to :location, class_name: "GeoName"
end
