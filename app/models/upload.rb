class Upload < ApplicationRecord
  include Pyr::Base::Model::Upload

  belongs_to :user
  has_many :companies

  before_create :add_path

  def self.make(user, name)
    rec = Upload.new
    rec.bucket_name = ::S3_BUCKET_NAME
    rec.user = user
    rec.file_name = name
    rec.uuid = SecureRandom::uuid
    rec.path = rec.uuid

    return rec
  end

  private

  def add_path
    self.check_uuid
    self.path ||= self.uuid
  end
end

