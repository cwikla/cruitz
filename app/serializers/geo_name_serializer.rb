class GeoNameSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :admin_code_1,
    :iso_country,
    :postal_code,
    :full_name,
    :is_primary

  def is_postal?(pc)
    GeoName.looks_postal?(pc)
  end

  def full_name
    object.full_name(postal_code: is_postal?(instance_options[:query]))
  end



end
