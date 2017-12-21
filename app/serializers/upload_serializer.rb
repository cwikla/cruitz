class UploadSerializer < ActiveModel::Serializer
  attributes  :key,
              :bucket_name,
              :file_name,
              :url,
              :path,
              :full_name,
              :sub_type,
              :content_type,
              :url

  belongs_to :user
end

