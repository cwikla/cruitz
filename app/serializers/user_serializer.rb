class UserSerializer < ActiveModel::Serializer
  attributes :id, 
    :email, 
    :first_name,
    :last_name,
    :full_name,
    :created_at,
    :updated_at,
    :is_recruiter,
    :logo

  has_one :company
  belongs_to :logo, class_name: "Upload" , foreign_key: :pyr_upload_id

  def id
    object.hashid
  end

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def updated_at
    object.updated_at.in_time_zone.iso8601 if object.created_at
  end
end
