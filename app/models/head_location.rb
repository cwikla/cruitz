class HeadLocation < ApplicationRecord
  belongs_to :head
  belongs_to :location, class_name: "GeoName"

end
