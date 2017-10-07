class Company < ApplicationRecord
  cached_has_many :users
  cached_has_many :jobs, :through => :users

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
