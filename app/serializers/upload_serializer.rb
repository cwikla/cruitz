class UploadSerializer < ActiveModel::Serializer
  attributes  :content_type,
              :file_name,
              :url

  #belongs_to :user
  #has_many :companies

  def url
    return object.url
  end
end

