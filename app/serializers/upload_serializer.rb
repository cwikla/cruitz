class UploadSerializer < ActiveModel::Serializer
  attributes  :id,
              :content_type,
              :file_name,
              :url

  def id
    return object.uuid
  end

  def url
    object.public_url
  end

  def attributes(*args)
    hash = super
    if instance_options[:signed]
      hash[:signed_url] = object.signed_url
    end

    hash
  end

  
end

