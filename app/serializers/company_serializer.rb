class CompanySerializer < ActiveModel::Serializer
  attributes :id,
            :url,
            :name,
            :description,
            :location,
            :logo

  #belongs_to :user
  belongs_to :logo, class_name: "Upload" , foreign_key: :pyr_upload_id

  def id
    object.hashid
  end

  def logo_bob
    object.logo
    #serializer = ActiveModel::Serializer.serializer_for(object.logo).new(object.logo)
    #ActiveModel::Serializer::Adapter::Json.new(serializer).as_json
  end


end
