

COMMISSION = 2.5
RECRUITER = 'recruiter'
NORMIE = 'normie'

class HomeController < ApplicationController

#  skip_before_filter :authenticate_user_by_auth_token!
  skip_before_action :authenticate_user!

  before_action :setup

  def index
  end

  def privacy_policy
  end

  def pricing
  end

  def about
  end

  def why
  end

  def contact
    @contact = Contact.new
  end

  def contact_create
    @contact = Contact.new(contact_params)
    if @contact.save 
      redirect_to root_path
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  def terms
  end

  def privacy
  end

  def recruiters
    @type = RECRUITER
  end

  private
  
  def setup
    @type = NORMIE
    @commission = COMMISSION
  end

  def contact_params
    params.require(:contact).permit(:name, :phone_number, :email, :comment)
  end


end
