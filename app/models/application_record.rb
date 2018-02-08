class ApplicationRecord < ActiveRecord::Base
  include Pyr::Base::SimpleCache
  include Pyr::Base::S3::ActsAsS3Asset
  include PgSearch

  self.abstract_class = true

  acts_as_simple_cache
  acts_as_paranoid

  #include Pyr::Base::UuidHelp
  #include Hashid

  pg_search_scope :search_name, against: :name #, using: :trigram

  def self.ids
    select(:id).map(&:id).uniq
  end

  def self.hashid(hid)
    return hid
  end

  def self.dehashid(hid)
    return hid
  end

  def hashid
    return self.id
  end

  def s3_upload_col(col, options)
    puts "S3 upload col"
    super
  end

  def self.simple_search(name)
    where("lower(name) like ?", "%" + name.downcase + "%")
  end

end
