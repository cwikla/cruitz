class Company < ApplicationRecord
  cached_belongs_to :user
  cached_has_many :jobs, through: :users

  validates :name, presence: true, allow_nil: true

  def self.after_cached_user(user)
    c = Company.new(:id => user.company_id)
    c.users_uncache
    c.jobs_uncache
  end

  def self.after_cached_job(job)
    c = Company.new(:id => job.user.company_id)
    c.jobs_uncache
  end

end
