class Upload < ApplicationRecord
  include Pyr::Base::Model::Upload

  belongs_to :user
  has_many :companies

  def self.make(user, name)
    rec = Upload.new
    rec.bucket_name = ::S3_BUCKET_NAME
    rec.user = user
    rec.file_name = name

    return rec
  end
end

