class CompanySerializer < ActiveModel::Serializer
  attributes :id,
            :url,
            :name,
            :description
            #:created_at,
            #:logo

  has_many :locations

  #belongs_to :user
  #belongs_to :logo, class_name: "Upload" , foreign_key: :pyr_upload_id
  belongs_to :logo, class_name: "Upload" , foreign_key: :upload_id

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def logo_unused
    return nil if object.logo.nil?

    return UploadSerializer.new(object.logo)

    puts("SERIALIZER");
    puts(serializer).inspect

    asdf

    #ActiveModelSerializers::Adapter::Json.new(serializer).as_json[:upload] # Hmmmmm

    #object.logo ? object.logo.public_url : nil
  end


end
