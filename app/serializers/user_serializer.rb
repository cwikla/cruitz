class UserSerializer < ActiveModel::Serializer
  attributes :id, 
    :uuid,
    :email, 
    :first_name,
    :last_name,
    :full_name,
    :created_at

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def updated_at
    object.updated_at.in_time_zone.iso8601 if object.created_at
  end
end
