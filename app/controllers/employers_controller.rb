class EmployersController < ApplicationController

  def index
    @employer = current_user.employer
    @jobs = @employer.jobs.open
  end

  private

  def user_params
  end
end
