class GeoNameSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :admin_code_1,
    :iso_country,
    :postal_code,
    :full_name

  def full_name
    [object.name, object.admin_code_1].join(", ")
  end

end
