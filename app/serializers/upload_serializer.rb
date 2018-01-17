class UploadSerializer < ActiveModel::Serializer
  attributes  :key,
              :content_type,
              :full_name,
              :file_name,
              :url

  belongs_to :user
end

