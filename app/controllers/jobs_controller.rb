class JobsController < ApplicationController

  def new
    @job = Job.new
  end

  def create
    current_user.jobs.create(job_params)
  end

  private

  def job_params
    params(:job).permit(:title, :description)
  end
end
