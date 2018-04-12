class Company < ApplicationRecord
  #acts_as_s3_asset :logo

  belongs_to :user
  has_many :jobs, through: :user

  validates :name, presence: true, allow_nil: true

  belongs_to :logo, class_name: "Upload" , foreign_key: :pyr_upload_id

  belongs_to :location, class_name: "GeoName"

  def self.after_cached_user(user)
    c = Company.new(:id => user.company_id)
  end

  def self.after_cached_job(job)
    c = Company.new(:id => job.user.company_id)
  end

end
