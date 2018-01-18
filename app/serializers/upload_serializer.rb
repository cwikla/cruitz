class UploadSerializer < ActiveModel::Serializer
  attributes  :id,
              :content_type,
              :file_name,
              :url

  def id
    return object.uuid
  end

  def url
    instance_options[:signed] ? object.signed_url : object.public_url
  end
  
end

