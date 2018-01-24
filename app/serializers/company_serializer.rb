class CompanySerializer < ActiveModel::Serializer
  attributes :id,
            :url,
            :name,
            :description,
            :location,
            :logo,
            :created_at

  #belongs_to :user
  belongs_to :logo, class_name: "Upload" , foreign_key: :pyr_upload_id

  def id
    object.hashid
  end

  def logo
    serializer = UploadSerializer.new(object.logo)
    ActiveModelSerializers::Adapter::Json.new(serializer).as_json[:upload] # Hmmmmm

    #object.logo ? object.logo.public_url : nil
  end


end
