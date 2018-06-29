class HeadsController < ApplicationController
  def index
    render json: current_user.heads
  end

  def show
    head = Head.find(params[:id])
    head = nil if head.user_id != current_user.id
    render json: head
  end

  def create
    hparms = head_new_params
    puts hparms

    @head = Head.submit(current_user, hparms)

    return render json: head if @head.valid?

    render_create_error json: @head
  end

  private

  def head_new_params
    # https://github.com/rails/rails/issues/9454#issuecomment-14167664
    #exp_keys = params[:head][:experiences][:new].keys
    #puts "EXP_KEYS"
    #puts exp_keys

    # Couldn't get nested to work for experiences, so FIXME
    #http://api.rubyonrails.org/classes/ActionController/Parameters.html#method-i-permit

    # Looks like there is a rails hack that is called "easier"
    # https://stackoverflow.com/questions/14483963/rails-4-0-strong-parameters-nested-attributes-with-a-key-that-points-to-a-hash

    # whatever #FIXME

    exp_parms = [:id, :exp_type, :title, :place, :year_start, :year_end, :description] # this sucks Rails

    params.require(:head).permit(:first_name, :last_name, :email, :phone_number, experiences: exp_parms, skills: [], uploads: [])
  end


end
