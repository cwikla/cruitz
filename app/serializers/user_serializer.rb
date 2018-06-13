class UserSerializer < BaseSerializer
  attributes :id, 
    :uuid,
    :email, 
    :first_name,
    :last_name,
    :full_name,
    #:created_at,
    #:updated_at,
    :is_recruiter,
    :company

  has_one :company
  belongs_to :logo, class_name: "Upload" , foreign_key: :upload_id

  def id
    object.hashid
  end

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def updated_at
    object.updated_at.in_time_zone.iso8601 if object.updated_at
  end

  #def company
    #object.company ? CompanySerializer.new(object.company) : {}
  #end
end
